"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"

type Book = {
  id: number
  title: string
  author: string
  slug: string
  cover_url?: string
  created_at?: string
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase.from("books").select("*")
      if (error) {
        console.error("Supabase error:", error)
      } else {
        setBooks(data || [])
      }
      setLoading(false)
    }

    fetchBooks()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="text-left p-2 border-b">Title</th>
              <th className="text-left p-2 border-b">Author</th>
              <th className="text-left p-2 border-b">Slug</th>
              <th className="text-left p-2 border-b">Created</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="p-2 border-b">{book.title}</td>
                <td className="p-2 border-b">{book.author}</td>
                <td className="p-2 border-b text-xs text-gray-500">{book.slug}</td>
                <td className="p-2 border-b text-xs text-gray-500">
                  {book.created_at?.slice(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
