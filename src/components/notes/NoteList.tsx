import { motion, AnimatePresence } from "framer-motion"
import type { Category, Note, SelectionMode } from "@/types"
import NoteCard from "./NoteCard"
import { Trash2, X, CircleCheck } from "lucide-react"

type Props = {
    notes: Note[]
    totalNotes: number
    searchTerm: string
    onDelete: (id: string) => void
    onEdit: (note: Note) => void
    onToggleFavorite: (id: string) => void
    selectionMode: SelectionMode
    onToggleSelection: (id: string) => void
    onDeleteSelected: () => void
    onCancelSelection: () => void
    onSelectAll: () => void
    categories: Category[]
}

export default function NoteList({
    notes,
    totalNotes,
    searchTerm,
    onDelete,
    onEdit,
    onToggleFavorite,
    selectionMode,
    onToggleSelection,
    onDeleteSelected,
    onCancelSelection,
    onSelectAll,
    categories
}: Props) {
    // Mensaje cuando no hay notas
    if (notes.length === 0) {
        return (
            <p className="text-center text-gray-500 mt-4">
                {totalNotes === 0
                    ? "No hay notas guardadas"
                    : `No se encontraron resultados para "${searchTerm}"`}
            </p>
        )
    }

    const selectedCount = selectionMode.selectedIds.size
    const allSelected = selectedCount === notes.length

    return (
        <div className="mt-6 space-y-3">
            {/* Barra de selección múltiple */}
            <AnimatePresence>
                {selectionMode.isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="sticky top-20 z-30 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CircleCheck className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium text-gray-700">
                                        {selectedCount === 0
                                            ? 'Seleccionar notas'
                                            : `${selectedCount} de ${notes.length}`
                                        }
                                    </span>
                                </div>
                                <motion.button
                                    onClick={onCancelSelection}
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>
                        
                            <div className="flex items-center justify-center gap-3">
                                <motion.button
                                    onClick={onSelectAll}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm ${selectedCount > 0
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-600 text-white hover:bg-gray-700'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <CircleCheck className="w-4 h-4" />
                                    {allSelected ? 'Deseleccionar' : 'Todas'}
                                </motion.button>

                                {selectedCount > 0 && (
                                    <motion.button
                                        onClick={onDeleteSelected}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors shadow-sm"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </motion.button>
                                )}
                            </div>
                            {/*
                            {selectedCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-3 text-xs text-blue-600"
                                >
                                    💡 Mantén presionado para seleccionar más notas
                                </motion.div>
                            )} */}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lista de notas */}
            <AnimatePresence>
                {notes.map((note) => (
                    <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <NoteCard
                            note={note}
                            categories={categories}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onToggleFavorite={onToggleFavorite}
                            selectionMode={selectionMode}
                            onToggleSelection={onToggleSelection}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Ayuda para gestos
            {notes.length > 0 && !selectionMode.isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center text-xs text-gray-400 py-4"
                >
                    p>🖱️ Mantén presionado para selección múltiple</p> 
                </motion.div> 
            )}*/}
        </div>
    )
}