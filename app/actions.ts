"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { getCurrentUser, verifyPassword, createSession, clearSession, hashPassword } from "@/lib/auth"

// Authentication actions
export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const user = await verifyPassword(email, password)

  if (!user) {
    return { error: "Invalid email or password" }
  }

  await createSession(user.id)
  redirect("/dashboard")
}

export async function logout() {
  await clearSession()
  redirect("/login")
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "User with this email already exists" }
  }

  // Create new user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword(password),
      role: "teacher",
    },
  })

  await createSession(user.id)
  redirect("/dashboard")
}

// Subject actions
export async function createSubject(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string

  await prisma.subject.create({
    data: {
      name,
      description,
      teacherId: user.id,
    },
  })

  revalidatePath("/subjects")
  redirect("/subjects")
}

export async function updateSubject(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  // Check if user owns this subject
  const subject = await prisma.subject.findUnique({
    where: { id },
    select: { teacherId: true },
  })

  if (!subject || subject.teacherId !== user.id) {
    return { error: "You do not have permission to update this subject" }
  }

  await prisma.subject.update({
    where: { id },
    data: { name, description },
  })

  revalidatePath(`/subjects/${id}`)
  redirect(`/subjects/${id}`)
}

export async function deleteSubject(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  // Check if user owns this subject
  const subject = await prisma.subject.findUnique({
    where: { id },
    select: { teacherId: true },
  })

  if (!subject || subject.teacherId !== user.id) {
    return { error: "You do not have permission to delete this subject" }
  }

  await prisma.subject.delete({
    where: { id },
  })

  revalidatePath("/subjects")
  redirect("/subjects")
}

// Note actions
export async function createNote(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const topic = formData.get("topic") as string
  const subjectId = formData.get("subject") as string

  // Check if user owns this subject
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: { teacherId: true },
  })

  if (!subject || subject.teacherId !== user.id) {
    return { error: "You do not have permission to add notes to this subject" }
  }

  await prisma.note.create({
    data: {
      title,
      content,
      topic,
      subjectId,
      teacherId: user.id,
    },
  })

  revalidatePath(`/subjects/${subjectId}`)
  redirect(`/subjects/${subjectId}`)
}

export async function updateNote(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const topic = formData.get("topic") as string
  const subjectId = formData.get("subject") as string

  // Check if user owns this note
  const note = await prisma.note.findUnique({
    where: { id },
    select: { teacherId: true },
  })

  if (!note || note.teacherId !== user.id) {
    return { error: "You do not have permission to update this note" }
  }

  await prisma.note.update({
    where: { id },
    data: { title, content, topic, subjectId },
  })

  revalidatePath(`/notes/${id}`)
  redirect(`/notes/${id}`)
}

export async function deleteNote(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  // Check if user owns this note
  const note = await prisma.note.findUnique({
    where: { id },
    include: { subject: true },
  })

  if (!note || note.teacherId !== user.id) {
    return { error: "You do not have permission to delete this note" }
  }

  await prisma.note.delete({
    where: { id },
  })

  revalidatePath(`/subjects/${note.subjectId}`)
  redirect(`/subjects/${note.subjectId}`)
}

