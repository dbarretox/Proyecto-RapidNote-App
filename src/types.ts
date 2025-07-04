export interface Note {
    id: string
    title: string
    content: string
    isFavorite: boolean
    createdAt?: number
    updatedAt?: number
}

export interface SelectionMode {
    isActive: boolean
    selectedIds: Set<string>
}