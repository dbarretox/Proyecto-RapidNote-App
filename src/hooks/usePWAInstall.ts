import { useState, useEffect } from "react"

// Interface para el evento de instalación
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export interface UsePWAInstallReturn {
  // Estados
  isInstallable: boolean
  isInstalled: boolean
  showIOSInstructions: boolean

  // Acciones
  installApp: () => Promise<void>
  showIOSModal: () => void
  hideIOSModal: () => void

  // Info del dispositivo
  isIOS: boolean
  isSafari: boolean
}

export function usePWAInstall(): UsePWAInstallReturn {
  // Estados PWA
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  // Detectar dispositivo
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isInWebApp = (window.navigator as any).standalone === true
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  // Efecto para detectar si la app está instalada
  useEffect(() => {
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOSInstalled = isIOS && isInWebApp
      setIsInstalled(isStandalone || isIOSInstalled)
    }

    checkIfInstalled()
    window.addEventListener('appinstalled', () => setIsInstalled(true))

    return () => {
      window.removeEventListener('appinstalled', () => setIsInstalled(true))
    }
  }, [isIOS, isInWebApp])

  // Efecto para capturar el evento beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  // Función para instalar la app
  const installApp = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
          console.log('✅ Usuario aceptó la instalación')
        }

        setDeferredPrompt(null)
        setIsInstallable(false)
      } catch (error) {
        console.error('Error durante la instalación:', error)
      }
    }
  }

  // Funciones para controlar el modal de iOS
  const showIOSModal = () => setShowIOSInstructions(true)
  const hideIOSModal = () => setShowIOSInstructions(false)

  return {
    // Estados
    isInstallable,
    isInstalled,
    showIOSInstructions,

    // Acciones
    installApp,
    showIOSModal,
    hideIOSModal,

    // Info del dispositivo
    isIOS,
    isSafari
  }
}