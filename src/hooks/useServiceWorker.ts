import { useState, useEffect, useCallback } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

// Intervalo para verificar actualizaciones (cada 60 segundos)
const UPDATE_CHECK_INTERVAL = 60 * 1000

export interface UseServiceWorkerReturn {
  // Estados
  needRefresh: boolean
  offlineReady: boolean
  isUpdating: boolean

  // Acciones
  updateServiceWorker: () => Promise<void>
  dismissUpdate: () => void
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [isUpdating, setIsUpdating] = useState(false)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW({
    // Verificar actualizaciones periódicamente
    onRegisteredSW(swUrl, registration) {
      if (registration) {
        // Verificar actualizaciones inmediatamente
        registration.update()

        // Verificar actualizaciones cada minuto
        setInterval(() => {
          registration.update()
        }, UPDATE_CHECK_INTERVAL)

        console.log('✅ Service Worker registrado:', swUrl)
      }
    },

    onRegisterError(error) {
      console.error('❌ Error registrando SW:', error)
    },

    onNeedRefresh() {
      console.log('🔄 Nueva versión disponible')
    },

    onOfflineReady() {
      console.log('✅ App lista para uso offline')
    },
  })

  // Función para aplicar la actualización
  const handleUpdate = useCallback(async () => {
    setIsUpdating(true)
    try {
      await updateServiceWorker(true)
      // La página se recargará automáticamente
    } catch (error) {
      console.error('Error actualizando:', error)
      setIsUpdating(false)
    }
  }, [updateServiceWorker])

  // Función para descartar la actualización
  const dismissUpdate = useCallback(() => {
    setNeedRefresh(false)
  }, [setNeedRefresh])

  // Escuchar evento de controllerchange para recargar automáticamente
  useEffect(() => {
    const handleControllerChange = () => {
      window.location.reload()
    }

    navigator.serviceWorker?.addEventListener('controllerchange', handleControllerChange)

    return () => {
      navigator.serviceWorker?.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  return {
    needRefresh,
    offlineReady,
    isUpdating,
    updateServiceWorker: handleUpdate,
    dismissUpdate,
  }
}
