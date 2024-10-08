import { io, Socket } from 'socket.io-client'
import type { LevelPayload } from '../types'

class Server {
    public socket: Socket = {} as Socket
    public connected: boolean = false

    constructor() {
        this.socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
            reconnection: true,
            autoConnect: false,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        })
    }

    public async connect(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.socket.connect()

            this.socket.on('connect', () => {
                this.connected = true
                resolve(true)
            })

            this.socket.on('connect_error', (error) => {
                console.error('Error connecting to server:', error)
                reject()
            })
        })
    }

    public async createSession(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.socket.emit('create-session')

            const onSessionCreated = () => {
                resolve()
                this.socket.off('session-created', onSessionCreated)
            }

            this.socket.on('session-created', onSessionCreated)
        })
    }

    public async getCurrentLevel(): Promise<LevelPayload> {
        return new Promise<LevelPayload>((resolve, reject) => {
            this.socket.emit('get-next-level')

            const onNextLevel = (level: LevelPayload) => {
                resolve(level)
                this.socket.off('next-level', onNextLevel)
            }

            this.socket.on('next-level', onNextLevel)
        })
    }

    public disconnect() {
        if (this.connected) {
            this.connected = false
            this.socket.disconnect()
        }
    }
}   

const server = new Server()

export default server