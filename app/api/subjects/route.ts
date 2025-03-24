import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subjects = await prisma.subject.findMany({
      where: { teacherId: user.id },
      select: { id: true, name: true },
    })

    // Ensure we're returning an array
    return NextResponse.json(Array.isArray(subjects) ? subjects : [])
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
}

