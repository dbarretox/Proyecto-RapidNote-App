import { Button } from "../ui"
import { InstallPrompt } from "../install"
import { X, CheckSquare } from "lucide-react"
import type { SelectionMode, ActiveTab } from "@/types"

interface HeaderProps {
    notes: Array<{ id: string }>
    selectionMode: SelectionMode
    activeTab: ActiveTab
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
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xl">📒</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">RapidNote</h1>
                        {notes.length > 0 && (
                            <p className="text-xs text-gray-500">
                                {notes.length} nota{notes.length !== 1 ? 's' : ''}
                                {selectionMode.isActive && selectionMode.selectedIds.size > 0 &&
                                    ` • ${selectionMode.selectedIds.size} seleccionada${selectionMode.selectedIds.size !== 1 ? 's' : ''}`
                                }
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {notes.length > 0 && activeTab === 'notes' && (
                        <Button
                            variant="toggle"
                            isActive={selectionMode.isActive}
                            onClick={selectionMode.isActive ? onCancelSelection : onToggleSelection}
                        >
                            {selectionMode.isActive ? <X className="w-5 h-5" /> : <CheckSquare className="w-5 h-5" />}
                        </Button>
                    )}

                    <InstallPrompt />
                </div>
            </div>
        </div>
    )
}