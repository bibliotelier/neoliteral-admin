import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { book, cover_url } = await req.json()

  if (!book.slug || !book.title || !book.author || !Array.isArray(book.instalments)) {
    return NextResponse.json({ message: "Invalid book format" }, { status: 400 })
  }

  // Insert or update metadata into books (no book_json)
  const { error: bookError } = await supabase
    .from("books")
    .upsert([
      {
        slug: book.slug,
        title: book.title,
        author: book.author,
        language: book.language || "en",
        source: book.source || "",
        cover_url,
        instalments_count: book.instalments.length,
      },
    ], {
      onConflict: ['slug'],
    })
    .select()
    

  if (bookError) {
    console.error("Error upserting book:", bookError)
    return NextResponse.json({ message: bookError.message }, { status: 500 })
  }

  // Remove previous instalments (if any)
  await supabase.from("instalments").delete().eq("book_slug", book.slug)

  // Insert all instalments
  const instalmentsPayload = book.instalments.map((i: any) => ({
    book_slug: book.slug,
    number: i.number,
    html: i.html,
    minutes_estimate: i.minutes,
    title: i.title || null,
    entry_point: i.entry_point || false,
  }))

  const { error: instalmentsError } = await supabase
    .from("instalments")
    .insert(instalmentsPayload)

  if (instalmentsError) {
    console.error("Error inserting instalments:", instalmentsError)
    return NextResponse.json({ message: instalmentsError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
