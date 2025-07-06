import type { Category } from '@/types'
import { ChevronDown, Tag } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { isLightColor } from "@/utils"


interface CategorySelectorProps {
    categories: Category[]
    selectedCategoryId: string | null
    onCategorySelect: (categoryId: string | null) => void
}

export default function CategorySelector({
    categories,
    selectedCategoryId,
    onCategorySelect
}: CategorySelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
            >
                <Tag className="w-4 h-4" />
                <span className="text-sm">
                    {selectedCategoryId
                        ? categories.find(c => c.id === selectedCategoryId)?.name || 'Categorías'
                        : 'Categorías'
                    }
                </span>
                <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20"
                        >
                            <button
                                onClick={() => {
                                    onCategorySelect(null)
                                    setIsOpen(false)
                                }}
                                className="w-full px-3 py-2 text-left text-sm transition-colors text-gray-700 hover:bg-gray-50"
                            >
                                Todas las categorías
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        onCategorySelect(category.id)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                                        selectedCategoryId === category.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                    }`}
                                >
                                    <div
                                        className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                                            isLightColor(category.color) ? 'text-gray-800' : 'text-white'
                                            }`}
                                        style={{ backgroundColor: category.color }}
                                    >
                                    {category.name}
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}