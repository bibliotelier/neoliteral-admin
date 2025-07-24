export const dynamic = "force-dynamic"

import { supabase } from "@/lib/supabase-admin"
import { Input } from "@/components/ui/input"
import AddBookButton from "@/components/AddBookButton"

type BookStats = {
  slug: string
  language: string | null
  price: number | null
  title: string
  author: string
  instalments_count: number
  total_readers: number
  active_readers: number
  completed_readers: number
  created_at: string | null
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams?: { q?: string; sort?: string; dir?: string }
}) {
  const query = (searchParams?.q || "").toLowerCase()
  const sortKey = (searchParams?.sort as keyof BookStats) || "title"
  const sortAsc = searchParams?.dir !== "desc"

  const { data: books, error } = await supabase.from("books_admin_stats").select("*")

  if (error) return <p className="text-red-500">Error loading books</p>
  if (!books) return <p>No data</p>

  const filtered = books.filter((book) =>
    (book.title + book.author).toLowerCase().includes(query)
  )

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortKey]
    const valB = b[sortKey]

    if (typeof valA === "string" && typeof valB === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA
    }
    if (valA && valB && sortKey === "created_at") {
      return sortAsc
        ? new Date(valA).getTime() - new Date(valB).getTime()
        : new Date(valB).getTime() - new Date(valA).getTime()
    }
    return 0
  })

  function header(label: string, key: keyof BookStats) {
    const isActive = sortKey === key
    const dir = isActive && sortAsc ? "desc" : "asc"
    const arrow = isActive ? (sortAsc ? "▲" : "▼") : ""
    return (
      <a
        href={`?sort=${key}&dir=${dir}${query ? `&q=${query}` : ""}`}
        className="cursor-pointer"
      >
        {label} {arrow}
      </a>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Books</h1>

      <div className="mb-4">
        <AddBookButton />
      </div>

      <form method="get" className="mb-4">
        <Input
          type="text"
          name="q"
          placeholder="Search by title or author..."
          defaultValue={query}
          className="w-64"
        />
      </form>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="text-left p-2 border-b">{header("Language", "language")}</th>
            <th className="text-left p-2 border-b">{header("Price", "price")}</th>
            <th className="text-left p-2 border-b">{header("Title", "title")}</th>
            <th className="text-left p-2 border-b">{header("Author", "author")}</th>
            <th className="text-left p-2 border-b">{header("Slug", "slug")}</th>
            <th className="text-left p-2 border-b">{header("Instalments", "instalments_count")}</th>
            <th className="text-left p-2 border-b">{header("Total", "total_readers")}</th>
            <th className="text-left p-2 border-b">{header("Active", "active_readers")}</th>
            <th className="text-left p-2 border-b">{header("Completed", "completed_readers")}</th>
            <th className="text-left p-2 border-b">{header("Created", "created_at")}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((book) => (
            <tr key={book.slug} className="hover:bg-gray-50 dark:hover:bg-gray-900">
              <td className="p-2 border-b text-xs text-gray-500">{book.language || "—"}</td>
              <td className="p-2 border-b text-xs text-gray-500">
                {book.price !== null ? `$${book.price.toFixed(2)}` : "—"}
              </td>
              <td className="p-2 border-b">{book.title}</td>
              <td className="p-2 border-b">{book.author}</td>
              <td className="p-2 border-b text-xs text-gray-500">{book.slug}</td>
              <td className="p-2 border-b text-xs text-gray-500">{book.instalments_count}</td>
              <td className="p-2 border-b text-xs text-gray-500">{book.total_readers}</td>
              <td className="p-2 border-b text-xs text-gray-500">{book.active_readers}</td>
              <td className="p-2 border-b text-xs text-gray-500">{book.completed_readers}</td>
              <td className="p-2 border-b text-xs text-gray-500">
                {book.created_at?.slice(0, 10) || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
