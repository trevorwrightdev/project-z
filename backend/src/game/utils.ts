import { Hero, StatlessUnit, Unit, StatlessHero } from './types'

export function findLowestHpUnit(units: Unit[]): { unit: Unit, index: number } {
    let lowestHpUnit: Unit | null = null
    let lowestHpIndex: number = -1
    let lowestHp: number = Infinity

    for (let i = 0; i < units.length; i++) {
        const unit = units[i]
        if (unit.hp > 0 && unit.hp < lowestHp) {
            lowestHp = unit.hp
            lowestHpUnit = unit
            lowestHpIndex = i
        }
    }

    return { unit: lowestHpUnit!, index: lowestHpIndex }
}

export function getExpLevel(exp: number): number {
    const baseExp = 100
    
    const scalingFactor = 1.5
    
    const level = Math.floor(Math.log(exp / baseExp) / Math.log(scalingFactor)) + 1
    
    return Math.max(1, level)
}

export function convertToStatlessUnit(unit: Unit | Hero): StatlessUnit {
    const convertedUnit: StatlessUnit = {
        hp: unit.hp,
        maxHp: unit.maxHp,
        type: unit.type,
    }

    return convertedUnit
}

export function convertToStatlessHero(hero: Hero): StatlessHero {
    const convertedHero: StatlessHero = {
        hp: hero.hp,
        maxHp: hero.maxHp,
        type: hero.type,
        exp: hero.exp,
        gold: hero.gold,
        superProgress: hero.superProgress,
        superThreshold: hero.superThreshold,
    }

    return convertedHero
}