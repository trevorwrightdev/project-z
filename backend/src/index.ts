import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server as SocketIOServer } from 'socket.io'
import { GameSession } from './game/GameSession'
import { z } from 'zod'
import { activateSuperSchema, upgradeSchema, Upgrade } from './zod'

require('dotenv').config()

const app = express()
const server = http.createServer(app)

app.use(cors({
    origin: process.env.FRONTEND_URL,
}))

const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
    },
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

const sessions: { [key: string]: GameSession } = {}

function getSession(socketId: string) {
    const session = sessions[socketId]
    return session
}

io.on('connection', (socket) => {
    socket.on('create-session', () => {
        const session = new GameSession()
        sessions[socket.id] = session
        socket.emit('session-created')
    })

    socket.on('get-next-level', () => {
        const session = getSession(socket.id)
        if (!session) return
        session.nextLevel()
        const enemies = session.currentEnemies
        socket.emit('next-level', {
            enemies,
            hero: session.currentHero,
            turns: session.turns,
        })
        console.clear()
        console.log(session.turns)
    })  

    socket.on('activate-super', (turnNumber: z.infer<typeof activateSuperSchema>) => {
        const res = activateSuperSchema.safeParse(turnNumber)
        if (!res.success) return

        const session = getSession(socket.id)
        if (!session) return

        if (!session.canSuper(turnNumber)) return

        if (!session.validateTurnNumber(turnNumber)) return

        session.activateSuper(turnNumber)

        console.clear()
        socket.emit('turns-updated', session.turns)
    })

    socket.on('get-shop', () => {
        const session = getSession(socket.id)
        if (!session) return
        socket.emit('shop', session.shop)
    })

    socket.on('upgrade', (upgrade: Upgrade) => {
        const res = upgradeSchema.safeParse(upgrade)
        if (!res.success) return

        const session = getSession(socket.id)
        if (!session) return

        session.getUpgrade(upgrade)
        socket.emit('upgrade-complete')
    })
})