import { Assets, Texture, Rectangle } from 'pixi.js'
import type { AnimationData, Animations, CharacterName } from '../types'
import { heroAnimations } from './hero'
import { beastAnimations } from './beast'
import { hunterAnimations } from './hunter'
import { warriorAnimations } from './warrior'
import { swordsmanAnimations } from './swordsman'

function getAnimationDataByName(name: CharacterName): AnimationData[] {
    switch (name) {
        case 'hero':
            return heroAnimations
        case 'beast':
            return beastAnimations
        case 'hunter':
            return hunterAnimations
        case 'warrior':
            return warriorAnimations
        case 'swordsman':
            return swordsmanAnimations
        default:
            throw new Error(`Unknown character name: ${name}`)
    }
}

export async function processAnimations(name: CharacterName): Promise<Animations> {
    const animations: AnimationData[] = getAnimationDataByName(name)

    const result: Animations = {}

    for (const animation of animations) {
        const baseTexture: Texture = await Assets.load(animation.src)
        const textures: Texture[] = animation.frames.map((frame) => 
            new Texture(
                {
                    source: baseTexture.source,
                    frame: new Rectangle(frame.x, frame.y, frame.width, frame.height),
                }
            )
        )

        result[animation.name] = {
            data: animation,
            textures,
        }
    }

    return result
}