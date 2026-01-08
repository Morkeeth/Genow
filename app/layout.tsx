import type { Metadata } from 'next'
import './styles/globals.css'

export const metadata: Metadata = {
  title: 'Genow - Art Appreciation',
  description: 'Discover art through courses, epochs, and personal preference. Find what truly resonates with you.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-black">{children}</body>
    </html>
  )
}

