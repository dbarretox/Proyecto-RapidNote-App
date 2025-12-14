import type { Category } from "@/types"
import { motion } from "framer-motion"
import { Save, Plus } from "lucide-react"
import { useRef, useEffect } from "react"
import { CategorySelector } from "../categories"

type Props = {
    title: string
    setTitle: (value: string) => void
    content: string
    setContent: (value: string) => void
    editingId: string | null
    categories: Category[]
    selectedCategoryId: string | null
    onCategoryChange: (categoryId: string | null) => void
    onSave: () => void
}

export default function NoteForm({
    title,
    setTitle,
    content,
    setContent,
    editingId,
    categories,
    selectedCategoryId,
    onCategoryChange,
    onSave
}: Props) {
    const titleRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLTextAreaElement>(null)

    // Auto-focus en título al crear nueva nota
    useEffect(() => {
        if (!editingId && titleRef.current) {
            // Pequeño delay para evitar problemas con el teclado móvil
            setTimeout(() => {
                titleRef.current?.focus()
            }, 100)
        }
    }, [editingId])

    // Auto-resize del textarea
    useEffect(() => {
        const textarea = contentRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`
        }
    }, [content])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault()
            handleSave()
        }
    }

    const handleSave = () => {
        if (!title.trim() && !content.trim()) {
            return
        }
        onSave()
    }

    const isDisabled = !title.trim() && !content.trim()

    return (
        <div className="space-y-4">
            {/* Input de título */}
            <input
                ref={titleRef}
                type="text"
                placeholder="Título de la nota"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-4 text-lg font-semibold bg-white border border-gray-100 rounded-xl focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                autoComplete="off"
            />

            {/* Textarea de contenido */}
            <textarea
                ref={contentRef}
                placeholder="¿Qué tienes en mente?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-4 text-base leading-relaxed bg-white border border-gray-100 rounded-xl focus:border-blue-400 outline-none transition-all placeholder-gray-400 resize-none min-h-[100px]"
                rows={4}
            />

            {/* Selector de categorías */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría
                </label>
                <CategorySelector
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onCategorySelect={onCategoryChange}
                />
            </div>

            {/* Contador de caracteres */}
            {(title.length > 0 || content.length > 0) && (
                <div className="flex gap-4 text-xs text-gray-400 px-1">
                    {title.length > 0 && (
                        <span>Título: <span className="text-gray-500 font-medium">{title.length}</span></span>
                    )}
                    {content.length > 0 && (
                        <span>Contenido: <span className="text-gray-500 font-medium">{content.length}</span></span>
                    )}
                </div>
            )}

            {/* Botón de guardar */}
            <motion.button
                onClick={handleSave}
                disabled={isDisabled}
                className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                    isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/25'
                }`}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
                {editingId ? (
                    <>
                        <Save className="w-5 h-5" />
                        Actualizar nota
                    </>
                ) : (
                    <>
                        <Plus className="w-5 h-5" />
                        Guardar nota
                    </>
                )}
            </motion.button>

            {/* Atajo de teclado */}
            <p className="text-center text-xs text-gray-400">
                {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter para guardar rápido
            </p>
        </div>
    )
}
