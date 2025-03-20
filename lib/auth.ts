import { cookies } from "next/headers"
import { createHash } from "crypto"
import prisma from "./db"

// Simple password hashing function
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

// Verify password
export async function verifyPassword(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) return null

  const hashedPassword = hashPassword(password)
  if (user.password !== hashedPassword) return null

  return user
}

// Get current user from session
export async function getCurrentUser() {
  // Fix: Use await with cookies() as it's an asynchronous API
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) return null

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
  })

  return user
}
// Create session
export async function createSession(userId: string) {
  // Fix: Use await with cookies() as it's an asynchronous API
  const cookieStore = await cookies()
  cookieStore.set("session_id", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}

// Clear session
export async function clearSession() {
  // Fix: Use await with cookies() as it's an asynchronous API
  const cookieStore = await cookies()
  cookieStore.delete("session_id")
}

