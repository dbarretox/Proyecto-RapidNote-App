import type { Category } from '@/types' 
import { Edit2, Trash2 } from 'lucide-react'

interface CategoryListProps {
    categories: Category[]
    onEdit: (category: Category) => void
    onDelete: (categoryId: string) => void
}

export default function CategoryList({
    categories,
    onEdit,
    onDelete
}: CategoryListProps) {
    if (categories.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No hay categorías creadas</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {categories.map(category => (
                <div key={category.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: category.color }}
                        />
                        <div>
                            <h4 className="font-medium text-gray-900">{category.name}</h4>
                            <p className="text-sm text-gray-500">
                                Creada {new Date(category.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(category)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(category.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}