import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ButtonProps {
    children: ReactNode
    onClick?: () => void
    className?: string
    variant?: "primary" | "secondary" | "toggle" | "tab" | "danger" | "ghost"
    isActive?: boolean
    disabled?: boolean
    size?: "sm" | "md" | "lg"
}

export function Button({
    children,
    onClick,
    className = "",
    variant = "primary",
    isActive = false,
    disabled = false,
    size = "md"
}: ButtonProps) {
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2.5",
        lg: "px-6 py-3 text-lg"
    }

    const baseStyles = `rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2 ${sizes[size]}`

    const variants = {
        primary: `btn-primary text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none`,
        secondary: `bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`,
        danger: `bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/35 hover:from-red-600 hover:to-red-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none`,
        ghost: `text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`,
        toggle: isActive
            ? "bg-blue-100 text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
        tab: isActive
            ? "bg-white text-blue-600 shadow-md"
            : "text-gray-500 hover:text-gray-800 hover:bg-white/50"
    }

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
        >
            {children}
        </motion.button>
    )
}

export { Button as default }
