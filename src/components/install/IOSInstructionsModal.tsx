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
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Instalar en iPhone</h3>
                            <button
                                onClick={onClose}
                                className="p-2 -m-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    1
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 mb-2">Toca el botón Compartir</p>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                                        <Share className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm text-gray-600">En la barra inferior de Safari</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    2
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 mb-2">Selecciona "Añadir a inicio"</p>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                                        <Plus className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm text-gray-600">Busca esta opción en el menú</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    3
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 mb-2">Confirma tocando "Añadir"</p>
                                    <p className="text-sm text-gray-500">La app aparecerá en tu pantalla de inicio</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="flex items-center gap-2 mb-1">
                                <Download className="w-5 h-5 text-green-600" />
                                <span className="font-semibold text-green-800">¡Funciona sin internet!</span>
                            </div>
                            <p className="text-sm text-green-700">
                                Una vez instalada, podrás usar RapidNote offline.
                            </p>
                        </div>

                        <motion.button
                            onClick={onClose}
                            className="w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
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
