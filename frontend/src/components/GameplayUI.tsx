import React from 'react'
import signal from '@/lib/signal'

type GameplayUIProps = {
    superProgress: number,
    levelNumber: number,
    upgrades: string[]
}

function getTextColor(upgrade: string) {
    if (upgrade === 'HP Increase') {
        return 'text-green-500'
    } else if (upgrade === 'ATK Increase') {
        return 'text-red-700'
    } else if (upgrade === 'Follow-Up Chance Increase') {
        return 'text-blue-500'
    } else if (upgrade === 'Crit Chance Increase') {
        return 'text-red-500'
    } else if (upgrade === 'Heal on Kill') {
        return 'text-lime-300'
    } else if (upgrade === 'Last Stand') {
        return 'text-purple-500'
    } else if (upgrade === 'Vampiric Super') {
        return 'text-pink-600'
    } else if (upgrade === 'Critical Surge') {
        return 'text-orange-500'
    }
}

const GameplayUI:React.FC<GameplayUIProps> = ({ superProgress, levelNumber, upgrades }) => {

    const onClick = () => {
        signal.emit('super-pressed')
    }

    const formatUpgrades = (upgrades: string[]) => {
        const upgradeCounts = upgrades.reduce((acc, upgrade) => {
            acc[upgrade] = (acc[upgrade] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(upgradeCounts).map(([upgrade, count]) => ({
            upgrade,
            display: count > 1 ? `${upgrade} ${count}x` : upgrade
        }));
    };

    const formattedUpgrades = formatUpgrades(upgrades);

    return (
        <main className='w-full h-full relative grid place-items-center'>
            <p className='text-xl absolute top-4 left-4'>ROOM {levelNumber}</p>
            <section className='absolute bottom-4 left-4 flex flex-col'>
                {formattedUpgrades.map(({upgrade, display}, i) => (
                    <p key={i} className={`text-xl uppercase ${getTextColor(upgrade)}`}>{display}</p>
                ))}
            </section>
            <button className={`absolute bottom-24 text-4xl text-black bg-[#f5c842] border-4 border-black rounded-md active:opacity-70 overflow-hidden w-32 ${superProgress < 1 ? 'pointer-events-none opacity-35' : ''}`} onClick={onClick}>
                <div className='h-full bg-red-500 absolute' style={{
                    width: `${superProgress * 100}%`
                }}/>
                <span className='relative z-10'>SUPER!</span>
            </button>
        </main>
    )
}
export default GameplayUI