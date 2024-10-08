import { SpecialUpgrade } from '../zod'

export type CharacterName = 'hero' | 'hunter' | 'beast' | 'warrior' | 'swordsman'

export type BaseUnit = {
    hp: number
    maxHp: number
    type: CharacterName
}

export type Unit = BaseUnit & {
    atk: number
    critChance: number
    followUpChance: number
    dodgeChance: number
    guaranteedFollowUps: number
}

export type StatlessUnit = BaseUnit

export type PublicHeroStats = {
    superProgress: number
    superThreshold: number
    exp: number
    gold: number
}

export type PrivateHeroStats = {
    specialUpgrades: Set<SpecialUpgrade>
}

export type StatlessHero = BaseUnit & PublicHeroStats 

export type Hero = Unit & PublicHeroStats & PrivateHeroStats

export type Turn = {
    team: 'hero' | 'enemy'
    hero: StatlessHero
    enemy: StatlessUnit
    enemyIndex: number
    dmg: number
    crit?: boolean
    followUp?: boolean
    dodge?: boolean
    lastStand?: boolean
    surge?: boolean
    vampire?: boolean
}

export type Snapshot = {
    hero: Hero
    enemies: Unit[]
    lastTeam?: 'hero' | 'enemy'
    lastIndex?: number
}

export type LastTurn = {
    team: 'hero' | 'enemy'
    index?: number
}

export type FightOptions = {
    guaranteedCrit?: boolean
    followUp?: boolean
    super?: boolean
}