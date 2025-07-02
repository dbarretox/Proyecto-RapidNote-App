import { motion } from "framer-motion"
import { Save, Plus, Type, FileText } from "lucide-react"
import { useRef, useEffect } from "react"

type Props = {
    title: string
    setTitle: (value: string) => void
    content: string
    setContent: (value: string) => void
    editingId: string | null
    onSave: () => void
}

export default function NoteForm({ title, setTitle, content, setContent, editingId, onSave }: Props) {
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
            textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`
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
            // Mostrar feedback visual o toast aquí si quieres
            return
        }
        onSave()
    }

    const isDisabled = !title.trim() && !content.trim()

    return (
        <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Input de título */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Type className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    ref={titleRef}
                    type="text"
                    placeholder="Título de la nota"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-12 pr-4 py-4 text-lg font-medium border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-0 outline-none transition-colors placeholder-gray-400"
                    autoComplete="off"
                />
            </div>

            {/* Textarea de contenido */}
            <div className="relative">
                <div className="absolute left-3 top-4 pointer-events-none">
                    <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                    ref={contentRef}
                    placeholder="Escribe tu nota aquí..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-12 pr-4 py-4 text-base leading-relaxed border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-0 outline-none transition-colors placeholder-gray-400 resize-none min-h-[120px]"
                    rows={4}
                />
            </div>

            {/* Contador de caracteres */}
            <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex gap-4">
                    {title.length > 0 && (
                        <span>Título: {title.length} caracteres</span>
                    )}
                    {content.length > 0 && (
                        <span>Contenido: {content.length} caracteres</span>
                    )}
                </div>
            </div>

            {/* Botón de guardar */}
            <motion.button
                onClick={handleSave}
                disabled={isDisabled}
                className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-3 transition-all ${
                    isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl'
                }`}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
                className="text-center text-xs text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter para guardar rápido
            </motion.div>

            {/* Mensaje de estado */}
            {isDisabled && (title.length > 0 || content.length > 0) && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center text-sm text-gray-500 bg-gray-50 py-3 px-4 rounded-xl"
                >
                    ✍️ Sigue escribiendo para poder guardar la nota
                </motion.div>
            )}
        </motion.div>
    )
}