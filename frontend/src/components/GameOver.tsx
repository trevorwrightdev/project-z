import React from 'react'
import Button from './Button'
import signal from '@/lib/signal'
import { useScreen } from '@/hooks/useScreen'

type GameOverProps = {
    
}

const GameOver:React.FC<GameOverProps> = () => {

    const { setScreen } = useScreen()

    const onClick = () => {
        setScreen('None')
        signal.emit('return-to-start')
    }

    return (
        <div className='w-full h-full grid place-items-center bg-zinc-800 bg-opacity-50'>
            <div className='flex flex-col items-center'>
                <h1 className='text-4xl text-red-500'>GAME OVER</h1>
                <p className='text-2xl'>YOU FAILED TO EXTRACT. YOUR GOLD HAS BEEN LOST.</p>
                <Button label='Home' onClick={onClick}/>
            </div>
        </div>
    )
}
export default GameOver