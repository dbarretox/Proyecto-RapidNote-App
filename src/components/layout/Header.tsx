import { Button } from "../ui"
import { InstallPrompt } from "../install"
import { X, CheckSquare, StickyNote } from "lucide-react"
import { motion } from "framer-motion"
import type { SelectionMode } from "@/types"

interface HeaderProps {
    notes: Array<{ id: string }>
    selectionMode: SelectionMode
    activeTab: 'notes' | 'search' | 'add' | 'categories'
    onToggleSelection: () => void
    onCancelSelection: () => void
}

export default function Header({
    notes,
    selectionMode,
    activeTab,
    onToggleSelection,
    onCancelSelection
}: HeaderProps) {
    return (
        <motion.header
            className="bg-white border-b border-gray-100 sticky top-0 z-40 safe-area-top"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="px-4 py-3">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    {/* Logo y título */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                            <StickyNote className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">RapidNote</h1>
                            {notes.length > 0 && (
                                <p className="text-xs text-gray-500">
                                    {notes.length} nota{notes.length !== 1 ? 's' : ''}
                                    {selectionMode.isActive && selectionMode.selectedIds.size > 0 && (
                                        <span className="text-blue-600 font-medium">
                                            {' '}• {selectionMode.selectedIds.size} seleccionada{selectionMode.selectedIds.size !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                        {notes.length > 0 && activeTab === 'notes' && (
                            <Button
                                variant="toggle"
                                isActive={selectionMode.isActive}
                                onClick={selectionMode.isActive ? onCancelSelection : onToggleSelection}
                            >
                                {selectionMode.isActive ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <CheckSquare className="w-5 h-5" />
                                )}
                            </Button>
                        )}

                        <InstallPrompt />
                    </div>
                </div>
            </div>
        </motion.header>
    )
}
