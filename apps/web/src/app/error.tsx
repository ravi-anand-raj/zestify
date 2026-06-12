"use client"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050508] text-white p-6">
      <h1 className="text-4xl font-bold tracking-tighter mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-8">An unexpected error occurred.</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
