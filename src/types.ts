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