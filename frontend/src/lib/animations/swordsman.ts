import type { AnimationData } from '../types'

export const swordsmanAnimations: AnimationData[] = [
    {
        name: 'idle_down',
        frames: [
            { x: 0, y: 0, width: 67, height: 45 },
            { x: 67, y: 0, width: 67, height: 45 },
            { x: 134, y: 0, width: 67, height: 45 },
            { x: 201, y: 0, width: 67, height: 45 },
            { x: 268, y: 0, width: 67, height: 45 },
            { x: 335, y: 0, width: 67, height: 45 },
            { x: 402, y: 0, width: 67, height: 45 },
            { x: 469, y: 0, width: 67, height: 45 },
            { x: 536, y: 0, width: 67, height: 45 },
            { x: 603, y: 0, width: 67, height: 45 },
            { x: 670, y: 0, width: 67, height: 45 },
            { x: 737, y: 0, width: 67, height: 45 },
        ],
        src: '/game-assets/characters/swordsman/idle-down.png',
        loop: true,
        anchor: {
            x: 0.5,
            y: 0.75,
        }
    },
    {
        name: 'hit',
        frames: [
            { x: 0, y: 0, width: 67, height: 45 },
            { x: 67, y: 0, width: 67, height: 45 },
            { x: 134, y: 0, width: 67, height: 45 },
            { x: 201, y: 0, width: 67, height: 45 },
            { x: 268, y: 0, width: 67, height: 45 },
            { x: 335, y: 0, width: 67, height: 45 },
            { x: 402, y: 0, width: 67, height: 45 },
            { x: 469, y: 0, width: 67, height: 45 },
            { x: 536, y: 0, width: 67, height: 45 },
            { x: 603, y: 0, width: 67, height: 45 },
            { x: 670, y: 0, width: 67, height: 45 },
            { x: 737, y: 0, width: 67, height: 45 },
        ],
        src: '/game-assets/characters/swordsman/hit-idle-down.png',
        loop: true,
        anchor: {
            x: 0.5,
            y: 0.75,
        }
    },
    {
        name: 'run_down',
        frames: [
            { x: 0, y: 0, width: 67, height: 45 },
            { x: 67, y: 0, width: 67, height: 45 },
            { x: 134, y: 0, width: 67, height: 45 },
            { x: 201, y: 0, width: 67, height: 45 },
            { x: 268, y: 0, width: 67, height: 45 },
            { x: 335, y: 0, width: 67, height: 45 },
            { x: 402, y: 0, width: 67, height: 45 },
            { x: 469, y: 0, width: 67, height: 45 },
        ],
        src: '/game-assets/characters/swordsman/run-down.png',
        loop: true,
        anchor: {
            x: 0.5,
            y: 0.75,
        }
    },
    {
        name: 'attack_down',
        frames: [
            { x: 0, y: 0, width: 67, height: 45 },
            { x: 67, y: 0, width: 67, height: 45 },
            { x: 134, y: 0, width: 67, height: 45 },
            { x: 201, y: 0, width: 67, height: 45 },
            { x: 268, y: 0, width: 67, height: 45 },
            { x: 335, y: 0, width: 67, height: 45 },
            { x: 402, y: 0, width: 67, height: 45 },
            { x: 469, y: 0, width: 67, height: 45 },
            { x: 536, y: 0, width: 67, height: 45 },
            { x: 603, y: 0, width: 67, height: 45 },
            { x: 670, y: 0, width: 67, height: 45 },
            { x: 737, y: 0, width: 67, height: 45 },
            { x: 804, y: 0, width: 67, height: 45 },
            { x: 871, y: 0, width: 67, height: 45 },
            { x: 938, y: 0, width: 67, height: 45 },
            { x: 1005, y: 0, width: 67, height: 45 },
            { x: 1072, y: 0, width: 67, height: 45 },
            { x: 1139, y: 0, width: 67, height: 45 },
            { x: 1206, y: 0, width: 67, height: 45 },
        ],
        src: '/game-assets/characters/swordsman/attack-down.png',
        loop: false,
        anchor: {
            x: 0.5,
            y: 0.75,
        }
    },
    {
        name: 'crit_down',
        frames: [
            { x: 0, y: 0, width: 67, height: 45 },
            { x: 67, y: 0, width: 67, height: 45 },
            { x: 134, y: 0, width: 67, height: 45 },
            { x: 201, y: 0, width: 67, height: 45 },
            { x: 268, y: 0, width: 67, height: 45 },
            { x: 335, y: 0, width: 67, height: 45 },
            { x: 402, y: 0, width: 67, height: 45 },
            { x: 469, y: 0, width: 67, height: 45 },
            { x: 536, y: 0, width: 67, height: 45 },
            { x: 603, y: 0, width: 67, height: 45 },
            { x: 670, y: 0, width: 67, height: 45 },
            { x: 737, y: 0, width: 67, height: 45 },
            { x: 804, y: 0, width: 67, height: 45 },
            { x: 871, y: 0, width: 67, height: 45 },
            { x: 938, y: 0, width: 67, height: 45 },
            { x: 1005, y: 0, width: 67, height: 45 },
            { x: 1072, y: 0, width: 67, height: 45 },
        ],
        src: '/game-assets/characters/swordsman/crit-down.png',
        loop: false,
        anchor: {
            x: 0.5,
            y: 0.75,
        }
    }
]