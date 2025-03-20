import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subjects = await prisma.subject.findMany({
    where: { teacherId: user.id },
    select: { id: true, name: true },
  })

  return NextResponse.json(subjects)
}

