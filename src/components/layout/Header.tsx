import { InstallPrompt } from "../install"
import { X, CheckSquare, Zap } from "lucide-react"
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
            className="relative overflow-hidden sticky top-0 z-40 safe-area-top"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />

            {/* Patrón decorativo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl transform -translate-x-12 translate-y-12" />
            </div>

            <div className="relative px-4 py-4">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    {/* Logo y título */}
                    <div className="flex items-center space-x-3">
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.05, rotate: -5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Icono con efecto glow */}
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg shadow-black/10">
                                <Zap className="w-6 h-6 text-white" fill="currentColor" />
                            </div>
                            {/* Indicador de actividad */}
                            <motion.div
                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>

                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight">
                                Rapid<span className="text-cyan-300">Note</span>
                            </h1>
                            {notes.length > 0 ? (
                                <p className="text-xs text-white/70 font-medium">
                                    {notes.length} nota{notes.length !== 1 ? 's' : ''} guardada{notes.length !== 1 ? 's' : ''}
                                    {selectionMode.isActive && selectionMode.selectedIds.size > 0 && (
                                        <span className="text-cyan-300 ml-1">
                                            • {selectionMode.selectedIds.size} seleccionada{selectionMode.selectedIds.size !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </p>
                            ) : (
                                <p className="text-xs text-white/70 font-medium">Tu espacio de ideas</p>
                            )}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                        {notes.length > 0 && activeTab === 'notes' && (
                            <motion.button
                                onClick={selectionMode.isActive ? onCancelSelection : onToggleSelection}
                                className={`p-3 rounded-xl transition-all ${
                                    selectionMode.isActive

                                        : 'bg-white/20 text-white border border-white/30'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {selectionMode.isActive ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <CheckSquare className="w-5 h-5" />
                                )}
                            </motion.button>
                        )}

                        <InstallPrompt />
                    </div>
                </div>
            </div>

            {/* Borde inferior con efecto */}
in
        </motion.header>
    )
}
