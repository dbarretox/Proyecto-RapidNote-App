import type { Note } from "../types"
import { Star, StarOff, Trash2, Pencil } from "lucide-react"
import { motion } from "framer-motion"

type Props = {
    note: Note
    onDelete: (id: string) => void
    onEdit: (note: Note) => void
    onToggleFavorite: (id: string) => void
}


export default function NoteCard({ note, onDelete, onEdit, onToggleFavorite }: Props) {
    return (
        <motion.div
            className={`relative p-4 rounded shadow border-l-4 ${
                note.isFavorite ? "border-yellow-400 bg-yellow-50" : "border-blue-500 bg-white"
            }`}
            whileHover={{ scale: 1.02, boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)" }}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {note.isFavorite && (
                <Star
                    className="absolute top-2 right-2 text-yellow-500 w-5 h-5"
                    fill="currentColor"
                />
            )}

            <h2 className="text-lg font-semibold text-gray-800">{note.title}</h2>
            <p className="text-gray-600 mb-2">{note.content}</p>

            <div className="flex gap-4 text-sm mt-2">
                <button
                    onClick={() => onDelete(note.id)}
                    className="text-red-500 hover:underline flex item-center"
                >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                </button>

                <button
                    onClick={() => onEdit(note)}
                    className="text-blue-500 hover:underline flex item-center"
                >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                </button>

                <button
                    onClick={() => onToggleFavorite(note.id)}
                    className={`text-yellow-500 hover:underline flex items-center ${note.isFavorite ? "font-bold" : ""
                        }`}
                >
                    {note.isFavorite ? (
                        <>
                            <Star className="w-4 h-4 mr-1" fill="currentColor" />
                            Favorita
                        </>
                    ) : (
                        <>
                            <StarOff className="w-4 h-4 mr-1" />
                            Favorito
                        </>

                    )}
                </button>
            </div>
        </motion.div>
    )
}
