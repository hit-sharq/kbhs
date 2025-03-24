import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-8">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="btn">
        Return Home
      </Link>
    </div>
  )
}

