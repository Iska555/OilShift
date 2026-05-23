import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'OilShift - Azerbaijan Economic Divergence Intelligence Platform',
  description: 'Machine-learning analysis of the oil-to-non-oil GDP structural transition, 2026–2050',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-white text-[#1A1A1A] antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
