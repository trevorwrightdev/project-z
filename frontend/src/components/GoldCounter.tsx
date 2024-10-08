import React, { useState, useEffect } from 'react'
import Image from 'next/image'

type GoldCounterProps = {
    gold: number
}

const GoldCounter:React.FC<GoldCounterProps> = ({ gold }) => {
    
    const [displayedGold, setDisplayedGold] = useState(0)

    useEffect(() => {
        if (gold > displayedGold) {
            const timer = setTimeout(() => {
                setDisplayedGold(prevGold => Math.min(prevGold + 1, gold))
            }, 1000 / 60)
            return () => clearTimeout(timer)
        } else if (gold < displayedGold){
            const timer = setTimeout(() => {
                setDisplayedGold(prevGold => {
                    let decrement = 1
                    if (prevGold > 100) {
                        decrement = Math.floor(prevGold * 0.1)
                    }

                    return Math.max(prevGold - decrement, gold, 0)
                })
            }, 1000 / 60)
            return () => clearTimeout(timer)
        }
    }, [gold, displayedGold])

    return (
        <main className='absolute top-8 left-1/2 transform -translate-x-1/2'>
            <section className='flex flex-row items-center'>
                <Image src='/game-assets/gold.png' alt='' width={16} height={16} className='w-16 h-16' style={{imageRendering: 'pixelated'}}/>
                <h1 className='text-[64px]'>{displayedGold}</h1>
            </section>
        </main>
    )
}

export default GoldCounter