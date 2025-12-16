'use client'

interface PoeticTextProps {
  text: string
  className?: string
}

export default function PoeticText({ text, className = '' }: PoeticTextProps) {
  // Split text into paragraphs and render with poetic styling
  const paragraphs = text.split('\n\n').filter((p) => p.trim())

  return (
    <div className={`poetic-text ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200">
          {paragraph}
        </p>
      ))}
    </div>
  )
}


