import { Search, X, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useEffect } from "react"

type Props = {
    searchTerm: string
    setSearchTerm: (value: string) => void
}

export default function SearchBar({ searchTerm, setSearchTerm }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-focus cuando se monta el componente
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    const clearSearch = () => {
        setSearchTerm("")
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
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
            {/* Icono de búsqueda con animación */}
            <motion.div
                className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                animate={{
                    scale: searchTerm ? 1.1 : 1,
                    color: searchTerm ? "#3b82f6" : "#9ca3af"
                }}
                transition={{ duration: 0.2 }}
            >
                <Search className="w-5 h-5" />
            </motion.div>

            {/* Input de búsqueda */}
            <input
                ref={inputRef}
                type="text"
                placeholder="Buscar en tus notas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-12 py-4 text-base bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 placeholder-gray-400 shadow-sm hover:border-gray-200"
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
                        initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Indicador de búsqueda activa */}
            <AnimatePresence>
                {searchTerm && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 right-0 mt-3"
                    >
                        <div className="flex items-center gap-2 text-sm text-gray-500 px-2">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-4 h-4 text-blue-500" />
                            </motion.div>
                            <span>
                                Buscando: "<span className="font-semibold text-blue-600">{searchTerm}</span>"
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Consejos de búsqueda */}
            <AnimatePresence>
                {!searchTerm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-full left-0 right-0 mt-3"
                    >
                        <div className="text-xs text-gray-400 px-2 flex items-center gap-2">
                            <span className="bg-gray-100 px-2 py-1 rounded-lg font-medium">Tip</span>
                            <span>Busca por título o contenido • Presiona Esc para limpiar</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
