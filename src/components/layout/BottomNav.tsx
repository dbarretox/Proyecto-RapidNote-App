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
}

export default function BottomNav({
    activeTab,
    editingId,
    selectionMode,
    onTabChange,
    onCancelEdit,
    onCancelSelection
}: BottomNavProps) {
    const handleTabClick = (tab: 'notes' | 'search' | 'add' | 'categories') => {
        if (selectionMode.isActive) {
            onCancelSelection()
        }

        if (editingId && tab !== 'add') {
            onCancelEdit()
        }

        onTabChange(tab)
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-3 pb-5">
            <div className="max-w-lg mx-auto">
                <div className="flex justify-around items-end">
                    <motion.button
                        onClick={() => handleTabClick('notes')}
                        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${activeTab === 'notes' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
                            }`}
                    >
                        <Menu className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Notas</span>
                    </motion.button>
                    <motion.button
                        onClick={() => handleTabClick('search')}
                        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${activeTab === 'search' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
                            }`}
                    >
                        <Search className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Buscar</span>
                    </motion.button>
                    <motion.button
                        onClick={() => handleTabClick('categories')}
                        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${activeTab === 'categories' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
                            }`}
                    >
                        <Tag className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Categorías</span>
                    </motion.button>
                    <motion.button
                        onClick={() => handleTabClick('add')}
                        className="flex flex-col items-center"
                    >
                        <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === 'add'
                                ? 'bg-blue-600 ring-2 ring-blue-200 ring-offset-2 scale-105'
                                : 'bg-blue-600'
                            } mb-1`}>
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-xs font-medium ${activeTab === 'add' ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                            {editingId ? 'Editar' : 'Crear'}
                        </span>
                    </motion.button>
                </div>
            </div>
        </div>
    )
}