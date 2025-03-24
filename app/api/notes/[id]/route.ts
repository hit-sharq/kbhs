import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const note = await prisma.note.findUnique({
      where: { id: params.id },
      include: {
        subject: {
          select: { id: true, name: true },
        },
      },
    })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    // Check if user is the owner of this note
    if (note.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error fetching note:", error)
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 })
  }
}

