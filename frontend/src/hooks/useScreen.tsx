'use client'
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type Screens = 'None' | 'Tap to Start' | 'Game Over' | 'Gameplay' | 'Exp Bar' | 'Upgrades' | 'Extract'

interface ScreenContextType {
  screen: Screens
  setScreen: (screen: Screens) => void
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined)

export const ScreenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<Screens>('Tap to Start')

  const setScreenCallback = useCallback((newScreen: Screens) => {
    setScreen(newScreen)
  }, [])

  return (
    <ScreenContext.Provider value={{ screen, setScreen: setScreenCallback }}>
      {children}
    </ScreenContext.Provider>
  )
}

export const useScreen = (): ScreenContextType => {
  const context = useContext(ScreenContext)
  if (context === undefined) {
    throw new Error('useScreen must be used within a ScreenProvider')
  }
  return context
}