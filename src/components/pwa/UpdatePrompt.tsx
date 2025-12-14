import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, X, Sparkles } from 'lucide-react'
import { useServiceWorker } from '@/hooks'

export default function UpdatePrompt() {
  const { needRefresh, isUpdating, updateServiceWorker, dismissUpdate } = useServiceWorker()

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-4 left-4 right-4 z-[100] max-w-md mx-auto"
        >
          <div className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 rounded-2xl p-[2px] shadow-2xl shadow-blue-500/25">
            <div className="bg-gray-900 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                {/* Icono animado */}
                <motion.div
                  className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center"
                  animate={{ rotate: isUpdating ? 360 : 0 }}
                  transition={{ duration: 1, repeat: isUpdating ? Infinity : 0, ease: 'linear' }}
                >
                  {isUpdating ? (
                    <RefreshCw className="w-5 h-5 text-white" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-white" />
                  )}
                </motion.div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm">
                    {isUpdating ? 'Actualizando...' : '¡Nueva versión disponible!'}
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {isUpdating
                      ? 'Por favor espera un momento'
                      : 'Hay mejoras esperándote'}
                  </p>
                </div>

                {/* Botón cerrar */}
                {!isUpdating && (
                  <button
                    onClick={dismissUpdate}
                    className="flex-shrink-0 p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Botón de actualizar */}
              {!isUpdating && (
                <motion.button
                  onClick={updateServiceWorker}
                  className="w-full mt-3 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualizar ahora
                </motion.button>
              )}

              {/* Barra de progreso */}
              {isUpdating && (
                <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
