import { AttackAnimationData } from './types'

export const heroIntroPos = {
    x: 80,
    y: 230,
}

export const heroEndPos = {
    x: 80,
    y: -50,
}

export const heroStartPos = {
    x: 80, 
    y: 280,
}

export const heroFightPos = {
    x: 80,
    y: 175,
}

export const ZOOM = 4

export const TRANSITION_DURATION = 300

export const RESOLUTION = 5

export const heroAttackAnimationData: AttackAnimationData = {
    runAnimation: 'run_up',
    fightPosOffset: 20,
    critAnimation: 'crit_up',
    attackAnimation: 'attack_up',
    idleAnimation: 'idle_up',
}

export const enemyAttackAnimationData: AttackAnimationData = {
    runAnimation: 'run_down',
    fightPosOffset: -20,
    critAnimation: 'crit_down',
    attackAnimation: 'attack_down',
    idleAnimation: 'idle_down',
}