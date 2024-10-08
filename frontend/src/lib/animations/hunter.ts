import type { AnimationData } from '../types'

export const hunterAnimations: AnimationData[] = [
    {
        name: 'idle_down',
        frames: [
            { x: 0, y: 0, width: 34, height: 37 },
            { x: 34, y: 0, width: 34, height: 37 },
            { x: 68, y: 0, width: 34, height: 37 },
            { x: 102, y: 0, width: 34, height: 37 },
            { x: 136, y: 0, width: 34, height: 37 },
            { x: 170, y: 0, width: 34, height: 37 },
        ],
        src: '/game-assets/characters/hunter/idle-down.png',
        loop: true,
        anchor: {
            x: 0.44,
            y: 1,
        }
    },
    {
        name: 'hit',
        frames: [
            { x: 0, y: 0, width: 34, height: 37 },
            { x: 34, y: 0, width: 34, height: 37 },
            { x: 68, y: 0, width: 34, height: 37 },
            { x: 102, y: 0, width: 34, height: 37 },
            { x: 136, y: 0, width: 34, height: 37 },
            { x: 170, y: 0, width: 34, height: 37 },
        ],
        src: '/game-assets/characters/hunter/hit-idle-down.png',
        loop: true,
        anchor: {
            x: 0.44,
            y: 1,
        }
    },
    {
        name: 'run_down',
        frames: [
            { x: 0, y: 0, width: 34, height: 37 },
            { x: 34, y: 0, width: 34, height: 37 },
            { x: 68, y: 0, width: 34, height: 37 },
            { x: 102, y: 0, width: 34, height: 37 },
            { x: 136, y: 0, width: 34, height: 37 },
            { x: 170, y: 0, width: 34, height: 37 },
        ],
        src: '/game-assets/characters/hunter/run-down.png',
        loop: true,
        anchor: {
            x: 0.44,
            y: 1,
        }
    },
    {
        name: 'attack_down',
        frames: [
            { x: 0, y: 0, width: 34, height: 37 },
            { x: 34, y: 0, width: 34, height: 37 },
            { x: 68, y: 0, width: 34, height: 37 },
            { x: 102, y: 0, width: 34, height: 37 },
            { x: 136, y: 0, width: 34, height: 37 },
            { x: 170, y: 0, width: 34, height: 37 },
            { x: 204, y: 0, width: 34, height: 37 }
        ],
        src: '/game-assets/characters/hunter/attack-down.png',
        loop: false,
        anchor: {
            x: 0.44,
            y: 1,
        }
    }
]