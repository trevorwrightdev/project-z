import type { Unit, Turn, Hero, Snapshot, LastTurn, FightOptions } from './types'
import { findLowestHpUnit, convertToStatlessUnit, convertToStatlessHero } from './utils'
import { getExpLevel } from './utils'
import type { Upgrade, SpecialUpgrade } from '../zod'
import { basicUpgrades, specialUpgrades } from '../zod'
import { EXP_PER_ENEMY, CRIT_MULTIPLIER, VAMPIRE_MULTIPLIER, SURGE_MULTIPLIER, HEAL_ON_KILL_MULTIPLIER } from './constants'

const baseHeroAtk = 10
const baseHeroHp = 30
const baseFollowUpChance = 0.3
const baseCritChance = 0.3
const baseDodgeChance = 0.3

export class GameSession {
    public currentHero: Hero = {
        hp: baseHeroHp,
        maxHp: baseHeroHp,
        atk: baseHeroAtk,
        followUpChance: baseFollowUpChance,
        critChance: baseCritChance,
        type: 'hero',
        superProgress: 0,
        superThreshold: 10,
        dodgeChance: baseDodgeChance,
        exp: 0,
        gold: 0,
        guaranteedFollowUps: 0,
        specialUpgrades: new Set(),
    }
    public currentEnemies: Unit[] = []
    private latestHeroState: Hero = structuredClone(this.currentHero)
    private latestEnemyState: Unit[] = structuredClone(this.currentEnemies)
    private superDisabled: boolean = false

    private levelNumber: number = 0

    public turns: Turn[] = []
    private snapshots: Snapshot[] = []
    private lastTurn: LastTurn | null = null

    public shop: Upgrade[] = []
    private shopAlreadyUsedThisLevel: boolean = false
    private upgradesBought: number = 0

    private expLevelAtStart: number = 0

    constructor() {
        this.generateShop()
    }

    public nextLevel() {
        if (!this.canContinue()) return
        if (this.levelNumber > 0) {
            this.onBattleWon()
        }

        this.levelNumber++

        this.shopAlreadyUsedThisLevel = false
        this.generateShop()

        this.superDisabled = false

        this.currentHero = structuredClone(this.latestHeroState)
        this.expLevelAtStart = getExpLevel(this.currentHero.exp)
        const enemies: Unit[] = []
        const enemyCount = this.getEnemyCount()
        
        for (let i = 0; i < enemyCount; i++) {
            enemies.push(this.createEnemy())
        }
        this.currentEnemies = enemies

        this.latestEnemyState = structuredClone(this.currentEnemies)
        this.resetState()
        this.setLastTurn(null)
        this.runLevel()
    }

    private resetState = () => {
        this.turns = []
        this.snapshots = []
    }

    private getEnemyCount(): number {
        if (this.isBossLevel()) return 1

        const baseChance = Math.random()
        const levelFactor = Math.min(this.levelNumber / 10, 1) 
        
        if (baseChance < 0.5 - levelFactor * 0.2) return 1
        if (baseChance < 0.8 - levelFactor * 0.1) return 2
        return 3
    }

    private isBossLevel(): boolean {
        return this.levelNumber % 10 === 0
    }

    private createEnemy(): Unit {
        const types: Unit['type'][] = ['warrior', 'hunter', 'beast']
        
        let type: Unit['type']
        if (this.isBossLevel()) {
            type = 'swordsman'
        } else {
            type = types[Math.floor(Math.random() * types.length)]
        }
        
        const baseHp = 20 + Math.floor(Math.random() * 10) 
        const baseAtk = 2 + Math.floor(Math.random() * 1)
        const levelMultiplier = 1 + (this.levelNumber - 1) * 0.4

        const newHp = Math.floor(baseHp * levelMultiplier)

        const enemy: Unit = {
            hp: newHp,
            maxHp: newHp,
            atk: Math.floor(baseAtk * levelMultiplier),
            type,
            critChance: 0,
            followUpChance: 0,
            dodgeChance: 0,
            guaranteedFollowUps: 0,
        }

        if (type === 'swordsman') {
            enemy.critChance = 0.3
            enemy.followUpChance = 0.3
            enemy.dodgeChance = 0.3
            enemy.maxHp *= 2
            enemy.hp = enemy.maxHp
        }

        return enemy
    }

    private heroAttack = (options?: FightOptions) => {
        if (this.latestHeroState.hp <= 0 || this.allEnemiesDead()) return

        const result = findLowestHpUnit(this.latestEnemyState)
        const weakestEnemy = result.unit
        const weakestEnemyIndex = result.index

        this.attack(this.latestHeroState, weakestEnemy, weakestEnemyIndex, options)
    }

    private attack(attacker: Unit, defender: Unit, enemyIndex: number, options?: FightOptions) {
        if (options?.followUp && attacker.guaranteedFollowUps > 0) {
            attacker.guaranteedFollowUps--
        }

        const res = this.calculateDmg({unit: attacker, guaranteedCrit: options?.guaranteedCrit})
        // Calculate based off defender dodge chance, since its a defensive move
        let dodge = Math.random() < defender.dodgeChance
        let lastStand = false
        if (!dodge && defender.type === 'hero') {
            if (this.latestHeroState.specialUpgrades.has('Last Stand')) {
                // if hero will die on this hit
                if (this.latestHeroState.hp - res.dmg <= 0) {
                    dodge = true
                    lastStand = true
                    this.latestHeroState.specialUpgrades.delete('Last Stand')
                }
            }
        }

        if (dodge) {
            // if its a hero, they get super progress for dodging
            if (defender.type === 'hero') {
                this.setHeroSuperProgress(this.latestHeroState.superProgress + 1)
            }
        } else {
            this.setHp(defender, defender.hp - res.dmg)
            this.setHeroSuperProgress(this.latestHeroState.superProgress + 1)
        }

        const surge = !options?.guaranteedCrit && this.latestHeroState.specialUpgrades.has('Critical Surge') && res.crit && attacker.type === 'hero' && !dodge
        if (surge) {
            this.setHeroSuperProgress(this.latestHeroState.superProgress + this.latestHeroState.superThreshold * SURGE_MULTIPLIER)
        }

        const heroKilledEnemy = attacker.type === 'hero' && defender.hp <= 0
        if (heroKilledEnemy) {
            this.grantExpAndGold()
            if (this.latestHeroState.specialUpgrades.has('Heal on Kill')) {
                this.setHp(this.latestHeroState, this.latestHeroState.hp + (this.latestHeroState.maxHp * HEAL_ON_KILL_MULTIPLIER))
            }
        }

        const vampiricSuper = attacker.type === 'hero' && this.latestHeroState.specialUpgrades.has('Vampiric Super') && options?.super
        if (vampiricSuper) {
            this.setHp(this.latestHeroState, this.latestHeroState.hp + (res.dmg * VAMPIRE_MULTIPLIER))
        }

        const heroWonBattle = this.allEnemiesDead() && attacker.type === 'hero'
        if (heroWonBattle) {
            this.setHp(this.latestHeroState, this.latestHeroState.maxHp)
        }

        const turn: Turn = {
            team: attacker.type === 'hero' ? 'hero' : 'enemy',
            enemyIndex: enemyIndex,
            dmg: res.dmg,
            hero: convertToStatlessHero(this.latestHeroState),
            enemy: convertToStatlessUnit(attacker.type === 'hero' ? defender: attacker),
            crit: res.crit,
            followUp: options?.followUp,
            dodge: dodge,
            lastStand: lastStand,
            surge: surge,
            vampire: vampiricSuper,
        }

        this.makeTurn(turn)

        if (lastStand) {
            this.latestHeroState.guaranteedFollowUps = 6
            this.heroAttack({ followUp: true })
            return
        }

        if (Math.random() < attacker.followUpChance || attacker.guaranteedFollowUps > 0) {
            if (attacker.type === 'hero') {
                this.heroAttack({ followUp: true })
            } else {
                this.enemyAttack(attacker, enemyIndex, { followUp: true })
            }
        }
    }

    private enemyAttack = (enemy: Unit, index: number, options?: FightOptions) => {
        if (enemy.hp <= 0 || this.latestHeroState.hp <= 0) return

        this.attack(enemy, this.latestHeroState, index, options)
    }

    private runLevel() {
        // start with an initial state snapshot
        this.snapshots.push({
            hero: structuredClone(this.latestHeroState),
            enemies: structuredClone(this.latestEnemyState),
        })

        const extraEnemies = this.getExtraEnemies()
        this.setLastTurn(null)
        for (const index of extraEnemies) {
            this.enemyAttack(this.latestEnemyState[index], index)
        }

        while (this.latestHeroState.hp > 0 && !this.allEnemiesDead()) {
            // Hero's turn
            this.heroAttack()

            // Enemies' turns
            for (const [index, enemy] of this.latestEnemyState.entries()) {
                this.enemyAttack(enemy, index)
            }
        }
    }

    private canContinue(): boolean {
        return this.latestHeroState.hp > 0
    }

    private calculateDmg(options: { unit: Unit, guaranteedCrit?: boolean }): { dmg: number, crit: boolean } {
        const baseDamage = options.unit.atk
        const varianceRange = Math.max(2, Math.floor(baseDamage * 0.4))
        
        const damageVariance = Math.floor(Math.random() * (varianceRange + 1)) - Math.floor(varianceRange / 2)
        
        let finalDamage = Math.max(1, baseDamage + damageVariance)
        const crit = options.guaranteedCrit || Math.random() < options.unit.critChance
        if (crit) {
            finalDamage *= CRIT_MULTIPLIER
        }
        
        return {
            dmg: Math.floor(finalDamage),
            crit,
        }
    }

    private makeTurn(turn: Turn) {
        this.turns.push(turn)
        // push snapshot as well 
        const snapshot: Snapshot = {
            hero: structuredClone(this.latestHeroState),
            enemies: structuredClone(this.latestEnemyState),
            lastTeam: turn.team,
        }
        if (turn.team === 'enemy') {
            snapshot.lastIndex = turn.enemyIndex
        }
        this.snapshots.push(snapshot)
    }

    private setHp(unit: Unit, hp: number) {
        unit.hp = Math.floor(Math.min(unit.maxHp, Math.max(0, hp)));
    }

    private setHeroSuperProgress(progress: number) {
        this.latestHeroState.superProgress = Math.min(
            this.latestHeroState.superThreshold,
            Math.max(0, progress)
        )
    }

    public validateTurnNumber(turnNumber: number) {
        return turnNumber >= 0 && turnNumber < this.turns.length
    }

    public activateSuper(turnNumber: number) {
        const snapshot = this.snapshots[turnNumber]
        this.latestHeroState = structuredClone(snapshot.hero)
        this.latestEnemyState = structuredClone(snapshot.enemies)
        this.latestHeroState.superProgress = 0

        if (snapshot.lastTeam) {
            const lastTurn: LastTurn = {
                team: snapshot.lastTeam,
            }
            if (snapshot.lastIndex) {
                lastTurn.index = snapshot.lastIndex
            }
            this.setLastTurn(lastTurn)
        }
        this.resetState()
        this.heroAttack({
            guaranteedCrit: true,
            super: true,
        })
        this.runLevel()
    }

    private grantExpAndGold() {
        this.latestHeroState.exp += EXP_PER_ENEMY

        const baseGold = 10;
        const scalingFactor = 1.15; 

        const goldGained = Math.round(
            baseGold * Math.pow(scalingFactor, this.levelNumber - 1)
        )

        this.latestHeroState.gold += goldGained
    }

    private grantAtkAndHpRewards() {
        this.latestHeroState.atk += 2
        this.latestHeroState.maxHp += 1
    }

    private allEnemiesDead() {
        return this.latestEnemyState.every(enemy => enemy.hp <= 0)
    }

    private getExtraEnemies(): number[] {
        if (!this.lastTurn) return []
        const turn = this.lastTurn!
        const allEnemyIndexes = Array.from({ length: this.latestEnemyState.length }, (_, index) => index)

        if (turn.team === 'hero') {
            return allEnemyIndexes
        }
        if (turn.team === 'enemy' && turn.index === this.latestEnemyState.length - 1) return []

        if (turn.team === 'enemy' && turn.index! < this.latestEnemyState.length - 1) {
            // return each enemy after the turn.index
            return allEnemyIndexes.slice(turn.index! + 1)
        }

        return []
    }

    private setLastTurn(turn: LastTurn | null) {
        this.lastTurn = turn
    }

    private generateShop() {
        const availableUpgrades = [
            ...basicUpgrades,
            ...specialUpgrades.filter(upgrade => !this.latestHeroState.specialUpgrades.has(upgrade))
        ]

        this.shop = []

        for (let i = 0; i < 3 && availableUpgrades.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableUpgrades.length)
            const selectedUpgrade = availableUpgrades.splice(randomIndex, 1)[0]
            this.shop.push(selectedUpgrade)
        }
    }

    public getUpgrade(upgrade: Upgrade) {
        // if my level is 3, i should have 2 upgrades. so at level three i could only upgrade if i had one. which is my level - 2
        const shopDoesntIncludeUpgrade = !this.shop.includes(upgrade)
        const notHighEnoughLevel = this.upgradesBought > getExpLevel(this.latestHeroState.exp) - 2
        const alreadyOwned = this.latestHeroState.specialUpgrades.has(upgrade as SpecialUpgrade)
        if (shopDoesntIncludeUpgrade || this.shopAlreadyUsedThisLevel || notHighEnoughLevel || alreadyOwned) return

        this.shopAlreadyUsedThisLevel = true
        // cannot alter the level further by doing super. its set in stone
        this.superDisabled = true
        this.upgradesBought++
        // grant upgrade based on name 
        if (upgrade === 'ATK Increase') {
            this.latestHeroState.atk += 2
        } else if (upgrade === 'HP Increase') {
            this.latestHeroState.maxHp += 1
            this.setHp(this.latestHeroState, this.latestHeroState.maxHp)
        } else if (upgrade === 'Follow-Up Chance Increase') {
            this.latestHeroState.followUpChance += ((1 - this.latestHeroState.followUpChance) * 0.1)
        } else if (upgrade === 'Crit Chance Increase') {
            this.latestHeroState.critChance += ((1 - this.latestHeroState.critChance) * 0.1)
        } else if (specialUpgrades.includes(upgrade as SpecialUpgrade)) {
            this.latestHeroState.specialUpgrades.add(upgrade as SpecialUpgrade)
        }
    }

    private onBattleWon() {
        if (this.expLevelAtStart < getExpLevel(this.latestHeroState.exp)) {
            // increase atk and hp
            this.grantAtkAndHpRewards()
            // full heal.
            this.setHp(this.latestHeroState, this.latestHeroState.maxHp)
        }
    }

    public canSuper(turnNumber: number) {
        const snapshot = this.snapshots[turnNumber]
        return snapshot.hero.superProgress >= snapshot.hero.superThreshold && !this.superDisabled
    }
}