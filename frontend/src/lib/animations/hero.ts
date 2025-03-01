import type { AnimationData } from '../types'

export const heroAnimations: AnimationData[] = [
    {
        name: 'idle_down',
        frames: [
            { x: 0, y: 0, width: 64, height: 65 },
            { x: 64, y: 0, width: 64, height: 65 },
            { x: 128, y: 0, width: 64, height: 65 },
            { x: 192, y: 0, width: 64, height: 65 },
            { x: 256, y: 0, width: 64, height: 65 },
            { x: 320, y: 0, width: 64, height: 65 },
            { x: 384, y: 0, width: 64, height: 65 },
            { x: 448, y: 0, width: 64, height: 65 },
            { x: 512, y: 0, width: 64, height: 65 },
            { x: 576, y: 0, width: 64, height: 65 },
            { x: 640, y: 0, width: 64, height: 65 },
            { x: 704, y: 0, width: 64, height: 65 },
        ],
        src: '/game-assets/characters/hero/idle-down.png',
        loop: true,
        anchor: { x: 0.3125, y: 0.63 },
    },
    {
        name: 'run_up',
        frames: [
            { x: 0, y: 0, width: 64, height: 65 },
            { x: 64, y: 0, width: 64, height: 65 },
            { x: 128, y: 0, width: 64, height: 65 },
            { x: 192, y: 0, width: 64, height: 65 },
            { x: 256, y: 0, width: 64, height: 65 },
            { x: 320, y: 0, width: 64, height: 65 },
            { x: 384, y: 0, width: 64, height: 65 },
            { x: 448, y: 0, width: 64, height: 65 },
        ],
        src: '/game-assets/characters/hero/run-up.png',
        loop: true,
        anchor: { x: 0.3125, y: 0.63 },
    },
    {
        name: 'idle_up',
        frames: [
            { x: 0, y: 0, width: 64, height: 65 },
            { x: 64, y: 0, width: 64, height: 65 },
            { x: 128, y: 0, width: 64, height: 65 },
            { x: 192, y: 0, width: 64, height: 65 },
            { x: 256, y: 0, width: 64, height: 65 },
            { x: 320, y: 0, width: 64, height: 65 },
            { x: 384, y: 0, width: 64, height: 65 },
            { x: 448, y: 0, width: 64, height: 65 },
            { x: 512, y: 0, width: 64, height: 65 },
            { x: 576, y: 0, width: 64, height: 65 },
            { x: 640, y: 0, width: 64, height: 65 },
            { x: 704, y: 0, width: 64, height: 65 },
        ],
        src: '/game-assets/characters/hero/idle-up.png',
        loop: true,
        anchor: { x: 0.3125, y: 0.63 },
    },
    {
        name: 'hit',
        frames: [
            { x: 0, y: 0, width: 64, height: 65 },
            { x: 64, y: 0, width: 64, height: 65 },
            { x: 128, y: 0, width: 64, height: 65 },
            { x: 192, y: 0, width: 64, height: 65 },
            { x: 256, y: 0, width: 64, height: 65 },
            { x: 320, y: 0, width: 64, height: 65 },
            { x: 384, y: 0, width: 64, height: 65 },
            { x: 448, y: 0, width: 64, height: 65 },
            { x: 512, y: 0, width: 64, height: 65 },
            { x: 576, y: 0, width: 64, height: 65 },
            { x: 640, y: 0, width: 64, height: 65 },
            { x: 704, y: 0, width: 64, height: 65 },
        ],
        src: '/game-assets/characters/hero/hit-idle-up.png',
        loop: true,
        anchor: { x: 0.3125, y: 0.63 },
    },
    {
        name: 'attack_up',
        frames: [
            { x: 0, y: 0, width: 64, height: 65 },
            { x: 64, y: 0, width: 64, height: 65 },
            { x: 128, y: 0, width: 64, height: 65 },
            { x: 192, y: 0, width: 64, height: 65 },
            { x: 256, y: 0, width: 64, height: 65 },
            { x: 320, y: 0, width: 64, height: 65 },
            { x: 384, y: 0, width: 64, height: 65 },
        ],
        src: '/game-assets/characters/hero/attack-up.png',
        loop: false,
        anchor: { x: 0.3125, y: 0.63 },
    },
    {
        name: 'crit_up',
        frames: [
            { x: 0, y: 0, width: 64, height: 65 },
            { x: 64, y: 0, width: 64, height: 65 },
            { x: 128, y: 0, width: 64, height: 65 },
            { x: 192, y: 0, width: 64, height: 65 },
        ],
        src: '/game-assets/characters/hero/crit-up.png',
        loop: false,
        anchor: { x: 0.3125, y: 0.63 },
    },
]