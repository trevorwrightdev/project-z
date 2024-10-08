import * as PIXI from 'pixi.js'
import { Character } from './Character'
import signal from './signal'
import server from './server/Server'
import { heroEndPos, heroIntroPos, heroStartPos, heroFightPos, ZOOM, RESOLUTION } from './constants'
import { Unit, Turn } from './types'
import { getEnemyPosition, loadAssets, waitForMS } from './game-utils'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI(PIXI)

PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest'

export class App {
    public app: PIXI.Application = new PIXI.Application()
    public background: PIXI.Container = new PIXI.Container()
    public characters: PIXI.Container = new PIXI.Container()
    public hero: Character = new Character({
        hp: 0,
        maxHp: 0,
        type: 'hero',
        exp: 0,
        gold: 0,
    }, this)
    public initialized: boolean = false
    public backdropNumber = 1

    public enemies: Unit[] = []
    public enemyCharacters: Character[] = []
    public turns: Turn[] = []

    public runningTurns: boolean = false
    public turnNumber: number = 0
    public haltingGame: boolean = false
    public lockCamera: boolean = false

    public async init() {
        const container = document.getElementById('app-container')
        if (!container) {
            throw new Error('No container found')
        }
        await this.app.init({
            resizeTo: container,
            roundPixels: true,
            backgroundColor: 0x513A3E,
            resolution: RESOLUTION,
        })
        this.initialized = true

        this.app.stage.scale.set(ZOOM / RESOLUTION)
        container.appendChild(this.app.canvas)
        this.app.stage.addChild(this.background)
        this.app.stage.addChild(this.characters)
        this.hero.parent.zIndex = 99

        await loadAssets()
        this.setUpSignalListeners()
        this.setUpSocketListeners()
    
        const background = new PIXI.Sprite(PIXI.Texture.from('/game-assets/backdrop1.png'))
        this.background.addChild(background)

        await this.hero.init()
        this.hero.hideHpBar()
        this.hero.parent.x = heroIntroPos.x
        this.hero.parent.y = heroIntroPos.y
        this.hero.changeAnimationState('idle_down')
        this.characters.addChild(this.hero.parent)

        PIXI.Ticker.shared.add(this.updateCamera)
    }

    public onTapToStart = async () => {
        this.hero.changeAnimationState('run_up')
        await this.hero.moveToPosition(heroEndPos.x, heroEndPos.y)
        signal.emit('fade-out')
        await waitForMS(300)
        this.hero.showHpBar()
        if (!server.connected) {
            await server.connect()
        }
        await server.createSession()
        this.startLevel()
    }

     private returnToStart = async () => {
        signal.emit('fade-out')
        await waitForMS(300)
        signal.emit('reset-state')
        this.hero.hideHpBar()
        this.hero.sprite!.alpha = 1
        this.hero.parent.x = heroIntroPos.x
        this.hero.parent.y = heroIntroPos.y
        this.hero.changeAnimationState('idle_down')
        this.lockCamera = false
        this.characters.removeChildren()
        this.characters.addChild(this.hero.parent)
        signal.emit('show-start')
        await waitForMS(300)
        signal.emit('fade-in')
    }

    public startLevel = async () => {
        console.clear()

        this.lockCamera = false
        const payload = await server.getCurrentLevel()
        this.enemies = payload.enemies
        this.turns = payload.turns
        console.log(this.turns)
        this.hero.reset(payload.hero)
        signal.emit('show-ui')
        signal.emit('super-progress', payload.hero.superProgress / payload.hero.superThreshold)
        signal.emit('update-level-number')

        this.changeBackdrop()
        this.characters.removeChildren()

        this.hero.parent.x = heroStartPos.x
        this.hero.parent.y = heroStartPos.y
        this.hero.changeAnimationState('run_up')

        await this.spawnEnemies()
        this.characters.addChild(this.hero.parent)
        this.hero.initialX = heroFightPos.x
        this.hero.initialY = heroFightPos.y

        signal.emit('fade-in')
        
        await this.hero.moveToPosition(heroFightPos.x, heroFightPos.y)
        this.lockCamera = true
        this.hero.changeAnimationState('idle_up')

        await waitForMS(300)
        this.runTurns()
    }

    public runTurns = async () => {
        this.runningTurns = true
        this.turnNumber = 0
        for (let i = 0; i < this.turns.length; i++) {
            // end the loop if the game is halted
            if (this.haltingGame) break

            const turn = this.turns[i]
            if (turn.team === 'hero') {
                await this.hero.turn(this.enemyCharacters[turn.enemyIndex], turn, this.turns[i + 1])
            } else {
                const enemy = this.enemyCharacters[turn.enemyIndex]
                await enemy.turn(this.hero, turn, this.turns[i + 1])
            }
        }
        this.runningTurns = false

        if (!this.haltingGame) {
            this.endLevel()
        }
    }

    private endLevel = async () => {
        if (this.hero.unit.hp > 0) {
            signal.emit('show-extract-menu')
        } else {
            signal.emit('game-over')
        }
    }

    private onContinue = () => {
        signal.emit('exp-gain', this.turns[this.turns.length - 1].hero.exp)
    }

    private proceed = async () => {
        this.lockCamera = false
        this.hero.changeAnimationState('run_up')
        await this.hero.moveToPosition(heroEndPos.x, heroEndPos.y)    
        signal.emit('fade-out')
        await waitForMS(300)
        this.startLevel()
    }

    public spawnEnemies = async () => {
        this.enemyCharacters = []
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i]
            const character = new Character(enemy, this)
            await character.init()
            character.changeAnimationState('idle_down')
            const position = getEnemyPosition(this.enemies.length, i)
            character.setSpawnPosition(position.x, position.y)
            this.characters.addChild(character.parent)
            this.enemyCharacters.push(character)
        }
    }

    public changeBackdrop = () => {
        this.backdropNumber = this.backdropNumber % 2 + 1
        const backdrop = new PIXI.Sprite(PIXI.Texture.from(`/game-assets/backdrop${this.backdropNumber}.png`))
        this.background.removeChildren()
        this.background.addChild(backdrop)
    }

    public updateCamera = () => {
        if (!this.hero || this.lockCamera) return

        const screenWidth = this.app.screen.width
        const screenHeight = this.app.screen.height

        const heroPosition = this.hero.parent.position

        const offsetX = screenWidth / (2 * ZOOM)
        const offsetY = screenHeight * (2/3) / ZOOM

        let newPivotX = heroPosition.x - offsetX
        let newPivotY = heroPosition.y - offsetY

        const minY = 0
        const maxY = Math.max(0, this.background.height - screenHeight / ZOOM)
        newPivotY = Math.max(minY, Math.min(newPivotY, maxY))

        this.app.stage.pivot.set(newPivotX, newPivotY)
    }

    public onSuper = () => {
        if (!this.runningTurns || this.allEnemiesAreDead() || this.hero.unit.hp <= 0) return
        signal.emit('super-progress', 0)
        this.haltGame()
    }

    public haltGame = async () => {
        // return the characters to their original positions, stop all animations and the turn loop
        this.haltingGame = true

        // Create an array of promises for all character halt operations
        const halts = [
            this.hero.halt(),
            ...this.enemyCharacters.map(enemy => enemy.halt())
        ]
        await Promise.all(halts)
        server.socket.emit('activate-super', this.turnNumber)
    }

    private resumeGame = () => {
        this.haltingGame = false
        this.hero.resume()
        this.enemyCharacters.forEach(enemy => enemy.resume())
        this.runTurns()
    }

    private allEnemiesAreDead = () => {
        return this.enemyCharacters.every((enemy) => enemy.unit.hp <= 0)
    }

    private onTurnsUpdated = (newTurns: Turn[]) => {
        console.clear()
        this.turns = newTurns
        console.log(this.turns)
        this.resumeGame()
    }

    private setUpSocketListeners = () => {
        server.socket.on('turns-updated', this.onTurnsUpdated)
        server.socket.on('upgrade-complete', this.proceed)
    }

    private destroySocketListeners = () => {
        server.socket.off('turns-updated', this.onTurnsUpdated)
        server.socket.off('upgrade-complete', this.proceed)
    }

    public setUpSignalListeners = () => {
        signal.on('start', this.onTapToStart)
        signal.on('super-pressed', this.onSuper)
        signal.on('proceed', this.proceed)
        signal.on('continue', this.onContinue)
        signal.on('return-to-start', this.returnToStart)
    }

    public destroySignalListeners = () => {
        signal.off('start', this.onTapToStart)
        signal.off('super-pressed', this.onSuper)
        signal.off('proceed', this.proceed)
        signal.off('continue', this.onContinue)
        signal.off('return-to-start', this.returnToStart)
    }

    public destroy() {
        this.destroySignalListeners()
        this.destroySocketListeners()
        server.disconnect()
        if (this.initialized) {
            this.app.destroy()
        }
    }
}