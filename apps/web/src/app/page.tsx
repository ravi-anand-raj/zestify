export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white text-center">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-6xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">
          ZESTIFY
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          The Intelligence Layer for Personal Finance. Stop relying on outdated advice. Start leveraging ZUST AI to optimize your net worth in real-time.
        </p>
        <div className="flex gap-6 justify-center">
          <a href="/login" className="px-8 py-4 bg-primary text-white rounded-full font-medium hover:scale-105 transition-transform shadow-[0_0_20px_rgba(10,132,255,0.4)]">
            Log In
          </a>
          <a href="/signup" className="px-8 py-4 bg-card border border-white/10 text-white rounded-full font-medium hover:bg-muted transition-colors">
            Get Started Free
          </a>
        </div>
      </div>
    </main>
  )
}
