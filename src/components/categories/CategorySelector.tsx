import type { Category } from '../../types'
import { ChevronDown, Tag } from 'lucide-react'
import { useState } from 'react'

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
                className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg"
            >
                <Tag className="w-4 h-4" />
                <span className="text-sm">
                    {selectedCategoryId
                        ? categories.find(c => c.id === selectedCategoryId)?.name || 'Todas'
                        : 'Todas'
                    }
                </span>
                <ChevronDown className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                    <button
                        onClick={() => {
                            onCategorySelect(null)
                            setIsOpen(false)
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50"
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
                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${selectedCategoryId === category.id ? 'bg-blue-50 text-blue-600' : ''
                                }`}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )


}

