import type { AnimationData } from '../types'

export const warriorAnimations: AnimationData[] = [
    {
        name: 'idle_down',
        frames: [
            { x: 0, y: 0, width: 62, height: 69 },
            { x: 62, y: 0, width: 62, height: 69 },
            { x: 124, y: 0, width: 62, height: 69 },
            { x: 186, y: 0, width: 62, height: 69 },
            { x: 248, y: 0, width: 62, height: 69 },
            { x: 310, y: 0, width: 62, height: 69 },
        ],
        src: '/game-assets/characters/warrior/idle-down.png',
        loop: true,
        anchor: {
            x: 0.41,
            y: 0.74,
        }
    },
    {
        name: 'hit',
        frames: [
            { x: 0, y: 0, width: 62, height: 69 },
            { x: 62, y: 0, width: 62, height: 69 },
            { x: 124, y: 0, width: 62, height: 69 },
            { x: 186, y: 0, width: 62, height: 69 },
            { x: 248, y: 0, width: 62, height: 69 },
            { x: 310, y: 0, width: 62, height: 69 },
        ],
        src: '/game-assets/characters/warrior/hit-idle-down.png',
        loop: true,
        anchor: {
            x: 0.41,
            y: 0.74,
        }
    },
    {
        name: 'run_down',
        frames: [
            { x: 0, y: 0, width: 62, height: 69 },
            { x: 62, y: 0, width: 62, height: 69 },
            { x: 124, y: 0, width: 62, height: 69 },
            { x: 186, y: 0, width: 62, height: 69 },
            { x: 248, y: 0, width: 62, height: 69 },
            { x: 310, y: 0, width: 62, height: 69 },
        ],
        src: '/game-assets/characters/warrior/run-down.png',
        loop: true,
        anchor: {
            x: 0.41,
            y: 0.74,
        }
    },
    {
        name: 'attack_down',
        frames: [
            { x: 0, y: 0, width: 62, height: 69 },
            { x: 62, y: 0, width: 62, height: 69 },
            { x: 124, y: 0, width: 62, height: 69 },
            { x: 186, y: 0, width: 62, height: 69 },
            { x: 248, y: 0, width: 62, height: 69 },
            { x: 310, y: 0, width: 62, height: 69 },
            { x: 372, y: 0, width: 62, height: 69 },
            { x: 434, y: 0, width: 62, height: 69 },
            { x: 496, y: 0, width: 62, height: 69 },
            { x: 558, y: 0, width: 62, height: 69 },
            { x: 620, y: 0, width: 62, height: 69 }
        ],
        src: '/game-assets/characters/warrior/attack-down.png',
        loop: false,
        anchor: {
            x: 0.41,
            y: 0.74,
        }
    }
]