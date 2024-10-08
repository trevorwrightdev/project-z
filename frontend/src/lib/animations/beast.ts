import type { AnimationData } from '../types'

export const beastAnimations: AnimationData[] = [
    {
        name: 'idle_down',
        frames: [
            { x: 0, y: 0, width: 76, height: 66 },
            { x: 76, y: 0, width: 76, height: 66 },
            { x: 152, y: 0, width: 76, height: 66 },
            { x: 228, y: 0, width: 76, height: 66 },
            { x: 304, y: 0, width: 76, height: 66 },
            { x: 380, y: 0, width: 76, height: 66 },
        ],
        src: '/game-assets/characters/beast/idle-down.png',
        loop: true,
        anchor: {
            x: 0.486,
            y: 0.7,
        }
    },
    {
        name: 'hit',
        frames: [
            { x: 0, y: 0, width: 76, height: 66 },
            { x: 76, y: 0, width: 76, height: 66 },
            { x: 152, y: 0, width: 76, height: 66 },
            { x: 228, y: 0, width: 76, height: 66 },
            { x: 304, y: 0, width: 76, height: 66 },
            { x: 380, y: 0, width: 76, height: 66 },
        ],
        src: '/game-assets/characters/beast/hit-idle-down.png',
        loop: true,
        anchor: {
            x: 0.486,
            y: 0.7,
        }
    },
    {
        name: 'run_down',
        frames: [
            { x: 0, y: 0, width: 76, height: 66 },
            { x: 76, y: 0, width: 76, height: 66 },
            { x: 152, y: 0, width: 76, height: 66 },
            { x: 228, y: 0, width: 76, height: 66 },
            { x: 304, y: 0, width: 76, height: 66 },
            { x: 380, y: 0, width: 76, height: 66 },
        ],
        src: '/game-assets/characters/beast/run-down.png',
        loop: true,
        anchor: {
            x: 0.486,
            y: 0.7,
        }
    },
    {
        name: 'attack_down',
        frames: [
            { x: 0, y: 0, width: 76, height: 66 },
            { x: 76, y: 0, width: 76, height: 66 },
            { x: 152, y: 0, width: 76, height: 66 },
            { x: 228, y: 0, width: 76, height: 66 },
            { x: 304, y: 0, width: 76, height: 66 },
            { x: 380, y: 0, width: 76, height: 66 },
            { x: 456, y: 0, width: 76, height: 66 },
            { x: 532, y: 0, width: 76, height: 66 },
            { x: 608, y: 0, width: 76, height: 66 },
            { x: 684, y: 0, width: 76, height: 66 },
            { x: 760, y: 0, width: 76, height: 66 },
            { x: 836, y: 0, width: 76, height: 66 },
            { x: 912, y: 0, width: 76, height: 66 },
            { x: 988, y: 0, width: 76, height: 66 },
            { x: 1064, y: 0, width: 76, height: 66 },
            { x: 1140, y: 0, width: 76, height: 66 },
        ],
        src: '/game-assets/characters/beast/attack-down.png',
        loop: false,
        anchor: {
            x: 0.486,
            y: 0.7,
        }
    }
]