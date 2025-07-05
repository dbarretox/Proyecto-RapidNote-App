import type { Category } from "../../types"
import { useState } from 'react'
import { X, Check } from 'lucide-react'

interface CategoryFormProps {
    onSave: (category: Omit<Category, 'id' | 'createdAt'>) => void
    onCancel: () => void
    editingCategory?: Category | null
}

export default function CategoryForm({
    onSave,
    onCancel,
    editingCategory
}: CategoryFormProps) {
    const [name, setName] = useState(editingCategory?.name || '')
    const [color, setColor] = useState(editingCategory?.color || '#3B82F6')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        onSave ({ name: name.trim(), color })
        setName('')
        setColor('#3B82F6')
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">
                    {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
                </h3>
                <button type="button" onClick={onCancel}>
                    <X className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Ej: Trabajo, Personal..."
                        maxLength={20}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Color</label>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-full border-2 border-gray-200"
                            style={{ backgroundColor: color }}
                        />
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-12 h-8 border rounded cursor-pointer"
                        />
                        <span className="text-sm text-gray-500">{color}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    type="submit"
                    disabled={!name.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                    <Check className="w-4 h-4" />
                    {editingCategory ? 'Actualizar' : 'Crear'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-600 border rounded-lg"
                >
                    Cancelar
                </button>
            </div>
        </form>
    )
}