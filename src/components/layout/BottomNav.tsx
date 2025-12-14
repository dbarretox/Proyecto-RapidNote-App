import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, Search, Plus, Folder, Sparkles } from 'lucide-react'
import type { SelectionMode } from '@/types'

interface BottomNavProps {
    activeTab: 'notes' | 'search' | 'add' | 'categories'
    editingId: string | null
    selectionMode: SelectionMode
    onTabChange: (tab: 'notes' | 'search' | 'add' | 'categories') => void
    onCancelEdit: () => void
    onCancelSelection: () => void
    onInitializeNewNote: () => void
}

const navItems = [
    { id: 'notes' as const, icon: LayoutGrid, label: 'Notas', color: 'from-blue-500 to-blue-600' },
    { id: 'search' as const, icon: Search, label: 'Buscar', color: 'from-purple-500 to-purple-600' },
    { id: 'categories' as const, icon: Folder, label: 'Carpetas', color: 'from-orange-500 to-orange-600' },
]

export default function BottomNav({
    activeTab,
    editingId,
    selectionMode,
    onTabChange,
    onCancelEdit,
    onCancelSelection,
    onInitializeNewNote
}: BottomNavProps) {
    const handleTabClick = (tab: 'notes' | 'search' | 'add' | 'categories') => {
        if (selectionMode.isActive) {
            onCancelSelection()
        }

        if (editingId && tab !== 'add') {
            onCancelEdit()
        }

        if (tab === 'add' && !editingId) {
            onInitializeNewNote()
        }

        onTabChange(tab)
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 safe-area-bottom z-50 px-4 pb-4">
            <motion.nav
                className="max-w-md mx-auto"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
                {/* Isla flotante */}
                <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-2 shadow-2xl shadow-black/20 border border-white/10">
                    <div className="flex items-center justify-between">
                        {/* Items de navegación */}
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeTab === item.id
                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => handleTabClick(item.id)}
                                    className="relative flex-1 flex flex-col items-center py-3 px-2"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                className={`absolute inset-1 bg-gradient-to-br ${item.color} rounded-2xl`}
                                                layoutId="activeTab"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                    <div className="relative z-10">
                                        <Icon className={`w-7 h-7 mb-1 transition-colors ${
                                            isActive ? 'text-white' : 'text-gray-400'
                                        }`} />
                                        <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                                            isActive ? 'text-white' : 'text-gray-500'
                                        }`}>
                                            {item.label}
                                        </span>
                                    </div>
                                </motion.button>
                            )
                        })}

                        {/* Separador */}
                        <div className="w-px h-12 bg-gray-700/50 mx-1" />

                        {/* Botón de crear - Destacado */}
                        <motion.button
                            onClick={() => handleTabClick('add')}
                            className="relative flex flex-col items-center px-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center ${
                                    activeTab === 'add'
                                        ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600'
                                        : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 opacity-80'
                                }`}
                                animate={{
                                    boxShadow: activeTab === 'add'
                                        ? '0 0 30px rgba(59, 130, 246, 0.5)'
                                        : '0 4px 20px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                {/* Efecto de brillo */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/30 to-transparent" />

                                {editingId ? (
                                    <Sparkles className="w-7 h-7 text-white relative z-10" />
                                ) : (
                                    <Plus className="w-8 h-8 text-white relative z-10" strokeWidth={2.5} />
                                )}

                                {/* Pulse cuando está activo */}
                                {activeTab === 'add' && (
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl bg-white"
                                        initial={{ opacity: 0.3, scale: 1 }}
                                        animate={{ opacity: 0, scale: 1.5 }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                )}
                            </motion.div>
                            <span className={`text-[10px] font-bold uppercase tracking-wide mt-1 ${
                                activeTab === 'add' ? 'text-cyan-400' : 'text-gray-400'
                            }`}>
                                {editingId ? 'Editar' : 'Nuevo'}
                            </span>
                        </motion.button>
                    </div>
                </div>
            </motion.nav>
        </div>
    )
}
