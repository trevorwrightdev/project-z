'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type FadeContextType = {
    isVisible: boolean
    fadeOut: () => Promise<void>
    fadeIn: () => Promise<void>
}

const defaultFadeContext: FadeContextType = {
    isVisible: false,
    fadeOut: async () => {},
    fadeIn: async () => {}
}

const FadeContext = createContext<FadeContextType>(defaultFadeContext)

export function FadeProvider({ children }: { children: ReactNode }) {
    const [isVisible, setIsVisible] = useState<boolean>(true)

    const fadeOut = (): Promise<void> => {
        return new Promise((resolve) => {
            setIsVisible(true)
            setTimeout(resolve, 300)
        })
    }

    const fadeIn = (): Promise<void> => {
        return new Promise((resolve) => {
            setIsVisible(false)
            setTimeout(resolve, 300)
        })
    }

    return (
        <FadeContext.Provider value={{ isVisible, fadeOut, fadeIn }}>
            {children}
        </FadeContext.Provider>
    )
}

export function useFade(): FadeContextType {
  return useContext(FadeContext)
}