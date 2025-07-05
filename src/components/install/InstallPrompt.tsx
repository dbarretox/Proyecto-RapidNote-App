import { motion } from "framer-motion"
import { Smartphone } from "lucide-react"
import { usePWAInstall } from '@/hooks'
import IOSInstructionsModal from "./IOSInstructionsModal"

function InstallPrompt() {
  const {
    isInstallable,
    isInstalled,
    showIOSInstructions,
    installApp,
    showIOSModal,
    hideIOSModal,
    isIOS,
    isSafari
  } = usePWAInstall()

  // No mostrar nada si la app ya está instalada
  if (isInstalled) {
    return null
  }

  // No mostrar nada si no es instalable y no es iOS con Safari
  if (!isInstallable && !(isIOS && isSafari)) {
    return null
  }

  return (
    <>
      <motion.button
        onClick={isIOS ? showIOSModal : installApp}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Smartphone className="w-4 h-4" />
      </motion.button>

      <IOSInstructionsModal
        isOpen={showIOSInstructions}
        onClose={hideIOSModal}
      />
    </>
  )
}

export default InstallPrompt