import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ButtonProps {
    children: ReactNode
    onClick?: () => void
    className?: string
    variant?: "primary" | "secondary" | "toggle" | "tab"
    isActive?: boolean
}

export default function Button({
    children,
    onClick,
    className = "",
    variant = "primary",
    isActive = false
    
}: ButtonProps) {
    const baseStyles = "p-2 rounded-lg transition-colors font-medium flex items-center gap-2"
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        toggle: isActive
            ? "bg-blue-100 text-blue-600"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
        tab: isActive
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-800"
    }


    return (
        <motion.button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    )
}