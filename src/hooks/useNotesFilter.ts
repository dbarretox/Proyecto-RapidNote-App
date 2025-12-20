import { useState, useMemo, useCallback, useEffect } from 'react'
import type { Note, SortBy, SortOrder } from '@/types'

const CATEGORY_STORAGE_KEY = 'selectedCategoryId'
const FAVORITES_STORAGE_KEY = 'showOnlyFavorites'

interface UseNotesFilterProps {
    notes: Note[]
}

export function useNotesFilter({ notes }: UseNotesFilterProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortBy>('date')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

    // Cargar preferencias desde localStorage
    useEffect(() => {
        const storedCategory = localStorage.getItem(CATEGORY_STORAGE_KEY)
        if (storedCategory && storedCategory !== 'null') {
            setActiveCategory(storedCategory)
        }

        const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
        if (storedFavorites === 'true') {
            setShowOnlyFavorites(true)
        }
    }, [])

    // Persistir categoría seleccionada
    useEffect(() => {
        localStorage.setItem(CATEGORY_STORAGE_KEY, activeCategory || 'null')
    }, [activeCategory])

    // Persistir preferencia de favoritos
    useEffect(() => {
        localStorage.setItem(FAVORITES_STORAGE_KEY, String(showOnlyFavorites))
    }, [showOnlyFavorites])

    // Filtrar y ordenar notas (memoizado)
    const filteredNotes = useMemo(() => {
        // Primero filtrar
        const filtered = notes.filter(note => {
            const matchesSearch =
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesCategory = activeCategory
                ? note.categoryId === activeCategory
                : true

            const matchesFavorites = showOnlyFavorites ? note.isFavorite : true

            return matchesSearch && matchesCategory && matchesFavorites
        })

        // Luego ordenar
        return [...filtered].sort((a, b) => {
            if (sortBy === 'favorite') {
                return sortOrder === 'asc'
                    ? Number(a.isFavorite) - Number(b.isFavorite)
                    : Number(b.isFavorite) - Number(a.isFavorite)
            }

            if (sortBy === 'updated') {
                const dateA = a.updatedAt || a.createdAt || parseInt(a.id)
                const dateB = b.updatedAt || b.createdAt || parseInt(b.id)
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
            }

            // Default: ordenar por fecha de creación
            const dateA = a.createdAt || parseInt(a.id)
            const dateB = b.createdAt || parseInt(b.id)
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
        })
    }, [notes, searchQuery, sortBy, sortOrder, activeCategory, showOnlyFavorites])

    const handleSetSearchQuery = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])

    const handleSetSortBy = useCallback((sort: SortBy) => {
        setSortBy(sort)
    }, [])

    const handleSetSortOrder = useCallback((order: SortOrder) => {
        setSortOrder(order)
    }, [])

    const handleSetActiveCategory = useCallback((categoryId: string | null) => {
        setActiveCategory(categoryId)
    }, [])

    const handleSetShowOnlyFavorites = useCallback((show: boolean) => {
        setShowOnlyFavorites(show)
    }, [])

    return {
        searchQuery,
        sortBy,
        sortOrder,
        activeCategory,
        showOnlyFavorites,
        filteredNotes,
        setSearchQuery: handleSetSearchQuery,
        setSortBy: handleSetSortBy,
        setSortOrder: handleSetSortOrder,
        setActiveCategory: handleSetActiveCategory,
        setShowOnlyFavorites: handleSetShowOnlyFavorites
    }
}
