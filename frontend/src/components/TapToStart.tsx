import React from 'react'
import { useScreen } from '@/hooks/useScreen'
import signal from '@/lib/signal'

type TapToStartProps = {
    
}

const TapToStart:React.FC<TapToStartProps> = () => {

    const { setScreen } = useScreen()

    const onClick = () => {
        setScreen('None')
        signal.emit('start')
    }
    
    return (
        <div className='w-full h-full grid place-items-center' onClick={onClick}>
            <div className='flex flex-col items-center animate-pulse'>
                <div className='w-[200px] h-[2px] bg-white'/>
                <h1 className='text-3xl'>TAP TO START</h1>
                <div className='w-[175px] h-[2px] bg-white'/>
            </div>
        </div>
    )
}
export default TapToStart