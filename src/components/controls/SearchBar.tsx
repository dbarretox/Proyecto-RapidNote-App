import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useEffect } from "react"

type Props = {
    searchTerm: string
    setSearchTerm: (value: string) => void
}

export default function SearchBar({ searchTerm, setSearchTerm }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-focus cuando se monta el componente (útil en la pestaña de búsqueda)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }, 300) // Pequeño delay para que termine la animación de transición

        return () => clearTimeout(timer)
    }, [])

    const clearSearch = () => {
        setSearchTerm("")
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Limpiar con Escape
        if (e.key === 'Escape') {
            clearSearch()
        }
    }

    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Icono de búsqueda */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
            </div>

            {/* Input de búsqueda */}
            <input
                ref={inputRef}
                type="text"
                placeholder="Buscar en tus notas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-12 py-4 text-base border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200 placeholder-gray-400"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
            />

            {/* Botón de limpiar */}
            <AnimatePresence>
                {searchTerm && (
                    <motion.button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Indicador de resultados */}
            {searchTerm && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2"
                >
                    <div className="text-xs text-gray-500 px-2">
                        🔍 Buscando: "<span className="font-medium text-gray-700">{searchTerm}</span>"
                    </div>
                </motion.div>
            )}

            {/* Consejos de búsqueda */}
            {!searchTerm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-full left-0 right-0 mt-2"
                >
                    <div className="text-xs text-gray-400 px-2">
                        💡 Busca por título o contenido • Presiona Esc para limpiar
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}