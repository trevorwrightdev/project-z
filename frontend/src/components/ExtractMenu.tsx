import React from 'react'
import Button from './Button'
import signal from '@/lib/signal'

type ExtractMenuProps = {
    
}

const ExtractMenu:React.FC<ExtractMenuProps> = () => {
    
    const onContinue = () => {
        signal.emit('continue')
    }

    const onExtract = () => {
        signal.emit('return-to-start')
    }

    return (
        <main className='w-full h-full grid place-items-center bg-zinc-800 bg-opacity-50'>
            <section className='flex flex-col items-center'>
                <div className='flex flex-row items-center gap-2'>
                    <Button label='Extract' onClick={onExtract} className='bg-red-500'/>
                    <Button label='Continue' onClick={onContinue}/>
                </div>
            </section>
        </main>
    )
}

export default ExtractMenu