import { motion } from 'framer-motion'
import { RotateCcw, Trash2, Clock } from 'lucide-react'
import type { Note } from '@/types'

interface TrashNoteCardProps {
    note: Note
    onRestore: () => void
    onDelete: () => void
}

const TRASH_RETENTION_DAYS = 30

function getDaysUntilDeletion(deletedAt: number): number {
    const expirationDate = deletedAt + (TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000)
    const now = Date.now()
    const daysLeft = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24))
    return Math.max(0, daysLeft)
}

function formatDeletedDate(deletedAt: number): string {
    const date = new Date(deletedAt)
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function TrashNoteCard({ note, onRestore, onDelete }: TrashNoteCardProps) {
    const daysLeft = note.deletedAt ? getDaysUntilDeletion(note.deletedAt) : 0
    const deletedDate = note.deletedAt ? formatDeletedDate(note.deletedAt) : ''

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                            {note.title || 'Sin título'}
                        </h3>
                        {note.content && (
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {note.content}
                            </p>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>Eliminada {deletedDate}</span>
                            <span className="text-red-500 font-medium">
                                ({daysLeft} día{daysLeft !== 1 ? 's' : ''} restante{daysLeft !== 1 ? 's' : ''})
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <motion.button
                        onClick={onRestore}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <RotateCcw className="w-4 h-4" />
                        Restaurar
                    </motion.button>
                    <motion.button
                        onClick={onDelete}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default TrashNoteCard
