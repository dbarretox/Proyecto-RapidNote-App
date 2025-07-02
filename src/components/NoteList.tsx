import { motion, AnimatePresence } from "framer-motion"
import type { Note } from "../types"
import NoteCard from "./NoteCard"

type Props = {
    notes: Note[]
    totalNotes: number
    searchTerm: string
    onDelete: (id: string) => void
    onEdit: (note: Note) => void
    onToggleFavorite: (id: string) => void
}

export default function NoteList({ notes, totalNotes, searchTerm, onDelete, onEdit, onToggleFavorite }: Props) {
    if (notes.length === 0) {
        if (totalNotes === 0) {
            return (
                <p className="text-center text-gray-500 mt-4">
                    No hay notas guardadas
                </p>
            )
        }
        return (
            <p className="text-center text-gray-500 mt-4">
                No se encontraron resultados para “<i>{searchTerm}</i>”
            </p>
        )
    }


    return (
        <div className="mt-6 space-y-4">
            <AnimatePresence>
                {notes.map((note) => (
                    <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <NoteCard
                            note={note}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onToggleFavorite={onToggleFavorite}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}