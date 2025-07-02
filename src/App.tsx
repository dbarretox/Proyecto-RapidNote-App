import { useState, useEffect } from "react"
import type { Note } from "./types"
import NoteList from "./components/NoteList"
import NoteForm from "./components/NoteForm"
import SearchBar from "./components/SearchBar"
import SortControls from "./components/SortControls"
import { motion, AnimatePresence } from "framer-motion"
import { Star, StarOff } from "lucide-react"


// Estados principales de la app
function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      console.log("👉 Evento beforeinstallprompt capturado");
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);


  const installApp = () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      setDeferredPrompt(null);
    }
  };

  const [notes, setNotes] = useState<Note[]>([])  // Lista de notas
  const [title, setTitle] = useState("")          // Campo de entrada del titulo
  const [content, setContent] = useState("")      // Campo de entrada del contenido
  const [editingId, setEditingId] = useState<string | null>(null) // ID de la nota en edicion (si aplica)
  const [isReady, setIsReady] = useState(false)   // Evita guardar antes de haber cargado
  const [searchTerm, setSearchTerm] = useState("") // Buscador de Notas
  const [sortBy, setSortBy] = useState<"date" | "title" | "favorite">("date") // Ordenar por selector
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc") // Ordenar por flechas
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false) // Funcion para ver solo Favoritos

  // Funcion para iniciar la edicion de una nota
  const startEdit = (note: Note) => {
    setEditingId(note.id)     // Guarda el ID de la nota que se va a editar
    setTitle(note.title)      // Llena el input con el titulo actual
    setContent(note.content)  // Llena el textarea con el contenido actual
  }

  // Funcion para seleccionar Favoritos
  const toggleFavorite = (id: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    )
    setNotes(updatedNotes)
  }

  // Cargar notas al iniciar la app
  useEffect(() => {
    const storedNotes = localStorage.getItem("notes")
    if (storedNotes) {
      try {
        const parsed = JSON.parse(storedNotes)          // Intenta convertir el texto guardado a objeto
        setNotes(Array.isArray(parsed) ? parsed : [])   // Asegura que es un array antes de guardar
      } catch {
        console.error("Error al parsear notes desde localStorage") // Muestra error si JSON esta corrupto
      }
    }
    const storedShowFavs = localStorage.getItem("showOnlyFavorites")
    if (storedShowFavs === "true") {
      setShowOnlyFavorites(true)
    }
    setIsReady(true) // Marca como lista la app para guardar cambios despues
  }, [])


  // Guardar notas en localStorage cuando cambien
  useEffect(() => {
    if (isReady) {
      localStorage.setItem("notes", JSON.stringify(notes))  // Solo guarda si ya se cargaron las notas
    }
  }, [notes, isReady])

  useEffect(() => {
    localStorage.setItem("showOnlyFavorites", String(showOnlyFavorites))
  }, [showOnlyFavorites])

  // 1. Filtra las notas antes de mostarlas
  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())

    return showOnlyFavorites ? note.isFavorite && matchesSearch : matchesSearch

  })

  // 2. Ordernar
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "title") {
      const titleA = a.title.toLowerCase()
      const titleB = b.title.toLowerCase()
      return sortOrder === "asc"
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA)
    }

    if (sortBy === "favorite") {
      return sortOrder === "asc"
        ? Number(a.isFavorite) - Number(b.isFavorite)
        : Number(b.isFavorite) - Number(a.isFavorite)
    }

    const dateA = parseInt(a.id)
    const dateB = parseInt(b.id)
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })

  return (
    // contenedor principal
    <div className="min-h-screen bg-gray-100 p-4">

      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">📒 RapidNote</h1>
      <p className="text-gray-600 text-center">Tu app de notas rápidas con TailwindCSS</p>

      {deferredPrompt && (
        <button
          onClick={installApp}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Instalar RapidNote
        </button>
      )}


      <div className="max-w-xl mx-auto mt-6 bg-white p-4 rounded shadow">

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <SortControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <NoteForm
          title={title}
          content={content}
          setTitle={setTitle}
          setContent={setContent}
          editingId={editingId}
          onSave={() => {
            if (!title.trim() && !content.trim()) return // Evita guardar notas vacias

            if (editingId) {
              //Si se esta editando, actualiza la nota correspondiente
              const updatedNotes = notes.map((note) =>
                note.id === editingId ? { ...note, title, content } : note
              )
              setNotes(updatedNotes)
              setEditingId(null)
            } else {
              // Si no se esta editando, crea una nueva nota
              const newNote: Note = {
                id: Date.now().toString(),
                title,
                content,
              }
              setNotes([newNote, ...notes]) // Agrega la nueva nota al principio
            }
            //Limpia los campos
            setTitle("")
            setContent("")
          }}
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.button
            key={showOnlyFavorites ? "all" : "favorites"}
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1 mb-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            {showOnlyFavorites ? (
              <>
                <StarOff className="w-4 h-4 mr-1" />
                Ver todas las notas
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-1" />
                Ver solo favoritas
              </>
            )}

          </motion.button>
        </AnimatePresence>

        <NoteList
          notes={sortedNotes}
          totalNotes={notes.length}
          searchTerm={searchTerm}
          onDelete={(id) => setNotes(notes.filter((n) => n.id !== id))}
          onEdit={(note) => startEdit(note)}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>

  )
}

export default App