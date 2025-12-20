import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, X } from 'lucide-react'
import { usePWAUpdate } from '@/hooks/usePWAUpdate'

export function UpdatePrompt() {
    const { needRefresh, offlineReady, updateServiceWorker, close } = usePWAUpdate()

    const isVisible = needRefresh || offlineReady

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-20 left-4 right-4 z-50 max-w-lg mx-auto"
                >
                    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 p-4">
                        {needRefresh ? (
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <RefreshCw className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        Nueva versión disponible
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Actualiza para obtener las últimas mejoras
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        onClick={close}
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <X className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        onClick={updateServiceWorker}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Actualizar
                                    </motion.button>
                                </div>
                            </div>
                        ) : offlineReady ? (
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        Listo para usar offline
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        La app funciona sin conexión
                                    </p>
                                </div>
                                <motion.button
                                    onClick={close}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>
                        ) : null}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default UpdatePrompt
