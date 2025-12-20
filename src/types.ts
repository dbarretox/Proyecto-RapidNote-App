export interface Note {
    id: string
    title: string
    content: string
    isFavorite: boolean
    createdAt?: number
    updatedAt?: number
    categoryId?: string | null
}

export interface SelectionMode {
    isActive: boolean
    selectedIds: Set<string>
}

export interface Category {
    id: string
    name: string
    color: string
    createdAt: number
}

export interface ConfirmDialogProps {
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void
    variant?: 'danger' | 'warning'
}

// Tipos para ordenamiento
export type SortBy = 'date' | 'favorite' | 'updated'
export type SortOrder = 'asc' | 'desc'

// Tipo para las pestañas
export type ActiveTab = 'notes' | 'search' | 'add' | 'categories'

// Tipo para el contexto de notas
export interface NotesContextType {
    // Estado
    notes: Note[]
    categories: Category[]
    isReady: boolean
    selectedIds: Set<string>
    isSelectionMode: boolean
    searchQuery: string
    sortBy: SortBy
    sortOrder: SortOrder
    activeCategory: string | null
    showOnlyFavorites: boolean
    filteredNotes: Note[]

    // Acciones notas
    addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateNote: (id: string, updates: Partial<Note>) => void
    deleteNote: (id: string) => void
    deleteMultiple: (ids: string[]) => void
    toggleFavorite: (id: string) => void

    // Acciones categorías
    addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void
    updateCategory: (id: string, updates: Partial<Category>) => void
    deleteCategory: (id: string) => void

    // Acciones selección
    toggleSelection: (id: string) => void
    selectAll: (noteIds: string[]) => void
    clearSelection: () => void
    enterSelectionMode: (initialId?: string) => void
    exitSelectionMode: () => void

    // Acciones filtros
    setSearchQuery: (query: string) => void
    setSortBy: (sortBy: SortBy) => void
    setSortOrder: (order: SortOrder) => void
    setActiveCategory: (categoryId: string | null) => void
    setShowOnlyFavorites: (show: boolean) => void
}

// Tipos para el sistema de Toasts
export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

export interface ToastContextType {
    toasts: Toast[]
    showToast: (message: string, type?: ToastType, duration?: number) => void
    dismissToast: (id: string) => void
}