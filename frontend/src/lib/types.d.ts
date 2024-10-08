import { Texture } from 'pixi.js'

export type Animations = {
    [key: string]: {
        data: AnimationData
        textures: Texture[]
    }
}

export type AnimationData = {
    name: string
    frames: {
        x: number
        y: number
        width: number
        height: number
    }[]
    src: string
    loop: boolean
    anchor: {
        x: number
        y: number
    }
}

export type CharacterName = 'hero' | 'warrior' | 'beast' | 'hunter' | 'swordsman'

export type Unit = {
    hp: number
    maxHp: number
    type: CharacterName
}

export type Hero = Unit & {
    superProgress: number
    superThreshold: number
    exp: number
    gold: number
}

export type LevelPayload = {
    enemies: Unit[]
    hero: Hero
    turns: Turn[]
}

export type Turn = {
    team: 'hero' | 'enemy'
    hero: Hero
    enemy: Unit
    enemyIndex: number
    dmg: number
    crit?: boolean
    followUp?: boolean
    dodge?: boolean
    lastStand?: boolean
    surge?: boolean
    vampire?: boolean
}

export type AttackAnimationData = {
    runAnimation: string
    fightPosOffset: number
    critAnimation: string
    attackAnimation: string
    idleAnimation: string
}