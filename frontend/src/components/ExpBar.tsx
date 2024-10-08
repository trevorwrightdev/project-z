import React, { useState, useEffect, useRef } from 'react'
import { getExpLevel } from '@/lib/game-utils'
import signal from '@/lib/signal'
import { useScreen } from '@/hooks/useScreen'
import cn from '@/lib/cn'
import server from '@/lib/server/Server'

type ExpBarProps = {
    formerExp: number,
    newExp: number,
}

const ExpBar:React.FC<ExpBarProps> = ({ formerExp, newExp }) => {
    const initialLevelRef = useRef<number>(getExpLevel(formerExp))
    const [exp, setExp] = useState<number>(formerExp)
    const { setScreen } = useScreen()

    const currentLevel = getExpLevel(exp)
    const leveledUp = currentLevel > initialLevelRef.current

    useEffect(() => {
        if (exp < newExp) {
            const timer = setTimeout(() => {
                setExp(prevExp => Math.min(prevExp + 1, newExp))
            }, 1000 / 60)
            return () => clearTimeout(timer)
        }

        if (exp === newExp) {
            setTimeout(() => {
                if (leveledUp) {
                    server.socket.emit('get-shop')
                } else {
                    signal.emit('proceed')
                    setScreen('None')
                }
            }, leveledUp ? 2000 : 1000)
        }
    }, [exp, newExp, setScreen, leveledUp])
    
    return (
        <main className='w-full h-full grid place-items-center'>
            <section className='flex flex-col items-center'>
                <h1 className={cn('text-yellow-500 text-3xl', leveledUp ? 'opacity-100' : 'opacity-0')}>LEVEL UP!</h1>
                <h1 className={cn(leveledUp ? 'opacity-100' : 'opacity-0', 'text-xl uppercase')}><span className='text-red-500'>ATK</span> and <span className='text-green-500'>HP</span> increased.</h1>
                <h1 className='text-3xl'>LEVEL <span className={cn(leveledUp && 'text-yellow-500')}>{currentLevel}</span></h1>
                <h1 className='text-xl'>EXP: {exp}</h1>
            </section>
        </main>
    )
}
export default ExpBar