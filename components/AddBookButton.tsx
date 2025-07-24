"use client"

import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export default function AddBookButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">➕ Add Book</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-2">Upload book.json</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget
            const fileInput = form.elements.namedItem("file") as HTMLInputElement
            const coverInput = form.elements.namedItem("cover") as HTMLInputElement
            if (!fileInput.files || fileInput.files.length === 0) {
              toast({ title: "Please select a book.json file." })
              return
            }
            const file = fileInput.files[0]
            const cover_url = coverInput.value

            const text = await file.text()
            let json
            try {
              json = JSON.parse(text)
            } catch (err) {
              toast({ title: "Invalid JSON." })
              return
            }

            const res = await fetch("/api/upload-book", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ book: json, cover_url }),
            })

            if (res.ok) {
              toast({ title: "✅ Book uploaded successfully!" })
              setOpen(false)
              location.reload()
            } else {
              const errorData = await res.json()
              toast({
                title: "❌ Failed to upload book.",
                description: errorData?.message || "Unknown error",
              })
            }
          }}
          className="space-y-4"
        >
          <Input name="file" type="file" accept=".json" />
          <Input name="cover" placeholder="Cover URL (optional)" />
          <Button type="submit" variant="default">
            Upload
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
