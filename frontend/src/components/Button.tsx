import React from 'react'
import cn from '@/lib/cn'

type ButtonProps = {
    label: string
    onClick: () => void
    className?: string
}

const Button:React.FC<ButtonProps> = ({ label, onClick, className }) => {
    
    return (
        <button className={cn('grid place-items-center bg-blue-400 text-black text-2xl uppercase px-2 rounded-md active:opacity-70 border-2 border-black', className)} onClick={onClick}>
            {label}
        </button>
    )
}
export default Button