import * as PIXI from 'pixi.js'
import type { Animations, Unit, Hero, Turn, AttackAnimationData } from './types'
import { processAnimations } from './animations/animation-utils'
import { heroAttackAnimationData, enemyAttackAnimationData } from './constants'
import { getAnimationAttackDelay, getTextYOffset, waitForMS } from './game-utils'
import signal from './signal'
import { App } from './App'
import { gsap } from 'gsap'

export class Character {
    private app: App
    private animations: Animations = {}
    private currentAnimationState: string = ''

    public parent: PIXI.Container = new PIXI.Container()
    public sprite: PIXI.AnimatedSprite | null = null
    private hpBar: PIXI.Container | null = null

    private targetPosition: PIXI.Point | null = null
    private moveSpeed: number = 0
    private moveTicker: PIXI.Ticker | null = null
    private moveResolver: ((value: void | PromiseLike<void>) => void) | null = null

    public unit: Unit | Hero
    public initialX: number = 0
    public initialY: number = 0

    private halting: boolean = false
    private attackTimeout: NodeJS.Timeout | null = null

    private haltResolve: (() => void) | null = null
    private attackAnimationData: AttackAnimationData

    constructor(unit: Unit | Hero, app: App) {
        this.unit = unit
        this.app = app

        if (this.unit.type === 'hero') {
            this.attackAnimationData = heroAttackAnimationData
        } else {
            this.attackAnimationData = enemyAttackAnimationData
        }
    }

    public reset = (unit: Unit | Hero) => {
        this.unit = structuredClone(unit)
        if (this.sprite) {
            this.sprite.alpha = 1
        }
        this.updateHpBar()
        this.showHpBar()
    }

    public async init() {
        this.animations = await processAnimations(this.unit.type)
        this.sprite = new PIXI.AnimatedSprite(Object.values(this.animations)[0])
        this.sprite.loop = true
        this.sprite.animationSpeed = 0.2

        this.parent.addChild(this.sprite)

        this.makeHealthBar()
        this.updateHpBar()
    }

    private makeHealthBar() {
        const hpBar = new PIXI.Container()
        this.hpBar = hpBar
        const hpBackground = new PIXI.Sprite(PIXI.Texture.from('/game-assets/hp-bar.png'))
        
        let y = 5
        if (this.unit.type !== 'hero') {
            y = -45
        }

        hpBar.y = y
        hpBar.x = -hpBackground.width / 2
        hpBar.addChild(hpBackground)

        const yellowRectangle = new PIXI.Graphics()
        yellowRectangle.rect(0, 0, 30, 2)
        yellowRectangle.fill({
            color: 0xf5c842,
        })
        yellowRectangle.y = 1
        yellowRectangle.x = 1
        hpBar.addChild(yellowRectangle)

        this.parent.addChild(hpBar)
    }

    public hideHpBar() {
        if (this.hpBar) {
            this.hpBar.visible = false
        }
    }

    public showHpBar() {
        if (this.hpBar) {
            this.hpBar.visible = true
        }
    }

    public setHp(amount: number) {
        const oldHp = this.unit.hp
        this.unit.hp = amount

        this.updateHpBar(oldHp)
    }

    public updateHpBar(oldHp?: number) {
        if (!this.hpBar) return

        if (oldHp === undefined) {
            oldHp = this.unit.hp
        }

        const hpRatio = this.unit.hp / this.unit.maxHp
        const yellowRectangle = this.hpBar.children[1] as PIXI.Graphics
        const oldWidth = oldHp / this.unit.maxHp * 30
        const newWidth = hpRatio * 30
        if (oldHp > this.unit.hp) {
            const redWidth = oldWidth - newWidth
            const redRectangle = new PIXI.Graphics()
            redRectangle.rect(0, 0, redWidth, 2)
            redRectangle.fill({
                color: 0xFF0000,
            })
            redRectangle.y = 1
            redRectangle.x = newWidth + 1
            this.hpBar.addChild(redRectangle)

            gsap.to(redRectangle, {
                width: 0,
                duration: 0.5, 
                ease: "power2.out", 
                onComplete: () => {
                    this.hpBar!.removeChild(redRectangle)
                    if (this.unit.hp <= 0) {
                        this.hpBar!.visible = false
                        this.fadeOut()
                    }
                }
            })

            yellowRectangle.width = newWidth

        } else if (oldHp < this.unit.hp) {
            const greenWidth = newWidth - oldWidth
            const greenRectangle = new PIXI.Graphics()
            greenRectangle.rect(0, 0, 1, 2)
            greenRectangle.fill({
                color: 0x40e66d,
            })

            greenRectangle.y = 1
            greenRectangle.x = oldWidth + 1
            this.hpBar.addChild(greenRectangle)

            gsap.to(greenRectangle, {
                width: greenWidth,
                duration: 0.5, 
                ease: "power2.out", 
                onComplete: () => {
                    yellowRectangle.width = newWidth

                    gsap.to(greenRectangle, {
                        width: 0,
                        x: newWidth + 1,
                        ease: "power2.out",
                        duration: 0.5,
                        onComplete: () => {
                            this.hpBar!.removeChild(greenRectangle)
                        }
                    })
                }
            })

        } else {
            yellowRectangle.width = newWidth
        }
    }

    public damageEffect(turn: Turn) {
        this.displaySpecialMessage(turn)
        if (turn.dodge) return

        this.displayDamageNumber(turn)
        const oldAnimationState = this.currentAnimationState
        this.changeAnimationState('hit', this.sprite!.currentFrame)
        setTimeout(() => {
            this.changeAnimationState(oldAnimationState, this.sprite!.currentFrame)
        }, 100)
    }

    private attackTarget = (target: Character, turn: Turn) => {
        const targetUnit = turn.team === 'hero' ? turn.enemy : turn.hero
        const me = turn.team === 'hero' ? turn.hero : turn.enemy
        this.app.turnNumber++
        target.setHp(targetUnit.hp)
        this.setHp(me.hp)
        target.damageEffect(turn)
        signal.emit('super-progress', turn.hero.superProgress / turn.hero.superThreshold)

        if (turn.lastStand) {
            signal.emit('last-stand')
        }
    }

    private async dodge() {
        const isHero = this.unit.type === 'hero'
        const offset = isHero ? 20 : -20

        const runState = isHero ? 'run_up' : 'run_down'
        this.changeAnimationState(runState)
        await this.moveToPosition(this.initialX, this.initialY + offset)
        const idleState = isHero ? 'idle_up' : 'idle_down'
        this.changeAnimationState(idleState)
    }

    private async resetDodge() {
        const isHero = this.unit.type === 'hero'
        const runState = isHero ? 'run_up' : 'run_down'
        this.changeAnimationState(runState)
        await this.moveToPosition(this.initialX, this.initialY)
        const idleState = isHero ? 'idle_up' : 'idle_down'
        this.changeAnimationState(idleState)
    }

    private displayDamageNumber(turn: Turn) {
        let message = ''
        if (turn.crit) {
            message = 'CRIT ' + turn.dmg.toString()
        } else {
            message = turn.dmg.toString()
        }

        const text = new PIXI.Text({
            text: message,
            style: {
                fill: turn.crit ? 0xFF0000 : 0xFFFFFF,
                fontFamily: 'silkscreen',
                fontSize: 6,
            }
        })

        text.anchor.set(0.5, 0.5)
        text.x = this.parent.x + 14
        text.y = this.parent.y + getTextYOffset(this.unit)

        this.app.app.stage.addChild(text)

        gsap.to(text, {
            y: text.y - 5, 
            alpha: 0, 
            duration: 2, 
            ease: 'power1.out', 
            onComplete: () => {
                this.app.app.stage.removeChild(text)
            }
        })
    }

    private displaySpecialMessage(turn: Turn) {

        const displayMessage = (message: string, fill: number, index: number) => {
            const text = new PIXI.Text({
                text: message,
                style: {
                    fill: fill,
                    fontFamily: 'silkscreen',
                    fontSize: 4,
                }
            })

            text.anchor.set(0.5, 0.5)
            text.x = this.parent.x - 14
            text.y = this.parent.y + getTextYOffset(this.unit) + (index * 5)

            this.app.app.stage.addChild(text)

            gsap.to(text, {
                y: text.y - 5, 
                alpha: 0, 
                duration: 2, 
                ease: 'power1.out', 
                onComplete: () => {
                    this.app.app.stage.removeChild(text)
                }
            })
        }

        const messages: {message: string, fill: number}[] = []

        if (turn.followUp) {
            messages.push({
                message: 'FOLLOW UP',
                fill: 0x0096FF
            })
        } 
        
        if (turn.lastStand) {
            messages.push({
                message: 'LAST STAND',
                fill: 0xa23ce6
            })
        } else if (turn.dodge) {
            messages.push({
                message: 'DODGE',
                fill: 0x03cafc
            })
        }

        if (turn.surge) {
            messages.push({
                message: 'SURGE',
                fill: 0xf97316
            })
        }

        if (turn.vampire) {
            messages.push({
                message: 'VAMPIRE',
                fill: 0xdb2777
            })
        }

        messages.forEach((message, index) => {
            displayMessage(message.message, message.fill, index)
        })
    }

    public setSpawnPosition(x: number, y: number) {
        this.initialX = x
        this.initialY = y
        this.parent.x = this.initialX
        this.parent.y = this.initialY
    }

    public changeAnimationState(state: string, startFrame?: number): Promise<void> {
        return new Promise((resolve) => {
            if (this.currentAnimationState === state || !this.sprite) {
                resolve()
                return
            }

            if (!this.animations[state]) {
                throw new Error(`Unknown animation state: ${state}`)
            }

            this.sprite.textures = this.animations[state].textures
            this.sprite.loop = this.animations[state].data.loop
            this.sprite.anchor.set(this.animations[state].data.anchor.x, this.animations[state].data.anchor.y)

            if (startFrame !== undefined && startFrame >= 0 && startFrame < this.sprite.totalFrames) {
                this.sprite.gotoAndStop(startFrame)
            }

            if (!this.sprite.loop) {
                this.sprite.onComplete = () => {
                    if (this.sprite) {
                        this.sprite.onComplete = () => {}
                    }
                    resolve()
                }
            } else {
                resolve()
            }

            this.sprite.play()
            this.currentAnimationState = state

            if (this.sprite.loop) {
                resolve()
            }
        })
    }

    public moveToPosition(x: number, y: number, speed: number = 2): Promise<void> {
        return new Promise((resolve) => {
            if (speed) {
                this.moveSpeed = speed
            }

            this.targetPosition = new PIXI.Point(x, y)
            this.moveResolver = resolve

            if (this.moveTicker) {
                this.moveTicker.destroy()
            }

            this.moveTicker = new PIXI.Ticker()
            this.moveTicker.add(this.updatePosition)
            this.moveTicker.start()
        })
    }

    private updatePosition = ({deltaTime}: { deltaTime: number }) => {
        if (!this.targetPosition) return

        const dx = this.targetPosition.x - this.parent.x
        const dy = this.targetPosition.y - this.parent.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 0.1) {
            this.parent.x = this.targetPosition.x
            this.parent.y = this.targetPosition.y
            this.targetPosition = null
            if (this.moveTicker) {
                this.moveTicker.destroy()
                this.moveTicker = null
            }
            if (this.moveResolver) {
                this.moveResolver()
                this.moveResolver = null
            }
            return
        }

        const move = Math.min(distance, this.moveSpeed * deltaTime)
        const angle = Math.atan2(dy, dx)

        this.parent.x += Math.cos(angle) * move
        this.parent.y += Math.sin(angle) * move
    }

    public fadeOut(duration: number = 300): Promise<void> {
        return new Promise((resolve) => {
            const startOpacity = this.sprite!.alpha
            const startTime = Date.now()

            const tick = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)
                
                this.sprite!.alpha = startOpacity * (1 - progress)

                if (progress >= 1) {
                    PIXI.Ticker.shared.remove(tick)
                    this.sprite!.alpha = 0
                    resolve()
                }
            }

            PIXI.Ticker.shared.add(tick)
        })
    }


    public async turn(target: Character, turn: Turn, nextTurn?: Turn) {
        const isHero = this.unit.type === 'hero'
        const attackingUnit = isHero ? turn.hero : turn.enemy
        if (!isHero) this.parent.zIndex = 1
        // Initial run to target
        this.changeAnimationState(this.attackAnimationData.runAnimation)
        await this.haltablePromise(this.moveToPosition(target.initialX, target.initialY + this.attackAnimationData.fightPosOffset))
        if (this.halting) return

        if (turn.dodge) {
            target.dodge()
        }
        const attackAnimation = turn.crit ? this.attackAnimationData.critAnimation : this.attackAnimationData.attackAnimation
        const attackAnimationPromise = this.changeAnimationState(attackAnimation)

        const animationDelay = isHero ? (turn.crit ? 50 : 200) : getAnimationAttackDelay(this.unit, turn.crit)
        const waitPromise = waitForMS(animationDelay)

        await this.haltablePromise(waitPromise)
        if (this.halting) return

        this.unit.maxHp = attackingUnit.maxHp
        this.attackTarget(target, turn)
        signal.emit('update-gold', turn.hero.gold)

        await this.haltablePromise(attackAnimationPromise)
        if (this.halting) return

        if (turn.dodge) {
            await this.haltablePromise(target.resetDodge())
        }
        const willFollowUp = nextTurn && (isHero ? nextTurn.team === 'hero' : (nextTurn.team === 'enemy' && nextTurn.enemyIndex === turn.enemyIndex))
        if (this.halting || willFollowUp) return

        this.changeAnimationState(this.attackAnimationData.runAnimation)

        await this.haltablePromise(this.moveToPosition(this.initialX, this.initialY))
        if (this.halting) return

        this.changeAnimationState(this.attackAnimationData.idleAnimation)
        if (!isHero) this.parent.zIndex = 0
    }

    public halt = async () => {
        this.halting = true
        if (this.attackTimeout) {
            clearTimeout(this.attackTimeout)
        }

        // Resolve any pending haltable promises
        if (this.haltResolve) {
            this.haltResolve()
            this.haltResolve = null
        }

        if (this.unit.type !== 'hero') {
            this.changeAnimationState('idle_down')
            await this.moveToPosition(this.initialX, this.initialY, 4)
            this.parent.zIndex = 0
        } 
    }

    private haltablePromise = async (promise: Promise<void>): Promise<void> => {
        if (this.halting) {
            return Promise.resolve()
        }

        return new Promise<void>((resolve) => {
            this.haltResolve = resolve

            promise.then(() => {
                if (this.haltResolve === resolve) {
                    this.haltResolve = null
                    resolve()
                }
            })
        })
    }

    public resume = () => {
        this.halting = false
    }
}