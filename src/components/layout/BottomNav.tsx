import { motion } from 'framer-motion'
import { Menu, Search, Plus, Tag } from 'lucide-react'
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
    { id: 'notes' as const, icon: Menu, label: 'Notas' },
    { id: 'search' as const, icon: Search, label: 'Buscar' },
    { id: 'categories' as const, icon: Tag, label: 'Categorías' },
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
        <motion.nav
            className="fixed bottom-0 left-0 right-0 glass-strong safe-area-bottom z-50"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
        >
            {/* Línea decorativa superior */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="px-4 pt-2 pb-4">
                <div className="max-w-lg mx-auto">
                    <div className="flex justify-around items-end relative">
                        {/* Items de navegación regulares */}
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeTab === item.id
                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => handleTabClick(item.id)}
                                    className={`relative flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-200 ${
                                        isActive
                                            ? 'text-blue-600'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                    whileTap={{ scale: 0.92 }}
                                >
                                    {/* Indicador de fondo activo */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navIndicator"
                                            className="absolute inset-0 bg-blue-50 rounded-2xl"
                                            initial={false}
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 35
                                            }}
                                        />
                                    )}
                                    <div className="relative z-10">
                                        <Icon className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                                            isActive ? 'scale-110' : ''
                                        }`} />
                                        <span className={`text-xs font-medium ${
                                            isActive ? 'font-semibold' : ''
                                        }`}>
                                            {item.label}
                                        </span>
                                    </div>
                                </motion.button>
                            )
                        })}

                        {/* Botón FAB de crear/editar */}
                        <motion.button
                            onClick={() => handleTabClick('add')}
                            className="flex flex-col items-center relative"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                                    activeTab === 'add'
                                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/40 ring-4 ring-blue-100'
                                        : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30'
                                }`}
                                animate={{
                                    rotate: activeTab === 'add' ? 45 : 0,
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <Plus className="w-6 h-6 text-white" />
                            </motion.div>
                            <span className={`text-xs font-medium mt-1 transition-colors ${
                                activeTab === 'add' ? 'text-blue-600 font-semibold' : 'text-gray-500'
                            }`}>
                                {editingId ? 'Editar' : 'Crear'}
                            </span>

                            {/* Pulse animado cuando está activo */}
                            {activeTab === 'add' && (
                                <motion.div
                                    className="absolute top-0 w-12 h-12 rounded-2xl bg-blue-400"
                                    initial={{ opacity: 0.4, scale: 1 }}
                                    animate={{
                                        opacity: 0,
                                        scale: 1.5,
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeOut"
                                    }}
                                />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}
