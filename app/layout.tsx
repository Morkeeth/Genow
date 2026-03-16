import type { Metadata } from 'next'
import './styles/globals.css'

export const metadata: Metadata = {
  title: 'Genow — Learn Art, Wine & Elegance',
  description: 'Micro-learning that makes you more cultured, one swipe at a time. Art, wine, design, philosophy.',
  openGraph: {
    title: 'Genow — Learn Art, Wine & Elegance',
    description: 'Micro-learning that makes you more cultured, one swipe at a time.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-black text-white selection:bg-white/20">
        {children}
      </body>
    </html>
  )
}
