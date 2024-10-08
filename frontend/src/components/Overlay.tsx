import React, { useState, useEffect } from 'react'
import TapToStart from './TapToStart'
import Fader from './Fader'
import { useScreen, Screens } from '@/hooks/useScreen'
import signal from '@/lib/signal'
import { useFade } from '@/hooks/useFade'
import GameOver from './GameOver'
import GameplayUI from './GameplayUI'
import { TRANSITION_DURATION } from '@/lib/constants'
import ExpBar from './ExpBar'
import UpgradesMenu from './UpgradesMenu'
import server from '@/lib/server/Server'
import GoldCounter from './GoldCounter'
import ExtractMenu from './ExtractMenu'

type OverlayProps = {}

const Overlay: React.FC<OverlayProps> = () => {
    const [displayedScreen, setDisplayedScreen] = useState<Screens | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const { screen, setScreen } = useScreen()
    const { fadeOut, fadeIn } = useFade()

    const [superProgress, setSuperProgress] = useState(0)

    const [formerExp, setFormerExp] = useState(0)
    const [newExp, setNewExp] = useState(0)

    const [levelNumber, setLevelNumber] = useState(0)

    const [shop, setShop] = useState<string[]>([])

    const [gold, setGold] = useState(0)

    const [upgrades, setUpgrades] = useState<string[]>([])

    useEffect(() => {
        setIsVisible(false)
        const timer = setTimeout(() => {
            setDisplayedScreen(screen)
            setIsVisible(true)
        }, TRANSITION_DURATION)
        return () => clearTimeout(timer)
    }, [screen])

    useEffect(() => {
        const onSuperProgress = (progress: number) => {
            setSuperProgress(progress)
        }
        const onGameOver = () => {
            setScreen('Game Over')
            setGold(0)
        }
        const onResetState = () => {
            setFormerExp(0)
            setNewExp(0)
            setGold(0)
            setLevelNumber(0)
            setUpgrades([])
        }
        const onShowUi = () => setScreen('Gameplay')
        const onExpGain = (xp: number) => {
            setScreen('Exp Bar')
            setFormerExp(newExp)
            setNewExp(xp)
        }
        const onShop = (newShop: string[]) => {
            setScreen('Upgrades')
            setShop(newShop)
        }
        const onUpdateGold = (newGold: number) => {
            setGold(newGold)
        }
        const onShowExtractMenu = () => {
            setScreen('Extract')
        }
        const onShowStart = () => {
            setScreen('Tap to Start')
        }
        const onUpdateLevelNumber = () => {
            setLevelNumber(levelNumber + 1)
        }
        const onLastStand = () => {
            setUpgrades(upgrades => upgrades.filter(upgrade => upgrade !== 'Last Stand'))
        }

        signal.on('exp-gain', onExpGain)
        signal.on('super-progress', onSuperProgress)
        signal.on('show-ui', onShowUi)
        signal.on('fade-out', fadeOut)
        signal.on('fade-in', fadeIn)
        signal.on('game-over', onGameOver)
        signal.on('update-gold', onUpdateGold)
        signal.on('show-extract-menu', onShowExtractMenu)
        signal.on('reset-state', onResetState)  
        signal.on('show-start', onShowStart)
        signal.on('update-level-number', onUpdateLevelNumber)
        signal.on('last-stand', onLastStand)
        server.socket.on('shop', onShop)

        return () => {
            signal.off('exp-gain', onExpGain)
            signal.off('super-progress', onSuperProgress)
            signal.off('show-ui', onShowUi)
            signal.off('fade-out', fadeOut)
            signal.off('fade-in', fadeIn)
            signal.off('game-over', onGameOver)
            signal.off('update-gold', onUpdateGold)
            signal.off('show-extract-menu', onShowExtractMenu)
            signal.off('reset-state', onResetState)
            signal.off('show-start', onShowStart)
            signal.off('update-level-number', onUpdateLevelNumber)
            signal.off('last-stand', onLastStand)
            server.socket.off('shop', onShop)
        }
    }, [fadeOut, fadeIn, setScreen, newExp, levelNumber])

    return (
        <div className='w-full h-full absolute'>
            <main 
                className={`w-full h-full transition-opacity duration-300 ease-in-out ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            >
                {displayedScreen === 'Tap to Start' && <TapToStart />}
                {displayedScreen === 'Game Over' && <GameOver />}
                {displayedScreen === 'Gameplay' && <GameplayUI superProgress={superProgress} levelNumber={levelNumber} upgrades={upgrades}/>}
                {displayedScreen === 'Exp Bar' && <ExpBar formerExp={formerExp} newExp={newExp}/>}
                {displayedScreen === 'Upgrades' && <UpgradesMenu options={shop} setUpgrades={setUpgrades}/>}
                {displayedScreen === 'Extract' && <ExtractMenu />}
            </main>
            <GoldCounter gold={gold}/>
            <Fader />
        </div>
    )
}

export default Overlay