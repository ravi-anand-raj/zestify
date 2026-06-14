import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zestify | Financial Intelligence',
  description: 'AI-Powered Personal Finance & Investment Intelligence Platform.',
  keywords: ['finance', 'investment', 'AI', 'portfolio', 'wealth management'],
  authors: [{ name: 'Zestify' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#050508" />
      </head>
      <body className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground font-sans antialiased">
        <ThemeProvider defaultTheme="dark">
          <AuthProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
