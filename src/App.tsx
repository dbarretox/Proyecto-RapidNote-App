import { useState, useEffect } from "react"
import type { Note, SelectionMode } from "./types"
import { NoteList, NoteForm } from "./components/notes"
import { SearchBar, SortControls } from "./components/controls"
import { motion } from "framer-motion"
import { Star, Search, Edit3, FileText } from "lucide-react"
import { Button } from "./components/ui"
import { Header, BottomNav } from "./components/layout"

function App() {

  // Estados de la aplicación
  const [activeTab, setActiveTab] = useState<'notes' | 'search' | 'add'>('notes')
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "favorite" | "updated">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

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

  // Funciones de notas (guardar y editar)
  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) return

    const now = Date.now()

    if (editingId) {
      setNotes(notes.map(note =>
        note.id === editingId ? { ...note, title, content, updatedAt: now } : note
      ))
      setEditingId(null)
    } else {
      const newNote: Note = {
        id: now.toString(),
        title,
        content,
        isFavorite: false,
        createdAt: now,
        updatedAt: now
      }
      setNotes([newNote, ...notes])
    }

    setTitle("")
    setContent("")
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
    setActiveTab('add')
  }

  const toggleFavorite = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite, updatedAt: Date.now() } : note
    ))
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
    const idsToDelete = Array.from(selectionMode.selectedIds)
    setNotes(notes.filter(note => !idsToDelete.includes(note.id)))
    setSelectionMode({ isActive: false, selectedIds: new Set() })
  }

  const cancelSelection = () => {
    setSelectionMode({ isActive: false, selectedIds: new Set() })
  }

  // Filtrar y ordenar notas
  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())

    return showOnlyFavorites ? note.isFavorite && matchesSearch : matchesSearch
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

  // Manejo de long press
  useEffect(() => {
    let pressTimer: number
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
      <div className="flex-1 p-4 pb-20">
        <div className="max-w-lg mx-auto">
          {/* Tab: Lista de notas */}
          {activeTab === 'notes' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {!selectionMode.isActive && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <Button
                      variant="tab"
                      isActive={!showOnlyFavorites}
                      onClick={() => setShowOnlyFavorites(false)}
                      className="px-3 py-2 text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Todas</span>
                    </Button>

                    <Button
                      variant="tab"
                      isActive={showOnlyFavorites}
                      onClick={() => setShowOnlyFavorites(true)}
                      className="px-3 py-2 text-sm"
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
              )}

              <NoteList
                notes={sortedNotes}
                totalNotes={notes.length}
                searchTerm={searchTerm}
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
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Edit3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin notas aún</h3>
                  <p className="text-gray-500 mb-6">Crea tu primera nota tocando el botón +</p>
                  <motion.button
                    onClick={() => setActiveTab('add')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Crear nota
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
                onSave={handleSaveNote}
              />

              {editingId && (
                <motion.button
                  onClick={() => {
                    setEditingId(null)
                    setTitle("")
                    setContent("")
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
        }}
        onCancelSelection={cancelSelection}
      />
    </div>
  )
}

export default App