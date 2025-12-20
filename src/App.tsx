import { useState } from "react"
import type { Note, Category, ActiveTab } from "@/types"
import { NoteList, NoteForm } from "@/components/notes"
import { SearchBar, SortControls } from "@/components/controls"
import { motion } from "framer-motion"
import { Star, Search, Edit3, FileText, Tag } from "lucide-react"
import { Button, ConfirmDialog, ToastContainer } from "@/components/ui"
import { Header, BottomNav } from "@/components/layout"
import { CategorySelector, CategoryForm, CategoryList } from "@/components/categories"
import { UpdatePrompt } from "@/components/pwa"
import { NotesProvider, ToastProvider, useNotes } from "@/contexts"

function AppContent() {
  const {
    notes,
    categories,
    filteredNotes,
    selectedIds,
    isSelectionMode,
    searchQuery,
    sortBy,
    sortOrder,
    activeCategory,
    showOnlyFavorites,
    addNote,
    updateNote,
    deleteNote,
    deleteMultiple,
    toggleFavorite,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleSelection,
    selectAll,
    exitSelectionMode,
    enterSelectionMode,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setActiveCategory,
    setShowOnlyFavorites
  } = useNotes()

  // Estado local de UI
  const [activeTab, setActiveTab] = useState<ActiveTab>('notes')
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false)

  // Crear SelectionMode compatible con componentes existentes
  const selectionMode = { isActive: isSelectionMode, selectedIds }

  // Handlers de notas
  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) return

    if (editingId) {
      updateNote(editingId, { title, content, categoryId: editingCategoryId })
      setEditingId(null)
    } else {
      addNote({ title, content, categoryId: editingCategoryId, isFavorite: false })
    }

    setTitle("")
    setContent("")
    setEditingCategoryId(null)
    setActiveTab('notes')
  }

  const startEdit = (note: Note) => {
    if (isSelectionMode) {
      toggleSelection(note.id)
      return
    }
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
    setEditingCategoryId(note.categoryId || null)
    setActiveTab('add')
  }

  const handleDeleteSelected = () => setShowDeleteAllConfirm(true)

  const confirmDeleteSelected = () => {
    deleteMultiple(Array.from(selectedIds))
    exitSelectionMode()
    setShowDeleteAllConfirm(false)
  }

  // Handlers de categorías
  const handleSaveCategory = (data: Omit<Category, 'id' | 'createdAt'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data)
      setEditingCategory(null)
    } else {
      addCategory(data)
    }
    setShowCategoryForm(false)
  }

  const startEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowCategoryForm(true)
  }

  // Handler para toggle de modo selección desde header
  const handleToggleSelectionMode = () => {
    if (isSelectionMode) {
      exitSelectionMode()
    } else {
      enterSelectionMode()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        notes={notes}
        selectionMode={selectionMode}
        activeTab={activeTab}
        onToggleSelection={handleToggleSelectionMode}
        onCancelSelection={exitSelectionMode}
      />

      <div className="flex-1 p-4 pb-32">
        <div className="max-w-lg mx-auto">
          {activeTab === 'notes' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {!isSelectionMode && (
                <div className="space-y-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <Button variant="tab" isActive={!showOnlyFavorites} onClick={() => setShowOnlyFavorites(false)} className="text-sm">
                        <FileText className="w-4 h-4" /><span>Todas</span>
                      </Button>
                      <Button variant="tab" isActive={showOnlyFavorites} onClick={() => setShowOnlyFavorites(true)} className="text-sm">
                        <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-current' : ''}`} /><span>Favoritas</span>
                      </Button>
                    </div>
                    <SortControls sortBy={sortBy} setSortBy={setSortBy} sortOrder={sortOrder} setSortOrder={setSortOrder} />
                  </div>
                  <CategorySelector categories={categories} selectedCategoryId={activeCategory} onCategorySelect={setActiveCategory} />
                </div>
              )}

              <NoteList
                notes={filteredNotes}
                totalNotes={notes.length}
                searchTerm={searchQuery}
                categories={categories}
                onDelete={deleteNote}
                onEdit={startEdit}
                onToggleFavorite={toggleFavorite}
                selectionMode={selectionMode}
                onToggleSelection={toggleSelection}
                onDeleteSelected={handleDeleteSelected}
                onCancelSelection={exitSelectionMode}
                onSelectAll={() => selectAll(filteredNotes.map(n => n.id))}
              />

              {notes.length === 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Edit3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin notas aún</h3>
                  <p className="text-gray-500 mb-6">Crea tu primera nota tocando el botón +</p>
                  <motion.button
                    onClick={() => { setEditingCategoryId(activeCategory); setActiveTab('add') }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    Crear nota
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <SearchBar searchTerm={searchQuery} setSearchTerm={setSearchQuery} />
              <div className="mt-6">
                {searchQuery ? (
                  <NoteList
                    notes={filteredNotes}
                    totalNotes={notes.length}
                    searchTerm={searchQuery}
                    categories={categories}
                    onDelete={deleteNote}
                    onEdit={startEdit}
                    onToggleFavorite={toggleFavorite}
                    selectionMode={selectionMode}
                    onToggleSelection={toggleSelection}
                    onDeleteSelected={handleDeleteSelected}
                    onCancelSelection={exitSelectionMode}
                    onSelectAll={() => selectAll(filteredNotes.map(n => n.id))}
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

          {activeTab === 'add' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{editingId ? 'Editar nota' : 'Nueva nota'}</h2>
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
                  onClick={() => { setEditingId(null); setTitle(""); setContent(""); setEditingCategoryId(null); setActiveTab('notes') }}
                  className="mt-4 w-full py-3 text-gray-600 text-center font-medium"
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar edición
                </motion.button>
              )}
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Categorías</h2>
                <motion.button
                  onClick={() => setShowCategoryForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  + Nueva
                </motion.button>
              </div>
              {showCategoryForm && (
                <div className="mb-6">
                  <CategoryForm
                    onSave={handleSaveCategory}
                    onCancel={() => { setShowCategoryForm(false); setEditingCategory(null) }}
                    editingCategory={editingCategory}
                  />
                </div>
              )}
              <CategoryList categories={categories} onEdit={startEditCategory} onDelete={deleteCategory} />
              {categories.length === 0 && !showCategoryForm && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin categorías</h3>
                  <p className="text-gray-500 mb-6">Crea tu primera categoría para organizar tus notas</p>
                  <motion.button
                    onClick={() => setShowCategoryForm(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    Crear categoría
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <BottomNav
        activeTab={activeTab}
        editingId={editingId}
        selectionMode={selectionMode}
        onTabChange={setActiveTab}
        onCancelEdit={() => { setEditingId(null); setTitle(""); setContent(""); setEditingCategoryId(null) }}
        onCancelSelection={exitSelectionMode}
        onInitializeNewNote={() => setEditingCategoryId(activeCategory)}
      />

      <ConfirmDialog
        isOpen={showDeleteAllConfirm}
        title="Eliminar notas seleccionadas"
        message={`¿Estás seguro de que quieres eliminar ${selectedIds.size} nota${selectedIds.size === 1 ? '' : 's'}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar todas"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDeleteSelected}
        onCancel={() => setShowDeleteAllConfirm(false)}
      />

      <UpdatePrompt />
      <ToastContainer />
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </ToastProvider>
  )
}

export default App
