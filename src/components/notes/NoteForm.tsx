import type { Category } from "@/types"
import { motion } from "framer-motion"
import { Save, Plus, Type, FileText, Keyboard } from "lucide-react"
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
            titleRef.current.focus()
        }
    }, [editingId])

    // Auto-resize del textarea
    useEffect(() => {
        const textarea = contentRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${Math.max(140, textarea.scrollHeight)}px`
        }
    }, [content])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Guardar con Cmd/Ctrl + Enter
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
        <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Input de título */}
            <motion.div
                className="relative group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-colors duration-200 group-focus-within:text-blue-500">
                    <Type className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                </div>
                <input
                    ref={titleRef}
                    type="text"
                    placeholder="Título de la nota"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-12 pr-4 py-4 text-lg font-semibold bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 placeholder-gray-400 shadow-sm hover:border-gray-200"
                    autoComplete="off"
                />
            </motion.div>

            {/* Textarea de contenido */}
            <motion.div
                className="relative group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
            >
                <div className="absolute left-4 top-4 pointer-events-none transition-colors duration-200">
                    <FileText className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                </div>
                <textarea
                    ref={contentRef}
                    placeholder="Escribe tu nota aquí..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-12 pr-4 py-4 text-base leading-relaxed bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 placeholder-gray-400 resize-none min-h-[140px] shadow-sm hover:border-gray-200"
                    rows={4}
                />
            </motion.div>

            {/* Selector de categorías */}
            <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <label className="block text-sm font-semibold text-gray-700 ml-1">
                    Categoría
                </label>
                <CategorySelector
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onCategorySelect={onCategoryChange}
                />
            </motion.div>

            {/* Contador de caracteres */}
            <motion.div
                className="flex justify-between items-center text-xs px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
            >
                <div className="flex gap-4 text-gray-400">
                    {title.length > 0 && (
                        <span className="flex items-center gap-1">
                            <span className="font-medium text-gray-500">{title.length}</span> caracteres en título
                        </span>
                    )}
                    {content.length > 0 && (
                        <span className="flex items-center gap-1">
                            <span className="font-medium text-gray-500">{content.length}</span> caracteres en contenido
                        </span>
                    )}
                </div>
            </motion.div>

            {/* Botón de guardar */}
            <motion.button
                onClick={handleSave}
                disabled={isDisabled}
                className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-all duration-300 ${isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'btn-primary text-white'
                    }`}
                whileHover={!isDisabled ? { scale: 1.01, y: -2 } : {}}
                whileTap={!isDisabled ? { scale: 0.99 } : {}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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

            {/* Ayuda de teclado */}
            <motion.div
                className="flex items-center justify-center gap-2 text-xs text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Keyboard className="w-3.5 h-3.5" />
                <span>
                    {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter para guardar rápido
                </span>
            </motion.div>
        </motion.div>
    )
}
