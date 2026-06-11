import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ZESTIFY | Financial Intelligence',
  description: 'AI-Powered Personal Finance & Investment Intelligence Platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  )
}
