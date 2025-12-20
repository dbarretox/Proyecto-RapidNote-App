import { useState, useEffect, useCallback } from 'react'
import type { Note } from '@/types'

const STORAGE_KEY = 'notes'

export function useNotesStorage() {
    const [notes, setNotes] = useState<Note[]>([])
    const [isReady, setIsReady] = useState(false)

    // Cargar notas desde localStorage al iniciar
    useEffect(() => {
        const storedNotes = localStorage.getItem(STORAGE_KEY)
        if (storedNotes) {
            try {
                const parsed = JSON.parse(storedNotes)
                // Migrar notas antiguas que no tengan timestamps
                const migratedNotes = Array.isArray(parsed) ? parsed.map((note: Note) => ({
                    ...note,
                    createdAt: note.createdAt || parseInt(note.id),
                    updatedAt: note.updatedAt || parseInt(note.id)
                })) : []
                setNotes(migratedNotes)
            } catch {
                console.error('Error al parsear notes desde localStorage')
            }
        }
        setIsReady(true)
    }, [])

    // Persistir notas en localStorage cuando cambian
    useEffect(() => {
        if (isReady) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
        }
    }, [notes, isReady])

    const addNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = Date.now()
        const newNote: Note = {
            ...noteData,
            id: now.toString(),
            createdAt: now,
            updatedAt: now
        }
        setNotes(prev => [newNote, ...prev])
    }, [])

    const updateNote = useCallback((id: string, updates: Partial<Note>) => {
        setNotes(prev => prev.map(note =>
            note.id === id
                ? { ...note, ...updates, updatedAt: Date.now() }
                : note
        ))
    }, [])

    const deleteNote = useCallback((id: string) => {
        setNotes(prev => prev.filter(note => note.id !== id))
    }, [])

    const deleteMultiple = useCallback((ids: string[]) => {
        setNotes(prev => prev.filter(note => !ids.includes(note.id)))
    }, [])

    const toggleFavorite = useCallback((id: string) => {
        setNotes(prev => prev.map(note =>
            note.id === id
                ? { ...note, isFavorite: !note.isFavorite, updatedAt: Date.now() }
                : note
        ))
    }, [])

    const restoreNotes = useCallback((notesToRestore: Note[]) => {
        setNotes(prev => [...notesToRestore, ...prev])
    }, [])

    return {
        notes,
        isReady,
        addNote,
        updateNote,
        deleteNote,
        deleteMultiple,
        toggleFavorite,
        restoreNotes
    }
}
