import type { Category } from "@/types"
import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { Button } from "../ui"

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
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border border-gray-200">
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
                        className="w-full px-4 py-4 text-base font-medium border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-0 outline-none transition-colors placeholder-gray-400"
                        placeholder="Ej: Trabajo, Personal..."
                        maxLength={20}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Color</label>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                        />
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-12 h-8 border-none rounded cursor-pointer"
                        />
                        <span className="text-sm text-gray-500">{color}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 mt-4">
                
                <Button
                    variant="primary"
                    className="flex-1 justify-center"
                    disabled={!name.trim()}
                    onClick={() => {
                        onSave({ name: name.trim(), color })
                        setName('')
                        setColor('#3B82F6')
                    }}
                >
                    <Check className="w-4 h-4" />
                    {editingCategory ? 'Actualizar' : 'Crear'}
                </Button>
                <Button
                    variant="secondary"
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    )
}