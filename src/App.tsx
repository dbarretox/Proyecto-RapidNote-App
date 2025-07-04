import { useState, useEffect } from "react"
import type { Note, SelectionMode } from "./types"
import NoteList from "./components/NoteList"
import NoteForm from "./components/NoteForm"
import SearchBar from "./components/SearchBar"
import SortControls from "./components/SortControls"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Download, Smartphone, Share, Plus, X, Menu, Search, Edit3, FileText, CheckSquare } from "lucide-react"

// Interface para el evento de instalación
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function App() {
  // Estados PWA
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  
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

  // Detectar dispositivo
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isInWebApp = (window.navigator as any).standalone === true
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  // Efectos para PWA
  useEffect(() => {
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOSInstalled = isIOS && isInWebApp
      setIsInstalled(isStandalone || isIOSInstalled)
    }

    checkIfInstalled()
    window.addEventListener('appinstalled', () => setIsInstalled(true))
  }, [isIOS, isInWebApp])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  // Cargar y guardar datos
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

  useEffect(() => {
    if (isReady) {
      localStorage.setItem("notes", JSON.stringify(notes))
    }
  }, [notes, isReady])

  useEffect(() => {
    localStorage.setItem("showOnlyFavorites", String(showOnlyFavorites))
  }, [showOnlyFavorites])

  // Funciones PWA
  const installApp = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        
        if (outcome === 'accepted') {
          console.log('✅ Usuario aceptó la instalación')
        }
        
        setDeferredPrompt(null)
        setIsInstallable(false)
      } catch (error) {
        console.error('Error durante la instalación:', error)
      }
    }
  }

  // Funciones de notas
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
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📒</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">RapidNote</h1>
              {notes.length > 0 && (
                <p className="text-xs text-gray-500">
                  {notes.length} nota{notes.length !== 1 ? 's' : ''}
                  {selectionMode.isActive && selectionMode.selectedIds.size > 0 &&
                    ` • ${selectionMode.selectedIds.size} seleccionada${selectionMode.selectedIds.size !== 1 ? 's' : ''}`
                  }
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notes.length > 0 && activeTab === 'notes' && (
              <motion.button
                onClick={selectionMode.isActive ? cancelSelection : toggleSelectionMode}
                className={`p-2 rounded-lg transition-colors ${
                  selectionMode.isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {selectionMode.isActive ? <X className="w-5 h-5" /> : <CheckSquare className="w-5 h-5" />}
              </motion.button>
            )}

            {((isInstallable && !isInstalled) || (isIOS && !isInstalled && isSafari)) && (
              <motion.button
                onClick={isIOS ? () => setShowIOSInstructions(true) : installApp}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Smartphone className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

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
                    <motion.button
                      onClick={() => setShowOnlyFavorites(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        !showOnlyFavorites
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Todas</span>
                    </motion.button>

                    <motion.button
                      onClick={() => setShowOnlyFavorites(true)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        showOnlyFavorites
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                      <span>Favoritas</span>
                    </motion.button>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-around items-end">
            <motion.button
              onClick={() => {
                if (selectionMode.isActive) cancelSelection()
                setActiveTab('notes')
              }}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'notes' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
              }`}
            >
              <Menu className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Notas</span>
            </motion.button>

            <motion.button
              onClick={() => {
                if (selectionMode.isActive) cancelSelection()
                setActiveTab('search')
              }}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'search' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
              }`}
            >
              <Search className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Buscar</span>
            </motion.button>

            <motion.button
              onClick={() => {
                if (editingId) {
                  setEditingId(null)
                  setTitle("")
                  setContent("")
                }
                if (selectionMode.isActive) cancelSelection()
                setActiveTab('add')
              }}
              className="relative flex flex-col items-center"
            >
              <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center ${
                activeTab === 'add'
                  ? 'bg-blue-600 shadow-lg shadow-blue-600/30'
                  : 'bg-blue-600 shadow-md'
              } mb-1`}>
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xs font-medium ${
                activeTab === 'add' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {editingId ? 'Editar' : 'Crear'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modal de instrucciones para iOS */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowIOSInstructions(false)}
          >
            <motion.div
              className="bg-white rounded-t-2xl p-6 w-full max-w-sm mx-4"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Instalar en iPhone</h3>
                <button
                  onClick={() => setShowIOSInstructions(false)}
                  className="p-2 -m-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Toca el botón Compartir</p>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Share className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">En la barra inferior de Safari</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Selecciona "Añadir a pantalla de inicio"</p>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Plus className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Busca esta opción en el menú</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Confirma tocando "Añadir"</p>
                    <p className="text-sm text-gray-600">La app aparecerá en tu pantalla de inicio</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">¡Funciona sin internet!</span>
                </div>
                <p className="text-sm text-green-700">
                  Una vez instalada, podrás usar RapidNote aunque no tengas conexión.
                </p>
              </div>

              <motion.button
                onClick={() => setShowIOSInstructions(false)}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Entendido
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App