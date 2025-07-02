import { ArrowDownWideNarrow, ArrowUpNarrowWide, Calendar, Star, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

type Props = {
    sortBy: "date" | "favorite"
    setSortBy: (value: "date" | "favorite") => void
    sortOrder: "asc" | "desc"
    setSortOrder: (value: "asc" | "desc") => void
}

export default function SortControls({ sortBy, setSortBy, sortOrder, setSortOrder }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    
    const sortOptions = [
        { value: "date", label: "Fecha", icon: Calendar },
        { value: "favorite", label: "Favoritas", icon: Star }
    ] as const

    const currentSort = sortOptions.find(option => option.value === sortBy)
    const CurrentIcon = currentSort?.icon || Calendar

    return (
        <div className="relative">
            {/* Botón principal compacto */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <CurrentIcon className="w-4 h-4" />
                {sortOrder === "asc" ? (
                    <ArrowUpNarrowWide className="w-4 h-4" />
                ) : (
                    <ArrowDownWideNarrow className="w-4 h-4" />
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Dropdown menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop para cerrar */}
                        <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setIsOpen(false)}
                        />
                        
                        {/* Menu desplegable */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20"
                        >
                            {/* Opciones de ordenamiento */}
                            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Ordenar por
                            </div>
                            
                            {sortOptions.map((option) => {
                                const Icon = option.icon
                                const isActive = sortBy === option.value
                                
                                return (
                                    <motion.button
                                        key={option.value}
                                        onClick={() => {
                                            setSortBy(option.value)
                                            setIsOpen(false)
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors text-left ${
                                            isActive 
                                                ? 'bg-blue-50 text-blue-600' 
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                        whileHover={{ x: 2 }}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{option.label}</span>
                                        {isActive && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                                            />
                                        )}
                                    </motion.button>
                                )
                            })}

                            <div className="border-t border-gray-100 mt-2 pt-2">
                                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Orden
                                </div>
                                
                                {/* Opciones de orden */}
                                <motion.button
                                    onClick={() => {
                                        setSortOrder("desc")
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors text-left ${
                                        sortOrder === "desc" 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    whileHover={{ x: 2 }}
                                >
                                    <ArrowDownWideNarrow className="w-4 h-4" />
                                    <span>Descendente</span>
                                    {sortOrder === "desc" && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                                        />
                                    )}
                                </motion.button>

                                <motion.button
                                    onClick={() => {
                                        setSortOrder("asc")
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors text-left ${
                                        sortOrder === "asc" 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    whileHover={{ x: 2 }}
                                >
                                    <ArrowUpNarrowWide className="w-4 h-4" />
                                    <span>Ascendente</span>
                                    {sortOrder === "asc" && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                                        />
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}