export const dynamic = "force-dynamic"

import { supabase } from "@/lib/supabase-admin"
import { Input } from "@/components/ui/input"

type ReaderStats = {
  id: string
  email: string
  created_at: string | null
  totalpaid: number | null
  totalbooks: number | null
  activebooks: number | null
  percentcompleted: number | null
  totalemails: number | null
  lastsent: string | null
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: { q?: string; sort?: string; dir?: string }
}) {
  const query = (searchParams?.q || "").toLowerCase()
  const sortKey = (searchParams?.sort as keyof ReaderStats) || "email"
  const sortAsc = searchParams?.dir !== "desc"

  const { data: readers, error } = await supabase.rpc("get_reader_stats")

  if (error) return <p className="text-red-500">Error loading users</p>
  if (!readers) return <p>No data</p>

  const filtered = readers.filter((r) =>
    r.email.toLowerCase().includes(query)
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
    if (valA && valB && (sortKey === "lastsent" || sortKey === "created_at")) {
      return sortAsc
        ? new Date(valA).getTime() - new Date(valB).getTime()
        : new Date(valB).getTime() - new Date(valA).getTime()
    }
    return 0
  })

  function header(label: string, key: keyof ReaderStats) {
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
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <form method="get" className="mb-4">
        <Input
          type="text"
          name="q"
          placeholder="Search by email..."
          defaultValue={query}
          className="w-64"
        />
      </form>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="text-left p-2 border-b">{header("ID", "id")}</th>
            <th className="text-left p-2 border-b">{header("Email", "email")}</th>
            <th className="text-left p-2 border-b">{header("Total Paid", "totalpaid")}</th>
            <th className="text-left p-2 border-b">{header("Total Books", "totalbooks")}</th>
            <th className="text-left p-2 border-b">{header("Active Books", "activebooks")}</th>
            <th className="text-left p-2 border-b">{header("% Finished", "percentcompleted")}</th>
            <th className="text-left p-2 border-b">{header("Total Emails", "totalemails")}</th>
            <th className="text-left p-2 border-b">{header("Since", "created_at")}</th>
            <th className="text-left p-2 border-b">{header("Last Sent", "lastsent")}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((reader) => (
            <tr key={reader.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
              <td className="p-2 border-b text-xs text-gray-500">{reader.id}</td>
              <td className="p-2 border-b">{reader.email}</td>
              <td className="p-2 border-b">
                {reader.totalpaid !== null && reader.totalpaid !== undefined
                  ? `$${reader.totalpaid.toFixed(2)}`
                  : "—"}
              </td>
              <td className="p-2 border-b">{reader.totalbooks ?? "—"}</td>
              <td className="p-2 border-b">{reader.activebooks ?? "—"}</td>
              <td className="p-2 border-b">
                {reader.percentcompleted !== null && reader.percentcompleted !== undefined
                  ? `${(reader.percentcompleted * 100).toFixed(0)}%`
                  : "—"}
              </td>
              <td className="p-2 border-b">{reader.totalemails ?? "—"}</td>
              <td className="p-2 border-b">
                {reader.created_at ? reader.created_at.slice(0, 10) : "—"}
              </td>
              <td className="p-2 border-b">
                {reader.lastsent ? reader.lastsent.slice(0, 10) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
