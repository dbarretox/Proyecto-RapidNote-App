import { motion } from 'framer-motion'
import { Menu, Search, Plus, Tag, PenLine } from 'lucide-react'
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
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom z-50">
            <div className="px-2 pt-2 pb-3">
                <div className="max-w-lg mx-auto">
                    <div className="flex justify-around items-center">
                        {/* Items de navegación regulares */}
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeTab === item.id
                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => handleTabClick(item.id)}
                                    className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors min-w-[64px] ${
                                        isActive
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-400'
                                    }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Icon className="w-6 h-6 mb-1" />
                                    <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                        {item.label}
                                    </span>
                                </motion.button>
                            )
                        })}

                        {/* Botón de crear/editar */}
                        <motion.button
                            onClick={() => handleTabClick('add')}
                            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors min-w-[64px] ${
                                activeTab === 'add'
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-400'
                            }`}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${
                                activeTab === 'add'
                                    ? 'bg-blue-600 shadow-lg shadow-blue-500/30'
                                    : 'bg-blue-600 shadow-md shadow-blue-500/20'
                            }`}>
                                {editingId ? (
                                    <PenLine className="w-5 h-5 text-white" />
                                ) : (
                                    <Plus className="w-6 h-6 text-white" />
                                )}
                            </div>
                            <span className={`text-xs ${activeTab === 'add' ? 'font-semibold text-blue-600' : 'font-medium text-gray-500'}`}>
                                {editingId ? 'Editando' : 'Crear'}
                            </span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
