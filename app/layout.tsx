import type { Metadata } from 'next'
import './styles/globals.css'

export const metadata: Metadata = {
  title: 'Genow — Made by Humans',
  description: 'The timeless craft of art, wine, design, and technology. In the age of AI, the human hand is the real story.',
  openGraph: {
    title: 'Genow — Made by Humans',
    description: 'The timeless craft of art, wine, design, and technology. In the age of AI, the human hand is the real story.',
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
