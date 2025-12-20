import { useState, useEffect, useCallback } from 'react'
import type { Category } from '@/types'

const STORAGE_KEY = 'categories'

export function useCategoriesStorage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isReady, setIsReady] = useState(false)

    // Cargar categorías desde localStorage al iniciar
    useEffect(() => {
        const storedCategories = localStorage.getItem(STORAGE_KEY)
        if (storedCategories) {
            try {
                const parsed = JSON.parse(storedCategories)
                setCategories(Array.isArray(parsed) ? parsed : [])
            } catch {
                console.error('Error al parsear categories desde localStorage')
            }
        }
        setIsReady(true)
    }, [])

    // Persistir categorías en localStorage cuando cambian
    useEffect(() => {
        if (isReady) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
        }
    }, [categories, isReady])

    const addCategory = useCallback((categoryData: Omit<Category, 'id' | 'createdAt'>) => {
        const now = Date.now()
        const newCategory: Category = {
            ...categoryData,
            id: now.toString(),
            createdAt: now
        }
        setCategories(prev => [...prev, newCategory])
    }, [])

    const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
        setCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, ...updates } : cat
        ))
    }, [])

    const deleteCategory = useCallback((id: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== id))
    }, [])

    return {
        categories,
        isReady,
        addCategory,
        updateCategory,
        deleteCategory
    }
}
