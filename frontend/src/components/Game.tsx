'use client'
import { App } from '@/lib/App'
import { useEffect, useRef } from 'react'
import { useFade } from '@/hooks/useFade'
import Overlay from '@/components/Overlay'

export default function Game() {

    const appRef = useRef<App>()
    const { fadeIn } = useFade()

    useEffect(() => {
        const mount = async () => {
            const app = new App()
            appRef.current = app
            await app.init()
            fadeIn()
        }

        if (!appRef.current) {
            mount()
        }

        return () => {
            appRef.current?.destroy()
        }
    }, [])

  return (
    <main id='app-container' className='w-full h-full overflow-hidden'>
        <Overlay />
    </main>
  )
}
