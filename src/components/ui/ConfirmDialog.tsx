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
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-6 max-w-sm w-full overflow-hidden"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.15)'
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className={`p-2.5 rounded-xl ${isDanger ? 'bg-red-100' : 'bg-amber-100'}`}
                                    initial={{ rotate: -10, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
                                >
                                    <AlertTriangle className={`w-6 h-6 ${isDanger ? 'text-red-600' : 'text-amber-600'}`} />
                                </motion.div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {title}
                                </h3>
                            </div>
                            <motion.button
                                onClick={onCancel}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Message */}
                        <motion.p
                            className="text-gray-600 mb-6 leading-relaxed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            {message}
                        </motion.p>

                        {/* Actions */}
                        <motion.div
                            className="flex gap-3 justify-end"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Button
                                variant="secondary"
                                onClick={onCancel}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                variant={isDanger ? "danger" : "primary"}
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
