import { motion, AnimatePresence } from "framer-motion"
import { X, Share, Plus, Download } from "lucide-react"

interface IOSInstructionsModalProps {
  isOpen: boolean
  onClose: () => void
}

function IOSInstructionsModal({ isOpen, onClose }: IOSInstructionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-t-2xl p-6 w-full max-w-sm mx-4"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Instalar en iPhone</h3>
              <button
                onClick={onClose}
                className="p-2 -m-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">Toca el botón Compartir</p>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Share className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">En la barra inferior de Safari</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">Selecciona "Añadir a pantalla de inicio"</p>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Plus className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Busca esta opción en el menú</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">Confirma tocando "Añadir"</p>
                  <p className="text-sm text-gray-600">La app aparecerá en tu pantalla de inicio</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">¡Funciona sin internet!</span>
              </div>
              <p className="text-sm text-green-700">
                Una vez instalada, podrás usar RapidNote aunque no tengas conexión.
              </p>
            </div>

            <motion.button
              onClick={onClose}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Entendido
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default IOSInstructionsModal