import { useState, useEffect, useCallback } from 'react'
import { registerSW } from 'virtual:pwa-register'

export interface UsePWAUpdateReturn {
    needRefresh: boolean
    offlineReady: boolean
    updateServiceWorker: () => void
    close: () => void
}

export function usePWAUpdate(): UsePWAUpdateReturn {
    const [needRefresh, setNeedRefresh] = useState(false)
    const [offlineReady, setOfflineReady] = useState(false)
    const [updateSW, setUpdateSW] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null)

    useEffect(() => {
        const updateServiceWorker = registerSW({
            onNeedRefresh() {
                setNeedRefresh(true)
            },
            onOfflineReady() {
                setOfflineReady(true)
            },
            onRegisteredSW(swUrl, registration) {
                // Verificar actualizaciones periódicamente (cada hora)
                if (registration) {
                    setInterval(() => {
                        registration.update()
                    }, 60 * 60 * 1000)
                }
            }
        })

        setUpdateSW(() => updateServiceWorker)
    }, [])

    const handleUpdate = useCallback(() => {
        if (updateSW) {
            updateSW(true)
        }
    }, [updateSW])

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
