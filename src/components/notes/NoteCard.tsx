import type { Note, SelectionMode, Category } from "@/types"
import { Star, StarOff, Trash2, Pencil, CircleCheckBig, Circle, ChevronDown } from "lucide-react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import type { PanInfo } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { isLightColor } from "@/utils"
import { ConfirmDialog } from "@/components/ui"

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
    const [isExpanded, setIsExpanded] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const isSelected = selectionMode.selectedIds.has(note.id)
    const [needsExpansion, setNeedsExpansion] = useState(false)
    const contentRef = useRef<HTMLParagraphElement>(null)

    // Swipe gesture values
    const x = useMotionValue(0)
    // Opacidad del icono de eliminar (aparece al swipear izquierda)
    const deleteIconOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0])
    // Opacidad del icono de favorito (aparece al swipear derecha)
    const favoriteIconOpacity = useTransform(x, [0, 50, 100], [0, 0.5, 1])

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x < -100) {
            // Swipe izquierda: eliminar
            setShowDeleteConfirm(true)
        } else if (info.offset.x > 100) {
            // Swipe derecha: toggle favorito
            onToggleFavorite(note.id)
        }
    }


    useEffect(() => {
        if (contentRef.current && note.content) {
            const element = contentRef.current
            element.style.webkitLineClamp = 'none'
            element.style.overflow = 'visible'

            const lineHeight = parseFloat(getComputedStyle(element).lineHeight)
            const maxHeight = lineHeight * 2
            setNeedsExpansion(element.scrollHeight > maxHeight)

            element.style.webkitLineClamp = ''
            element.style.overflow = ''

        }
    }, [note.content])

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
        <div className="note-card-container relative rounded-2xl" data-note-id={note.id}>
            {/* Fondo de eliminar (rojo) - visible al swipear izquierda */}
            <motion.div
                className="absolute inset-0 bg-red-500 flex items-center justify-end pr-6 rounded-2xl"
                style={{ opacity: deleteIconOpacity }}
            >
                <Trash2 className="w-6 h-6 text-white" />
            </motion.div>

            {/* Fondo de favorito (amarillo) - visible al swipear derecha */}
            <motion.div
                className="absolute inset-0 bg-amber-400 flex items-center justify-start pl-6 rounded-2xl"
                style={{ opacity: favoriteIconOpacity }}
            >
                <Star className="w-6 h-6 text-white" fill="white" />
            </motion.div>

            {/* Card */}
            <motion.article
                className={`relative overflow-hidden rounded-2xl transition-all duration-300 bg-white border border-gray-100 ${
                    isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                } ${selectionMode.isActive ? 'cursor-pointer' : ''}`}
                style={{
                    boxShadow: '0 2px 12px -4px rgba(0, 0, 0, 0.08), 0 4px 20px -8px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => selectionMode.isActive && onToggleSelection(note.id)}
                whileHover={{
                    scale: selectionMode.isActive ? 1.01 : 1,
                    boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.12), 0 8px 24px -8px rgba(0, 0, 0, 0.15)'
                }}
                whileTap={{ scale: selectionMode.isActive ? 0.98 : 1 }}
                layout
                {...(!selectionMode.isActive && {
                    drag: "x",
                    dragConstraints: { left: -150, right: 150 },
                    dragSnapToOrigin: true,
                    dragElastic: 0.5,
                    onDragEnd: handleDragEnd,
                    whileDrag: { scale: 1.02, cursor: "grabbing" },
                    style: { x, touchAction: "pan-y", boxShadow: '0 2px 12px -4px rgba(0, 0, 0, 0.08), 0 4px 20px -8px rgba(0, 0, 0, 0.1)' }
                })}
            >
            {/* Indicador de favorito (barra lateral) */}
            {note.isFavorite && (
                <motion.div
                    className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 via-yellow-400 to-orange-400 rounded-l-2xl"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Checkbox de selección */}
                    <AnimatePresence>
                        {selectionMode.isActive && (
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onToggleSelection(note.id)
                                }}
                                className="flex-shrink-0 mt-0.5"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isSelected ? (
                                    <CircleCheckBig className="w-6 h-6 text-blue-600" />
                                ) : (
                                    <Circle className="w-6 h-6 text-gray-300" />
                                )}
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div className="flex-1 min-w-0">
                        {/* Título clickeable para expandir */}
                        <div
                            className={`flex items-center gap-2 ${
                                note.content && !selectionMode.isActive ? 'cursor-pointer group' : ''
                            }`}
                            onClick={(e) => {
                                e.stopPropagation()
                                if (!selectionMode.isActive && note.content) {
                                    setIsExpanded(!isExpanded)
                                }
                            }}
                        >
                            <h3 className={`font-semibold leading-tight flex-1 transition-colors ${
                                note.title ? 'text-lg text-gray-900 group-hover:text-blue-600' : 'text-base italic text-gray-400'
                            }`}>
                                {note.title || 'Sin título'}
                            </h3>
                            {needsExpansion && !selectionMode.isActive && (
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </motion.div>
                            )}
                        </div>

                        {/* Metadata: fecha y categoría */}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs text-gray-400 font-medium">
                                {formatDate(note.createdAt || parseInt(note.id))}
                            </span>
                            {note.updatedAt && note.updatedAt !== note.createdAt && (
                                <>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-xs text-gray-400">
                                        editado {formatDate(note.updatedAt)}
                                    </span>
                                </>
                            )}
                            {noteCategory && (
                                <motion.div
                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        isLightColor(noteCategory.color) ? 'text-gray-700' : 'text-white'
                                    }`}
                                    style={{
                                        backgroundColor: noteCategory.color,
                                        boxShadow: `0 2px 8px -2px ${noteCategory.color}50`
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {noteCategory.name}
                                </motion.div>
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
                        className={`p-2 rounded-lg self-start ${
                            note.isFavorite
                                ? 'text-amber-400'
                                : 'text-gray-300 hover:text-amber-400'
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
                            height: isExpanded ? "auto" : needsExpansion ? "3rem" : "auto"
                        }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        style={{
                            overflow: isExpanded ? "visible" : "hidden"
                        }}
                        className={needsExpansion ? 'mb-3' : 'mb-4'}
                    >
                        <p
                            ref={contentRef}
                            className={`text-gray-600 leading-relaxed whitespace-pre-wrap text-sm ${
                                (!isExpanded && needsExpansion) ? 'line-clamp-2' : ''
                            }`}
                        >
                            {note.content}
                        </p>
                    </motion.div>
                )}

                {/* Botones de acción */}
                {!selectionMode.isActive && (
                    <div className="flex items-center gap-4 pt-2 border-t border-gray-100/80">
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit(note)
                            }}
                            className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm transition-colors"
                            whileTap={{ scale: 0.95 }}
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Editar</span>
                        </motion.button>

                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowDeleteConfirm(true)
                            }}
                            className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 text-sm transition-colors"
                            whileTap={{ scale: 0.95 }}
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Eliminar</span>
                        </motion.button>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Eliminar nota"
                message="¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                onConfirm={() => {
                    onDelete(note.id)
                    setShowDeleteConfirm(false)
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
            </motion.article>
        </div>
    )
}
