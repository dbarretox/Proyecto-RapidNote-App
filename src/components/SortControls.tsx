import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react"

type Props = {
    sortBy: "date" | "title" | "favorite"
    setSortBy: (value: "date" | "title" | "favorite") => void
    sortOrder: "asc" | "desc"
    setSortOrder: (value: "asc" | "desc") => void
}

export default function SortControls({ sortBy, setSortBy, sortOrder, setSortOrder }: Props) {
    return (
        <div className="flex items-center justify-between mb-4">
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "title" | "favorite")}
                className="p-2 border border-gray-300 rounded text-gray-800"
            >
                <option value="date">📅 Fecha</option>
                <option value="title">📝 Título</option>
                <option value="favorite">⭐ Favoritas</option>
            </select>

            <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="ml-4 flex item-center text-sm text-gray-600 hover:text-gray-800"
                title="Cambiar orden"
            >
                {sortOrder === "asc" ? (
                    <>
                        Ascendente
                        <ArrowUpNarrowWide className="w-4 h-4 ml-1" />
                    </>
                ) : (
                    <>
                        Descendente
                        <ArrowDownWideNarrow className="w-4 h-4 ml-1" />
                    </>
                    
                )}
            </button>
        </div>
    )
}