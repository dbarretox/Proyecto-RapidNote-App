import { useState, useCallback } from 'react'

export function useSelection() {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isSelectionMode, setIsSelectionMode] = useState(false)

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }, [])

    const selectAll = useCallback((noteIds: string[]) => {
        setSelectedIds(prev => {
            // Si ya están todas seleccionadas, deseleccionar
            if (prev.size === noteIds.length) {
                return new Set()
            }
            // Sino, seleccionar todas
            return new Set(noteIds)
        })
    }, [])

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set())
    }, [])

    const enterSelectionMode = useCallback((initialId?: string) => {
        setIsSelectionMode(true)
        if (initialId) {
            setSelectedIds(new Set([initialId]))
        } else {
            setSelectedIds(new Set())
        }
    }, [])

    const exitSelectionMode = useCallback(() => {
        setIsSelectionMode(false)
        setSelectedIds(new Set())
    }, [])

    return {
        selectedIds,
        isSelectionMode,
        toggleSelection,
        selectAll,
        clearSelection,
        enterSelectionMode,
        exitSelectionMode
    }
}
