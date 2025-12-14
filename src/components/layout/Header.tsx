import { Button } from "../ui"
import { InstallPrompt } from "../install"
import { X, CheckSquare, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import type { SelectionMode } from "@/types"

interface HeaderProps {
    notes: Array<{ id: string }>
    selectionMode: SelectionMode
    activeTab: 'notes' | 'search' | 'add' | 'categories'
    onToggleSelection: () => void
    onCancelSelection: () => void
}

export default function Header({
    notes,
    selectionMode,
    activeTab,
    onToggleSelection,
    onCancelSelection
}: HeaderProps) {
    return (
        <motion.header
            className="glass-strong sticky top-0 z-40 safe-area-top"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="px-4 py-3">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    {/* Logo y título */}
                    <div className="flex items-center space-x-3">
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <span className="text-white text-xl">📒</span>
                            </div>
                            <motion.div
                                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center"
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                <Sparkles className="w-2.5 h-2.5 text-white" />
                            </motion.div>
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">RapidNote</h1>
                            {notes.length > 0 && (
                                <motion.p
                                    className="text-xs text-gray-500 font-medium"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {notes.length} nota{notes.length !== 1 ? 's' : ''}
                                    {selectionMode.isActive && selectionMode.selectedIds.size > 0 && (
                                        <span className="text-blue-600 font-semibold">
                                            {' '}• {selectionMode.selectedIds.size} seleccionada{selectionMode.selectedIds.size !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </motion.p>
                            )}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                        {notes.length > 0 && activeTab === 'notes' && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                                <Button
                                    variant="toggle"
                                    isActive={selectionMode.isActive}
                                    onClick={selectionMode.isActive ? onCancelSelection : onToggleSelection}
                                    className="!rounded-xl"
                                >
                                    {selectionMode.isActive ? (
                                        <X className="w-5 h-5" />
                                    ) : (
                                        <CheckSquare className="w-5 h-5" />
                                    )}
                                </Button>
                            </motion.div>
                        )}

                        <InstallPrompt />
                    </div>
                </div>
            </div>

            {/* Línea decorativa inferior */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </motion.header>
    )
}
