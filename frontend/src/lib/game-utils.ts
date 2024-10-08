import * as PIXI from 'pixi.js'
import type { Unit } from './types'

export function getEnemyPosition(totalEnemies: number, index: number): { x: number, y: number } {
    const centerX = 80
    const centerY = 120
    const defaultSpacing = 35
    const threeEnemySpacing = 30
    const centerEnemyYOffset = 10 // Adjust this value to move the center enemy higher or lower

    if (totalEnemies === 1) {
        return { x: centerX, y: centerY }
    }

    const spacing = totalEnemies === 3 ? threeEnemySpacing : defaultSpacing
    const offset = (index - (totalEnemies - 1) / 2) * spacing
    
    let yPosition = centerY
    if (totalEnemies === 3 && index === 1) {
        yPosition += centerEnemyYOffset
    }

    return {
        x: centerX + offset,
        y: yPosition
    }
}

export async function loadAssets() {
    await PIXI.Assets.load([
        '/game-assets/backdrop1.png',
        '/game-assets/backdrop2.png',
        '/game-assets/hp-bar.png',
        '/fonts/silkscreen.ttf',
    ])
}

export function getAnimationAttackDelay(unit: Unit, crit?: boolean): number {
    if (unit.type === 'beast') {
        return 500
    } else if (unit.type === 'hunter') {
        return 300
    } else if (unit.type === 'warrior') {
        return 500
    } else if (unit.type === 'swordsman') {
        if (crit) {
            return 300
        } else {
            return 1000
        }
    }
    return 200
}

export function waitForMS(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getTextYOffset(unit: Unit): number {
    if (unit.type === 'hero') {
        return -10
    } else if (unit.type === 'hunter') {
        return -14
    } else if (unit.type === 'warrior') {
        return -14
    } else if (unit.type === 'beast') {
        return -24
    } else if (unit.type === 'swordsman') {
        return -14
    } else {
        return 0
    }
}

export function getExpLevel(exp: number): number {
    const baseExp = 100
    
    const scalingFactor = 1.5
    
    const level = Math.floor(Math.log(exp / baseExp) / Math.log(scalingFactor)) + 1
    
    return Math.max(1, level)
}

export function getRequiredExp(level: number): number {
    const baseExp = 100
    const scalingFactor = 1.5

    // Ensure the input level is at least 1
    const adjustedLevel = Math.max(1, level)

    // Calculate the required exp using the inverse of the logarithmic function
    const requiredExp = baseExp * Math.pow(scalingFactor, adjustedLevel - 1)

    // Round the result to the nearest integer
    return Math.round(requiredExp)
}