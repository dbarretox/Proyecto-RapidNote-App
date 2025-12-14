import { useState, useEffect } from "react"
import type { Note, SelectionMode, Category } from "@/types"
import { NoteList, NoteForm } from "@/components/notes"
import { SearchBar, SortControls } from "@/components/controls"
import { motion } from "framer-motion"
import { Star, Search, Edit3, FileText, Tag } from "lucide-react"
import { Button, ConfirmDialog } from "@/components/ui"
import { Header, BottomNav } from "@/components/layout"
import { CategorySelector, CategoryForm, CategoryList } from "@/components/categories"
import { UpdatePrompt } from "@/components/pwa"


function App() {

  // Estados de la aplicación
  const [activeTab, setActiveTab] = useState<'notes' | 'search' | 'add' | 'categories'>('notes')
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "favorite" | "updated">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false)

  // Estado para selección múltiple
  const [selectionMode, setSelectionMode] = useState<SelectionMode>({
    isActive: false,
    selectedIds: new Set()
  })

  // Maneja la persistencia de datos de la aplicacion (notas y configuracion)
  useEffect(() => {
    const storedNotes = localStorage.getItem("notes")
    if (storedNotes) {
      try {
        const parsed = JSON.parse(storedNotes)
        const migratedNotes = Array.isArray(parsed) ? parsed.map(note => ({
          ...note,
          createdAt: note.createdAt || parseInt(note.id),
          updatedAt: note.updatedAt || parseInt(note.id)
        })) : []
        setNotes(migratedNotes)
      } catch {
        console.error("Error al parsear notes desde localStorage")
      }
    }

    const storedCategories = localStorage.getItem("categories")
    if (storedCategories) {
      try {
        const parsed = JSON.parse(storedCategories)
        setCategories(Array.isArray(parsed) ? parsed : [])
      } catch {
        console.error("Error al parsear categories desde localStorage")
      }
    }

    const storedSelectedCategory = localStorage.getItem("selectedCategoryId")
    if (storedSelectedCategory && storedSelectedCategory !== "null") {
      setSelectedCategoryId(storedSelectedCategory)
    }

    const storedShowFavs = localStorage.getItem("showOnlyFavorites")
    if (storedShowFavs === "true") {
      setShowOnlyFavorites(true)
    }

    setIsReady(true)
  }, [])

  // Guarda las notas en localStorage
  useEffect(() => {
    if (isReady) {
      localStorage.setItem("notes", JSON.stringify(notes))
    }
  }, [notes, isReady])

  useEffect(() => {
    localStorage.setItem("showOnlyFavorites", String(showOnlyFavorites))
  }, [showOnlyFavorites])

  useEffect(() => {
    if (isReady) {
      localStorage.setItem("categories", JSON.stringify(categories))
    }
  }, [categories, isReady])

  useEffect(() => {
    localStorage.setItem("selectedCategoryId", selectedCategoryId || "null")
  }, [selectedCategoryId])

  // Funciones de notas (guardar y editar)
  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) return

    const now = Date.now()
    const categoryToSave = editingCategoryId

    if (editingId) {
      setNotes(notes.map(note =>
        note.id === editingId ? { ...note, title, content, categoryId: categoryToSave, updatedAt: now } : note
      ))
      setEditingId(null)
      setEditingCategoryId(null)
    } else {
      const newNote: Note = {
        id: now.toString(),
        title,
        content,
        categoryId: categoryToSave,
        isFavorite: false,
        createdAt: now,
        updatedAt: now
      }
      setNotes([newNote, ...notes])
    }

    setTitle("")
    setContent("")
    setEditingCategoryId(null)
    setActiveTab('notes')
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const startEdit = (note: Note) => {
    if (selectionMode.isActive) {
      toggleNoteSelection(note.id)
      return
    }

    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
    setEditingCategoryId(note.categoryId || null)
    setActiveTab('add')
  }

  const toggleFavorite = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite, updatedAt: Date.now() } : note
    ))
  }

  const initializeNewNote = () => {
    setEditingCategoryId(selectedCategoryId)
  }

  // Funciones de selección múltiple
  const toggleSelectionMode = () => {
    setSelectionMode({
      isActive: !selectionMode.isActive,
      selectedIds: new Set()
    })
  }

  const toggleNoteSelection = (id: string) => {
    const newSelectedIds = new Set(selectionMode.selectedIds)
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id)
    } else {
      newSelectedIds.add(id)
    }
    setSelectionMode({ ...selectionMode, selectedIds: newSelectedIds })
  }

  const selectAllNotes = () => {
    const currentNotesIds = sortedNotes.map(note => note.id)

    if (selectionMode.selectedIds.size === currentNotesIds.length) {
      // Deseleccionar todas
      setSelectionMode({ ...selectionMode, selectedIds: new Set() })
    } else {
      // Seleccionar todas
      setSelectionMode({ ...selectionMode, selectedIds: new Set(currentNotesIds) })
    }
  }

  const deleteSelectedNotes = () => {
    setShowDeleteAllConfirm(true)
  }

  const confirmDeleteSelectedNotes = () => {
    const idsToDelete = Array.from(selectionMode.selectedIds)
    setNotes(notes.filter(note => !idsToDelete.includes(note.id)))
    setSelectionMode({ isActive: false, selectedIds: new Set() })
    setShowDeleteAllConfirm(false)
  }

  const cancelSelection = () => {
    setSelectionMode({ isActive: false, selectedIds: new Set() })
  }

  // Filtrar y ordenar notas
  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategoryId
      ? note.categoryId === selectedCategoryId
      : true

    const matchesFavorites = showOnlyFavorites ? note.isFavorite : true

    return matchesSearch && matchesCategory && matchesFavorites
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "favorite") {
      return sortOrder === "asc"
        ? Number(a.isFavorite) - Number(b.isFavorite)
        : Number(b.isFavorite) - Number(a.isFavorite)
    }

    if (sortBy === "updated") {
      const dateA = a.updatedAt || a.createdAt || parseInt(a.id)
      const dateB = b.updatedAt || b.createdAt || parseInt(b.id)
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    }

    // Default: ordenar por fecha de creación
    const dateA = a.createdAt || parseInt(a.id)
    const dateB = b.createdAt || parseInt(b.id)
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })

  // Funciones de categorías
  const handleSaveCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const now = Date.now()

    if (editingCategory) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, ...categoryData }
          : cat
      ))
      setEditingCategory(null)
    } else {
      const newCategory: Category = {
        id: now.toString(),
        ...categoryData,
        createdAt: now
      }
      setCategories([...categories, newCategory])
    }

    setShowCategoryForm(false)
  }

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId))

    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null)
    }
  }

  const startEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowCategoryForm(true)
  }

  // Manejo de long press
  useEffect(() => {
    let pressTimer: ReturnType<typeof setTimeout>
    let targetNoteId: string | null = null

    const handleTouchStart = (e: TouchEvent) => {
      if (selectionMode.isActive) return

      const target = e.target as HTMLElement
      if (target.closest('button') || target.closest('[role="button"]')) return

      const noteCard = target.closest('.note-card-container')
      if (noteCard) {
        targetNoteId = noteCard.getAttribute('data-note-id')
        if (targetNoteId) {
          pressTimer = setTimeout(() => {
            navigator.vibrate?.(50)
            setSelectionMode({
              isActive: true,
              selectedIds: new Set([targetNoteId!])
            })
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
  }, [selectionMode.isActive])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        notes={notes}
        selectionMode={selectionMode}
        activeTab={activeTab}
        onToggleSelection={toggleSelectionMode}
        onCancelSelection={cancelSelection}
      />

      {/* Contenido principal */}
      <div className="flex-1 p-4 pb-32">
        <div className="max-w-lg mx-auto">
          {/* Tab: Lista de notas */}
          {activeTab === 'notes' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {!selectionMode.isActive && (
                <div className="space-y-4 mb-4">  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <Button
                        variant="tab"
                        isActive={!showOnlyFavorites}
                        onClick={() => setShowOnlyFavorites(false)}
                        className="text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Todas</span>
                      </Button>

                      <Button
                        variant="tab"
                        isActive={showOnlyFavorites}
                        onClick={() => setShowOnlyFavorites(true)}
                        className="text-sm"
                      >
                        <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                        <span>Favoritas</span>
                      </Button>
                    </div>

                    <SortControls
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                    />
                  </div>

                  <CategorySelector
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onCategorySelect={setSelectedCategoryId}
                  />
                </div>
              )}

              <NoteList
                notes={sortedNotes}
                totalNotes={notes.length}
                searchTerm={searchTerm}
                categories={categories}
                onDelete={deleteNote}
                onEdit={startEdit}
                onToggleFavorite={toggleFavorite}
                selectionMode={selectionMode}
                onToggleSelection={toggleNoteSelection}
                onDeleteSelected={deleteSelectedNotes}
                onCancelSelection={cancelSelection}
                onSelectAll={selectAllNotes}
              />

              {notes.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/10"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Edit3 className="w-10 h-10 text-blue-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Sin notas aún</h3>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto">Comienza a organizar tus ideas creando tu primera nota</p>
                  <motion.button
                    onClick={() => {
                      setEditingCategoryId(selectedCategoryId)
                      setActiveTab('add')
                    }}
                    className="px-8 py-4 btn-primary text-white rounded-2xl font-semibold"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Crear primera nota
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Tab: Búsqueda */}
          {activeTab === 'search' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

              <div className="mt-6">
                {searchTerm ? (
                  <NoteList
                    notes={sortedNotes}
                    totalNotes={notes.length}
                    searchTerm={searchTerm}
                    categories={categories}
                    onDelete={deleteNote}
                    onEdit={startEdit}
                    onToggleFavorite={toggleFavorite}
                    selectionMode={selectionMode}
                    onToggleSelection={toggleNoteSelection}
                    onDeleteSelected={deleteSelectedNotes}
                    onCancelSelection={cancelSelection}
                    onSelectAll={selectAllNotes}
                  />
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Escribe para buscar en tus notas</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab: Agregar/Editar nota */}
          {activeTab === 'add' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? 'Editar nota' : 'Nueva nota'}
                </h2>
              </div>

              <NoteForm
                title={title}
                content={content}
                setTitle={setTitle}
                setContent={setContent}
                editingId={editingId}
                categories={categories}
                selectedCategoryId={editingCategoryId}
                onCategoryChange={setEditingCategoryId}
                onSave={handleSaveNote}
              />

              {editingId && (
                <motion.button
                  onClick={() => {
                    setEditingId(null)
                    setTitle("")
                    setContent("")
                    setEditingCategoryId(null)
                    setActiveTab('notes')
                  }}
                  className="mt-4 w-full py-3 text-gray-600 text-center font-medium"
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar edición
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Tab: Gestión de categorías */}
          {activeTab === 'categories' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Categorías
                </h2>
                <motion.button
                  onClick={() => setShowCategoryForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  + Nueva
                </motion.button>
              </div>
              {showCategoryForm && (
                <div className="mb-6">
                  <CategoryForm
                    onSave={handleSaveCategory}
                    onCancel={() => {
                      setShowCategoryForm(false)
                      setEditingCategory(null)
                    }}
                    editingCategory={editingCategory}
                  />
                </div>
              )}

              <CategoryList
                categories={categories}
                onEdit={startEditCategory}
                onDelete={deleteCategory}
              />

              {categories.length === 0 && !showCategoryForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/10"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Tag className="w-10 h-10 text-purple-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Sin categorías</h3>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto">Organiza mejor tus notas creando categorías personalizadas</p>
                  <motion.button
                    onClick={() => setShowCategoryForm(true)}
                    className="px-8 py-4 btn-primary text-white rounded-2xl font-semibold"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Crear primera categoría
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        editingId={editingId}
        selectionMode={selectionMode}
        onTabChange={setActiveTab}
        onCancelEdit={() => {
          setEditingId(null)
          setTitle("")
          setContent("")
          setEditingCategoryId(null)
        }}
        onCancelSelection={cancelSelection}
        onInitializeNewNote={initializeNewNote}
      />

      {/* Modal de confirmacion para eliminacion masiva */}
      <ConfirmDialog
        isOpen={showDeleteAllConfirm}
        title="Eliminar notas seleccionadas"
        message={`¿Estás seguro de que quieres eliminar ${selectionMode.selectedIds.size} nota${selectionMode.selectedIds.size === 1 ? '' : 's'}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar todas"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDeleteSelectedNotes}
        onCancel={() => setShowDeleteAllConfirm(false)}
      />

      {/* Prompt de actualización PWA */}
      <UpdatePrompt />
    </div>
  )
}

export default App