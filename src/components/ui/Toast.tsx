import { motion } from 'framer-motion'
import { X, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import type { ToastType } from '@/types'

interface ToastProps {
    message: string
    type: ToastType
    onDismiss: () => void
}

const toastStyles: Record<ToastType, { bg: string; text: string; icon: typeof Check }> = {
    success: { bg: 'bg-green-500', text: 'text-white', icon: Check },
    error: { bg: 'bg-red-500', text: 'text-white', icon: AlertCircle },
    info: { bg: 'bg-blue-500', text: 'text-white', icon: Info },
    warning: { bg: 'bg-yellow-500', text: 'text-gray-900', icon: AlertTriangle }
}

export function Toast({ message, type, onDismiss }: ToastProps) {
    const style = toastStyles[type]
    const Icon = style.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${style.bg} ${style.text}`}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">{message}</span>
            <button
                onClick={onDismiss}
                className="p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    )
}

export default Toast
