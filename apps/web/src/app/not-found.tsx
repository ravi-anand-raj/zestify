export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050508] text-white p-6">
      <h1 className="text-6xl font-bold tracking-tighter text-gradient-primary mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-8">Page not found.</p>
      <a
        href="/dashboard"
        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-colors"
      >
        Go to Dashboard
      </a>
    </div>
  )
}
