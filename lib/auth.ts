import { cookies } from "next/headers"
import { createHash } from "crypto"
import prisma from "./db"
import { User } from "@prisma/client"

// Simple password hashing function
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

// Verify password
export async function verifyPassword(email: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
        console.error("User not found for email:", email);
        return null;
    }

    const hashedPassword = hashPassword(password)
    if (user.password !== hashedPassword) {
        console.error("Password mismatch for user:", email);
        return null;
    }

    return user
  } catch (error) {
    console.error("Error verifying password:", error)
    return null
  }
}

// Get current user from session
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    console.log("Retrieving current user session");
    const sessionId = cookieStore.get("session_id")?.value;
    console.log("Session ID retrieved:", sessionId);
    console.log("Session ID retrieved:", sessionId);


    if (!sessionId) {
        console.error("No session ID found in cookies.");
        return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionId },
    })

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Create session
export async function createSession(userId: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    console.log("Creating session for user ID:", userId);
    cookieStore.set("session_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })
  } catch (error) {
    console.error("Error creating session:", error)
    throw new Error("Failed to create session")
  }
}

// Clear session
export async function clearSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    console.log("Clearing session");
    cookieStore.set("session_id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
      path: "/",
    })
  } catch (error) {
    console.error("Error clearing session:", error)
    throw new Error("Failed to clear session")
  }
}
