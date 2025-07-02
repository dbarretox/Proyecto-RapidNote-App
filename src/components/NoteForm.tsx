type Props = {
    title: string
    setTitle: (value: string) => void
    content: string
    setContent: (value: string) => void
    editingId: string | null
    onSave: () => void
}

export default function NoteForm({ title, setTitle, content, setContent, editingId, onSave }: Props) {
    return (
        <div className="space-y-2">
            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
            />

            <textarea
                placeholder="Contenido"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded h-24"
            />

            <button
                onClick={onSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                {editingId ? "Actualizar nota" : "Guardar nota"}
            </button>
        </div>
    )
}