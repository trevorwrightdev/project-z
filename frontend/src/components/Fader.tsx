'use client'
import React from 'react'
import { useFade } from '@/hooks/useFade'

const Fader:React.FC = () => {

    const { isVisible } = useFade()

    return (
        <div 
            className={`absolute top-0 right-0 left-0 bottom-0 bg-black transition-opacity duration-300 ease-in-out ${
                isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        />
    )
}
export default Fader