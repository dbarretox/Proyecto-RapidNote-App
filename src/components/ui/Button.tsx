import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ButtonProps {
    children: ReactNode
    onClick?: () => void
    className?: string
    variant?: "primary" | "secondary" | "toggle" | "tab" | "danger"
    isActive?: boolean
    disabled?: boolean
}

export function Button({
    children,
    onClick,
    className = "",
    variant = "primary",
    isActive = false,
    disabled = false
}: ButtonProps) {
    const baseStyles = "rounded-lg transition-colors font-medium flex items-center gap-2"
    const variants = {
        primary: "px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none",
        secondary: "px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled: opacity-50 disabled:cursor-not-allowed",
        danger: "px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-100 disaled:text-gray-400 disabled:cursor-not-allowed",
        toggle: isActive
            ? "px-3 py-2 bg-blue-100 text-blue-600 disabled:opacity-50"
            : "px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50",
        tab: isActive
            ? "px-3 py-2 bg-white text-blue-600 shadow-sm disabled:opacity-50"
            : "px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
    }


    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    )
}

export { Button as default }