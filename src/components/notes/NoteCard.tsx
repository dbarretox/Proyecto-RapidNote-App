import type { Note, SelectionMode, Category } from "@/types"
import { Star, StarOff, Trash2, Pencil, MoreHorizontal, CircleCheckBig, Circle, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

type Props = {
    note: Note
    onDelete: (id: string) => void
    onEdit: (note: Note) => void
    onToggleFavorite: (id: string) => void
    selectionMode: SelectionMode
    onToggleSelection: (id: string) => void
    categories: Category[]
}

export default function NoteCard({ 
    note, 
    onDelete, 
    onEdit, 
    onToggleFavorite, 
    selectionMode, 
    onToggleSelection,
    categories
}: Props) {
    const [showActions, setShowActions] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const isSelected = selectionMode.selectedIds.has(note.id)

    // Formatear fecha de forma inteligente
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffMinutes = Math.floor(diffMs / (1000 * 60))

        if (diffMinutes < 1) return "Ahora"
        if (diffMinutes < 60) return `${diffMinutes}m`
        if (diffHours < 24) return `${diffHours}h`
        if (diffDays === 1) return "Ayer"
        if (diffDays < 7) return `${diffDays}d`

        const isThisYear = date.getFullYear() === now.getFullYear()
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            ...(isThisYear ? {} : { year: 'numeric' })
        })
    }

    const noteCategory = note.categoryId
        ? categories.find(cat => cat.id === note.categoryId)
        : null

    return (
        <motion.div
            className={`note-card-container relative rounded-xl shadow-sm border transition-all duration-200 ${note.isFavorite
                    ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                } ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''} ${selectionMode.isActive ? 'cursor-pointer' : ''
                }`}
            data-note-id={note.id}
            onClick={() => selectionMode.isActive && onToggleSelection(note.id)}
            whileHover={{ scale: selectionMode.isActive ? 1.01 : 1 }}
            whileTap={{ scale: selectionMode.isActive ? 0.99 : 1 }}
            layout
        >
            {/* Header */}
            <div className="flex items-start justify-between p-4 pb-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Checkbox de selección */}
                    {selectionMode.isActive && (
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation()
                                onToggleSelection(note.id)
                            }}
                            className="flex-shrink-0 mt-1"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isSelected ? (
                                <CircleCheckBig className="w-6 h-6 text-blue-600" />
                            ) : (
                                <Circle className="w-6 h-6 text-gray-400" />
                            )}
                        </motion.button>
                    )}

                    <div className="flex-1 min-w-0">
                        {/* Título clickeable para expandir */}
                        <div
                            className={`flex items-start gap-2 ${note.content && !selectionMode.isActive ? 'cursor-pointer hover:text-blue-600' : ''
                                }`}
                            onClick={(e) => {
                                e.stopPropagation()
                                if (!selectionMode.isActive && note.content) {
                                    setIsExpanded(!isExpanded)
                                }
                            }}
                        >
                            <h3 className={`font-semibold text-gray-900 mb-1 leading-tight flex-1 transition-colors ${note.title ? 'text-lg' : 'text-base italic text-gray-500'
                                }`}>
                                {note.title || 'Sin título'}
                            </h3>
                            {note.content && !selectionMode.isActive && (
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-1"
                                >
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </motion.div>
                            )}
                        </div>

                        {/* Fecha */}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{formatDate(note.createdAt || parseInt(note.id))}</span>
                            {note.updatedAt && note.updatedAt !== note.createdAt && (
                                <>
                                    <span>•</span>
                                    <span>editado {formatDate(note.updatedAt)}</span>
                                </>
                            )}
                            {noteCategory && (
                                <div className="flex items-center gap-1">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: noteCategory.color }}
                                    />
                                    <span>{noteCategory.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Botón de favorito */}
                {!selectionMode.isActive && (
                    <motion.button
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleFavorite(note.id)
                        }}
                        className={`p-2 rounded-full transition-colors ${note.isFavorite
                                ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200'
                                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                            }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {note.isFavorite ? (
                            <Star className="w-5 h-5" fill="currentColor" />
                        ) : (
                            <StarOff className="w-5 h-5" />
                        )}
                    </motion.button>
                )}
            </div>

            {/* Contenido */}
            <div className="px-4 pb-4">
                {/* Texto expandible */}
                {note.content && (
                    <motion.div
                        initial={false}
                        animate={{
                            height: isExpanded ? "auto" : "4.5rem",
                            opacity: 1
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className={`text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap ${!isExpanded ? 'line-clamp-3' : ''
                            }`}>
                            {note.content}
                        </p>
                    </motion.div>
                )}

                {/* Botones de acción */}
                {!selectionMode.isActive && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(note)
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Pencil className="w-4 h-4" />
                                Editar
                            </motion.button>

                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (confirm('¿Estás seguro de eliminar esta nota?')) {
                                        onDelete(note.id)
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                            </motion.button>
                        </div>

                        {/* Menú de más opciones */}
                        <div className="relative">
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowActions(!showActions)
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </motion.button>

                            <AnimatePresence>
                                {showActions && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowActions(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                            className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 min-w-[160px]"
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onToggleFavorite(note.id)
                                                    setShowActions(false)
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                            >
                                                {note.isFavorite ? (
                                                    <>
                                                        <StarOff className="w-4 h-4 text-gray-500" />
                                                        <span>Quitar favorito</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Star className="w-4 h-4 text-yellow-500" />
                                                        <span>Marcar favorito</span>
                                                    </>
                                                )}
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Indicador visual de favorito */}
                {note.isFavorite && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-amber-500 rounded-l-xl" />
                )}
            </div>
        </motion.div>
    )
}