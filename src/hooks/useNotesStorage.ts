import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Note } from '@/types'

const STORAGE_KEY = 'notes'
const TRASH_RETENTION_DAYS = 30

export function useNotesStorage() {
    const [allNotes, setAllNotes] = useState<Note[]>([])
    const [isReady, setIsReady] = useState(false)

    // Cargar notas desde localStorage al iniciar y limpiar notas expiradas
    useEffect(() => {
        const storedNotes = localStorage.getItem(STORAGE_KEY)
        if (storedNotes) {
            try {
                const parsed = JSON.parse(storedNotes)
                // Migrar notas antiguas que no tengan timestamps
                const migratedNotes = Array.isArray(parsed) ? parsed.map((note: Note) => ({
                    ...note,
                    createdAt: note.createdAt || parseInt(note.id),
                    updatedAt: note.updatedAt || parseInt(note.id),
                    deletedAt: note.deletedAt || null
                })) : []

                // Auto-limpiar notas que llevan más de 30 días en la papelera
                const thirtyDaysAgo = Date.now() - (TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000)
                const cleanedNotes = migratedNotes.filter((note: Note) =>
                    !note.deletedAt || note.deletedAt > thirtyDaysAgo
                )

                setAllNotes(cleanedNotes)
            } catch {
                console.error('Error al parsear notes desde localStorage')
            }
        }
        setIsReady(true)
    }, [])

    // Persistir notas en localStorage cuando cambian
    useEffect(() => {
        if (isReady) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotes))
        }
    }, [allNotes, isReady])

    // Notas activas (no eliminadas)
    const notes = useMemo(() =>
        allNotes.filter(note => !note.deletedAt),
        [allNotes]
    )

    // Notas en papelera
    const trashNotes = useMemo(() =>
        allNotes.filter(note => note.deletedAt),
        [allNotes]
    )

    const addNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = Date.now()
        const newNote: Note = {
            ...noteData,
            id: now.toString(),
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        }
        setAllNotes(prev => [newNote, ...prev])
    }, [])

    const updateNote = useCallback((id: string, updates: Partial<Note>) => {
        setAllNotes(prev => prev.map(note =>
            note.id === id
                ? { ...note, ...updates, updatedAt: Date.now() }
                : note
        ))
    }, [])

    // Soft delete: mover a papelera
    const deleteNote = useCallback((id: string) => {
        setAllNotes(prev => prev.map(note =>
            note.id === id
                ? { ...note, deletedAt: Date.now() }
                : note
        ))
    }, [])

    // Soft delete múltiple
    const deleteMultiple = useCallback((ids: string[]) => {
        const now = Date.now()
        setAllNotes(prev => prev.map(note =>
            ids.includes(note.id)
                ? { ...note, deletedAt: now }
                : note
        ))
    }, [])

    const toggleFavorite = useCallback((id: string) => {
        setAllNotes(prev => prev.map(note =>
            note.id === id
                ? { ...note, isFavorite: !note.isFavorite, updatedAt: Date.now() }
                : note
        ))
    }, [])

    // Restaurar nota de la papelera (para undo inmediato)
    const restoreNotes = useCallback((notesToRestore: Note[]) => {
        const idsToRestore = notesToRestore.map(n => n.id)
        setAllNotes(prev => prev.map(note =>
            idsToRestore.includes(note.id)
                ? { ...note, deletedAt: null }
                : note
        ))
    }, [])

    // Restaurar una nota de la papelera
    const restoreFromTrash = useCallback((id: string) => {
        setAllNotes(prev => prev.map(note =>
            note.id === id
                ? { ...note, deletedAt: null }
                : note
        ))
    }, [])

    // Eliminar permanentemente
    const permanentlyDelete = useCallback((id: string) => {
        setAllNotes(prev => prev.filter(note => note.id !== id))
    }, [])

    // Vaciar papelera
    const emptyTrash = useCallback(() => {
        setAllNotes(prev => prev.filter(note => !note.deletedAt))
    }, [])

    return {
        notes,
        trashNotes,
        isReady,
        addNote,
        updateNote,
        deleteNote,
        deleteMultiple,
        toggleFavorite,
        restoreNotes,
        restoreFromTrash,
        permanentlyDelete,
        emptyTrash
    }
}
