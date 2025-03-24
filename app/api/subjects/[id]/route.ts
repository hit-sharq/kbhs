import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subject = await prisma.subject.findUnique({
      where: { id: params.id },
    })

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    // Check if user is the owner of this subject
    if (subject.teacherId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(subject)
  } catch (error) {
    console.error("Error fetching subject:", error)
    return NextResponse.json({ error: "Failed to fetch subject" }, { status: 500 })
  }
}

