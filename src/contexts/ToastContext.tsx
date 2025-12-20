import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { Toast, ToastType, ToastContextType } from '@/types'

const ToastContext = createContext<ToastContextType | null>(null)

const MAX_TOASTS = 3
const DEFAULT_DURATION = 3000

interface ToastProviderProps {
    children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

    const dismissToast = useCallback((id: string) => {
        // Limpiar el timer si existe
        const timer = timersRef.current.get(id)
        if (timer) {
            clearTimeout(timer)
            timersRef.current.delete(id)
        }

        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = DEFAULT_DURATION) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newToast: Toast = { id, message, type, duration }

        setToasts(prev => {
            // Si hay más de MAX_TOASTS, eliminar los más viejos
            const updated = [...prev, newToast]
            if (updated.length > MAX_TOASTS) {
                const toRemove = updated.slice(0, updated.length - MAX_TOASTS)
                toRemove.forEach(t => {
                    const timer = timersRef.current.get(t.id)
                    if (timer) {
                        clearTimeout(timer)
                        timersRef.current.delete(t.id)
                    }
                })
                return updated.slice(-MAX_TOASTS)
            }
            return updated
        })

        // Auto-dismiss después de la duración
        const timer = setTimeout(() => {
            dismissToast(id)
        }, duration)
        timersRef.current.set(id, timer)
    }, [dismissToast])

    // Limpiar todos los timers al desmontar
    useEffect(() => {
        return () => {
            timersRef.current.forEach(timer => clearTimeout(timer))
            timersRef.current.clear()
        }
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
        </ToastContext.Provider>
    )
}

export function useToast(): ToastContextType {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
