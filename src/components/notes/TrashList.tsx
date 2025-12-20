import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, AlertTriangle } from 'lucide-react'
import { TrashNoteCard } from './TrashNoteCard'
import { ConfirmDialog } from '@/components/ui'
import type { Note } from '@/types'

interface TrashListProps {
    notes: Note[]
    onRestore: (id: string) => void
    onDelete: (id: string) => void
    onEmptyTrash: () => void
}

export function TrashList({ notes, onRestore, onDelete, onEmptyTrash }: TrashListProps) {
    const [showEmptyConfirm, setShowEmptyConfirm] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

    const handleEmptyTrash = () => {
        onEmptyTrash()
        setShowEmptyConfirm(false)
    }

    const handlePermanentDelete = () => {
        if (showDeleteConfirm) {
            onDelete(showDeleteConfirm)
            setShowDeleteConfirm(null)
        }
    }

    if (notes.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Papelera vacía</h3>
                <p className="text-gray-500">Las notas eliminadas aparecerán aquí</p>
            </motion.div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-sm">
                            Las notas se eliminan automáticamente después de 30 días
                        </span>
                    </div>
                </div>

                <motion.button
                    onClick={() => setShowEmptyConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <Trash2 className="w-4 h-4" />
                    Vaciar papelera ({notes.length} nota{notes.length !== 1 ? 's' : ''})
                </motion.button>

                <AnimatePresence mode="popLayout">
                    {notes.map(note => (
                        <TrashNoteCard
                            key={note.id}
                            note={note}
                            onRestore={() => onRestore(note.id)}
                            onDelete={() => setShowDeleteConfirm(note.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            <ConfirmDialog
                isOpen={showEmptyConfirm}
                title="Vaciar papelera"
                message={`¿Estás seguro de que quieres eliminar permanentemente ${notes.length} nota${notes.length !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`}
                confirmText="Vaciar papelera"
                cancelText="Cancelar"
                variant="danger"
                onConfirm={handleEmptyTrash}
                onCancel={() => setShowEmptyConfirm(false)}
            />

            <ConfirmDialog
                isOpen={showDeleteConfirm !== null}
                title="Eliminar permanentemente"
                message="¿Estás seguro de que quieres eliminar esta nota permanentemente? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                onConfirm={handlePermanentDelete}
                onCancel={() => setShowDeleteConfirm(null)}
            />
        </>
    )
}

export default TrashList
