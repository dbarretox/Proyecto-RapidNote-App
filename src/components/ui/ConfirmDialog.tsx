import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import type { ConfirmDialogProps } from "@/types"
import { Button } from "./Button"

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    variant = "warning"
}: ConfirmDialogProps) {
    const isDanger = variant === 'danger'

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                        onClick={onCancel}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isDanger ? 'bg-red-100' : 'bg-yellow-100'}`}>
                                        <AlertTriangle className={`w-6 h-6 ${isDanger ? 'text-red-600' : 'text-yellow-600'}`} /> 
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {title}
                                    </h3>
                                </div>
                                <button
                                    onClick={onCancel}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            { /* Message */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {message}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={onCancel}
                                    className="px-4 py-2"
                                >
                                    {cancelText}
                                </Button>
                                <Button
                                    variant={isDanger ? "danger" : "primary"}
                                    onClick={onConfirm}
                                    className="px-4 py-2"
                                >
                                    {confirmText}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}