import type { Note } from "../types"
import { Star, StarOff, Trash2, Pencil, MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

type Props = {
    note: Note
    onDelete: (id: string) => void
    onEdit: (note: Note) => void
    onToggleFavorite: (id: string) => void
}

export default function NoteCard({ note, onDelete, onEdit, onToggleFavorite }: Props) {
    const [showActions, setShowActions] = useState(false)

    return (
        <motion.div
            className={`relative rounded-xl shadow-sm border transition-all duration-200 ${
                note.isFavorite 
                    ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50" 
                    : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            layout
        >
            {/* Header con favorito */}
            <div className="flex items-start justify-between p-4 pb-2">
                <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-gray-900 mb-1 leading-tight ${
                        note.title ? 'text-lg' : 'text-base italic text-gray-500'
                    }`}>
                        {note.title || 'Sin título'}
                    </h3>
                </div>
                
                {/* Botón de favorito prominente */}
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(note.id)
                    }}
                    className={`p-2 rounded-full transition-colors ${
                        note.isFavorite 
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
            </div>

            {/* Contenido */}
            <div className="px-4 pb-4">
                {note.content && (
                    <p className="text-gray-700 leading-relaxed line-clamp-3 mb-4">
                        {note.content}
                    </p>
                )}

                {/* Botones de acción móvil */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Botón de edición principal */}
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

                        {note.isFavorite && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"
                            >
                                ⭐ Favorita
                            </motion.div>
                        )}
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

                        {/* Menú desplegable */}
                        <AnimatePresence>
                            {showActions && (
                                <>
                                    {/* Overlay para cerrar */}
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
                                                    <StarOff className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">Quitar favorito</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">Marcar favorito</span>
                                                </>
                                            )}
                                        </button>
                                        
                                        <div className="border-t border-gray-100 my-1" />
                                        
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onDelete(note.id)
                                                setShowActions(false)
                                            }}
                                            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 flex-shrink-0" />
                                            <span className="whitespace-nowrap">Eliminar</span>
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Indicador visual de favorito */}
            {note.isFavorite && (
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-amber-500 rounded-l-xl" />
            )}
        </motion.div>
    )
}