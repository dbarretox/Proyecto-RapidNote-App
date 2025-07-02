import { Search } from "lucide-react"

type Props = {
    searchTerm: string
    setSearchTerm: (value: string) => void
}

export default function SearchBar({ searchTerm, setSearchTerm }: Props) {
    return (
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Buscar notas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    )
}