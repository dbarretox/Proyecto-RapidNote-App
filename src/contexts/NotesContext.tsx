import { createContext, useContext, useEffect, useCallback, useRef, type ReactNode } from 'react'
import type { NotesContextType, Note } from '@/types'
import { useNotesStorage } from '@/hooks/useNotesStorage'
import { useCategoriesStorage } from '@/hooks/useCategoriesStorage'
import { useSelection } from '@/hooks/useSelection'
import { useNotesFilter } from '@/hooks/useNotesFilter'
import { useToast } from './ToastContext'

const NotesContext = createContext<NotesContextType | null>(null)

const UNDO_DURATION = 5000

interface NotesProviderProps {
    children: ReactNode
}

export function NotesProvider({ children }: NotesProviderProps) {
    const { showToast } = useToast()
    const deletedNotesRef = useRef<Note[]>([])

    // Hooks de almacenamiento
    const notesStorage = useNotesStorage()
    const categoriesStorage = useCategoriesStorage()

    // Hook de selección
    const selection = useSelection()

    // Hook de filtrado (depende de las notas)
    const filter = useNotesFilter({ notes: notesStorage.notes })

    // Wrappers con toasts para acciones de notas
    const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
        notesStorage.addNote(note)
        showToast('Nota creada', 'success')
    }, [notesStorage, showToast])

    const updateNote = useCallback((id: string, updates: Partial<Note>) => {
        notesStorage.updateNote(id, updates)
        showToast('Nota actualizada', 'success')
    }, [notesStorage, showToast])

    const deleteNote = useCallback((id: string) => {
        const noteToDelete = notesStorage.notes.find(n => n.id === id)
        if (!noteToDelete) return

        deletedNotesRef.current = [noteToDelete]
        notesStorage.deleteNote(id)

        showToast('Nota eliminada', 'error', UNDO_DURATION, {
            label: 'Deshacer',
            onClick: () => {
                notesStorage.restoreNotes(deletedNotesRef.current)
                showToast('Nota restaurada', 'success')
            }
        })
    }, [notesStorage, showToast])

    const deleteMultiple = useCallback((ids: string[]) => {
        const notesToDelete = notesStorage.notes.filter(n => ids.includes(n.id))
        if (notesToDelete.length === 0) return

        deletedNotesRef.current = notesToDelete
        notesStorage.deleteMultiple(ids)

        const count = notesToDelete.length
        showToast(
            `${count} nota${count === 1 ? '' : 's'} eliminada${count === 1 ? '' : 's'}`,
            'error',
            UNDO_DURATION,
            {
                label: 'Deshacer',
                onClick: () => {
                    notesStorage.restoreNotes(deletedNotesRef.current)
                    showToast(`${count} nota${count === 1 ? '' : 's'} restaurada${count === 1 ? '' : 's'}`, 'success')
                }
            }
        )
    }, [notesStorage, showToast])

    const toggleFavorite = useCallback((id: string) => {
        const note = notesStorage.notes.find(n => n.id === id)
        notesStorage.toggleFavorite(id)
        if (note) {
            showToast(note.isFavorite ? 'Quitada de favoritos' : 'Añadida a favoritos', 'info')
        }
    }, [notesStorage, showToast])

    // Limpiar categoría activa si se elimina la categoría
    const deleteCategory = useCallback((id: string) => {
        categoriesStorage.deleteCategory(id)
        if (filter.activeCategory === id) {
            filter.setActiveCategory(null)
        }
    }, [categoriesStorage, filter])

    // Configurar long-press para modo selección
    useEffect(() => {
        let pressTimer: ReturnType<typeof setTimeout>
        let targetNoteId: string | null = null

        const handleTouchStart = (e: TouchEvent) => {
            if (selection.isSelectionMode) return

            const target = e.target as HTMLElement
            if (target.closest('button') || target.closest('[role="button"]')) return

            const noteCard = target.closest('.note-card-container')
            if (noteCard) {
                targetNoteId = noteCard.getAttribute('data-note-id')
                if (targetNoteId) {
                    pressTimer = setTimeout(() => {
                        navigator.vibrate?.(50)
                        selection.enterSelectionMode(targetNoteId!)
                    }, 800)
                }
            }
        }

        const handleTouchEnd = () => {
            clearTimeout(pressTimer)
            targetNoteId = null
        }

        document.addEventListener('touchstart', handleTouchStart)
        document.addEventListener('touchend', handleTouchEnd)
        document.addEventListener('touchmove', handleTouchEnd)

        return () => {
            clearTimeout(pressTimer)
            document.removeEventListener('touchstart', handleTouchStart)
            document.removeEventListener('touchend', handleTouchEnd)
            document.removeEventListener('touchmove', handleTouchEnd)
        }
    }, [selection.isSelectionMode, selection.enterSelectionMode])

    // Determinar si está listo (ambos storages cargados)
    const isReady = notesStorage.isReady && categoriesStorage.isReady

    const value: NotesContextType = {
        // Estado
        notes: notesStorage.notes,
        categories: categoriesStorage.categories,
        isReady,
        selectedIds: selection.selectedIds,
        isSelectionMode: selection.isSelectionMode,
        searchQuery: filter.searchQuery,
        sortBy: filter.sortBy,
        sortOrder: filter.sortOrder,
        activeCategory: filter.activeCategory,
        showOnlyFavorites: filter.showOnlyFavorites,
        filteredNotes: filter.filteredNotes,

        // Acciones notas (con toasts)
        addNote,
        updateNote,
        deleteNote,
        deleteMultiple,
        toggleFavorite,

        // Acciones categorías
        addCategory: categoriesStorage.addCategory,
        updateCategory: categoriesStorage.updateCategory,
        deleteCategory,

        // Acciones selección
        toggleSelection: selection.toggleSelection,
        selectAll: selection.selectAll,
        clearSelection: selection.clearSelection,
        enterSelectionMode: selection.enterSelectionMode,
        exitSelectionMode: selection.exitSelectionMode,

        // Acciones filtros
        setSearchQuery: filter.setSearchQuery,
        setSortBy: filter.setSortBy,
        setSortOrder: filter.setSortOrder,
        setActiveCategory: filter.setActiveCategory,
        setShowOnlyFavorites: filter.setShowOnlyFavorites
    }

    return (
        <NotesContext.Provider value={value}>
            {children}
        </NotesContext.Provider>
    )
}

export function useNotes(): NotesContextType {
    const context = useContext(NotesContext)
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider')
    }
    return context
}
