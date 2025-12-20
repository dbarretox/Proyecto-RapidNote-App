import { useState, useEffect, useCallback, useRef } from 'react'
import { registerSW } from 'virtual:pwa-register'

export interface UsePWAUpdateReturn {
    needRefresh: boolean
    offlineReady: boolean
    updateServiceWorker: () => void
    close: () => void
}

type UpdateSWFn = (reloadPage?: boolean) => Promise<void>

export function usePWAUpdate(): UsePWAUpdateReturn {
    const [needRefresh, setNeedRefresh] = useState(false)
    const [offlineReady, setOfflineReady] = useState(false)
    const updateSWRef = useRef<UpdateSWFn | null>(null)

    useEffect(() => {
        const updateServiceWorker = registerSW({
            onNeedRefresh() {
                setNeedRefresh(true)
            },
            onOfflineReady() {
                setOfflineReady(true)
            },
            onRegisteredSW(_swUrl: string, registration: ServiceWorkerRegistration | undefined) {
                // Verificar actualizaciones periódicamente (cada hora)
                if (registration) {
                    setInterval(() => {
                        registration.update()
                    }, 60 * 60 * 1000)
                }
            }
        })

        if (typeof updateServiceWorker === 'function') {
            updateSWRef.current = updateServiceWorker
        }
    }, [])

    const handleUpdate = useCallback(() => {
        if (updateSWRef.current) {
            updateSWRef.current(true)
        }
    }, [])

    const close = useCallback(() => {
        setNeedRefresh(false)
        setOfflineReady(false)
    }, [])

    return {
        needRefresh,
        offlineReady,
        updateServiceWorker: handleUpdate,
        close
    }
}
