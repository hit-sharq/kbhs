"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { getCurrentUser, verifyPassword, createSession, clearSession, hashPassword } from "@/lib/auth"

// Authentication actions
export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    const user = await verifyPassword(email, password)

    if (!user) {
      return { error: "Invalid email or password" }
    }

    await createSession(user.id);
    console.log("Session created for user ID:", user.id);
    console.log("Session created for user ID:", user.id);
    redirect("/dashboard")
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred during login" }
  }
}

export async function logout() {
  try {
    await clearSession()
    redirect("/login")
  } catch (error) {
    console.error("Logout error:", error)
    return { error: "An unexpected error occurred during logout" }
  }
}

export async function register(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!name || !email || !password) {
      return { error: "All fields are required" }
    }

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

    await createSession(user.id);
    console.log("Session created for user ID:", user.id);
    redirect("/dashboard")
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "An unexpected error occurred during registration" }
  }
}

// Subject actions
export async function createSubject(formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) {
      return { error: "Subject name is required" }
    }

    await prisma.subject.create({
      data: {
        name,
        description,
        teacherId: user.id,
      },
    })

    revalidatePath("/subjects")
    redirect("/subjects")
  } catch (error) {
    console.error("Create subject error:", error)
    return { error: "An unexpected error occurred while creating the subject" }
  }
}

export async function updateSubject(formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!id || !name) {
      return { error: "Subject ID and name are required" }
    }

    // Check if user owns this subject
    const subject = await prisma.subject.findUnique({
      where: { id },
      select: { teacherId: true },
    })

    if (!subject) {
      return { error: "Subject not found" }
    }

    if (subject.teacherId !== user.id) {
      return { error: "You do not have permission to update this subject" }
    }

    await prisma.subject.update({
      where: { id },
      data: { name, description },
    })

    revalidatePath(`/subjects/${id}`)
    redirect(`/subjects/${id}`)
  } catch (error) {
    console.error("Update subject error:", error)
    return { error: "An unexpected error occurred while updating the subject" }
  }
}

export async function deleteSubject(id: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    if (!id) {
      return { error: "Subject ID is required" }
    }

    // Check if user owns this subject
    const subject = await prisma.subject.findUnique({
      where: { id },
      select: { teacherId: true },
    })

    if (!subject) {
      return { error: "Subject not found" }
    }

    if (subject.teacherId !== user.id) {
      return { error: "You do not have permission to delete this subject" }
    }

    await prisma.subject.delete({
      where: { id },
    })

    revalidatePath("/subjects")
    redirect("/subjects")
  } catch (error) {
    console.error("Delete subject error:", error)
    return { error: "An unexpected error occurred while deleting the subject" }
  }
}

// Note actions
export async function createNote(formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const topic = formData.get("topic") as string
    const subjectId = formData.get("subject") as string

    if (!title || !content || !topic || !subjectId) {
      return { error: "All fields are required" }
    }

    // Check if user owns this subject
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      select: { teacherId: true },
    })

    if (!subject) {
      return { error: "Subject not found" }
    }

    if (subject.teacherId !== user.id) {
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
  } catch (error) {
    console.error("Create note error:", error)
    return { error: "An unexpected error occurred while creating the note" }
  }
}

export async function updateNote(formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const topic = formData.get("topic") as string
    const subjectId = formData.get("subject") as string

    if (!id || !title || !content || !topic || !subjectId) {
      return { error: "All fields are required" }
    }

    // Check if user owns this note
    const note = await prisma.note.findUnique({
      where: { id },
      select: { teacherId: true },
    })

    if (!note) {
      return { error: "Note not found" }
    }

    if (note.teacherId !== user.id) {
      return { error: "You do not have permission to update this note" }
    }

    await prisma.note.update({
      where: { id },
      data: { title, content, topic, subjectId },
    })

    revalidatePath(`/notes/${id}`)
    redirect(`/notes/${id}`)
  } catch (error) {
    console.error("Update note error:", error)
    return { error: "An unexpected error occurred while updating the note" }
  }
}

export async function deleteNote(id: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    if (!id) {
      return { error: "Note ID is required" }
    }

    // Check if user owns this note
    const note = await prisma.note.findUnique({
      where: { id },
      include: { subject: true },
    })

    if (!note) {
      return { error: "Note not found" }
    }

    if (note.teacherId !== user.id) {
      return { error: "You do not have permission to delete this note" }
    }

    await prisma.note.delete({
      where: { id },
    })

    revalidatePath(`/subjects/${note.subjectId}`)
    redirect(`/subjects/${note.subjectId}`)
  } catch (error) {
    console.error("Delete note error:", error)
    return { error: "An unexpected error occurred while deleting the note" }
  }
}

/* Duplicate login function removed to resolve redeclaration error */
