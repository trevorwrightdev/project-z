import React from 'react'
import server from '@/lib/server/Server'
import { useScreen } from '@/hooks/useScreen'
import Button from './Button'

type UpgradesMenuProps = {
    options: string[]
    setUpgrades: React.Dispatch<React.SetStateAction<string[]>>
}

function getOtherStyles(upgrade: string) {
    if (upgrade === 'HP Increase') {
        return 'bg-green-500'
    } else if (upgrade === 'ATK Increase') {
        return 'bg-red-700'
    } else if (upgrade === 'Follow-Up Chance Increase') {
        return 'bg-blue-500'
    } else if (upgrade === 'Crit Chance Increase') {
        return 'bg-red-500'
    } else if (upgrade === 'Heal on Kill') {
        return 'bg-lime-300'
    } else if (upgrade === 'Last Stand') {
        return 'bg-purple-500'
    } else if (upgrade === 'Vampiric Super') {
        return 'bg-pink-600'
    } else if (upgrade === 'Critical Surge') {
        return 'bg-orange-500'
    }
}

const UpgradesMenu:React.FC<UpgradesMenuProps> = ({ options, setUpgrades }) => {

    const { setScreen } = useScreen()
    
    return (
        <main className='w-full h-full grid place-items-center'>
            <section className='flex flex-col items-center gap-2'>
                <h1 className='text-3xl text-yellow-500'>CHOOSE AN UPGRADE</h1>
                <section className='flex flex-col items-center gap-4'>
                    {options.map((option: string, i: number) => {

                        const onClick = () => {
                            setScreen('None')
                            server.socket.emit('upgrade', option)
                            setUpgrades(prevUpgrades => [...prevUpgrades, option])
                        }

                        return (
                            <Button key={i} className={getOtherStyles(option)} onClick={onClick} label={option}/>
                        )
                    })}
                </section>
            </section>
        </main>
    )
}

export default UpgradesMenu 