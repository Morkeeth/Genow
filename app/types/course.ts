export interface Artwork {
  id: string
  title: string
  artist: string
  year: number
  imageUrl: string
  description: string
  epoch: string
  medium?: string
  dimensions?: string
  location?: string
}

export interface DeepDive {
  id: string
  title: string
  content: string
  artworks?: string[]
}

export interface Lesson {
  id: string
  title: string
  content: string // Poetic/philosophical text
  artworks: string[] // Artwork IDs
  deepDives?: DeepDive[]
  order: number
}

export interface Connection {
  id: string
  from: string // Artist/artwork ID
  to: string
  type: 'influenced' | 'contemporary' | 'movement' | 'inspired'
  story: string // LLM-generated narrative
  strength?: number // 0-1, for visualization
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  epoch: string
  lessons: Lesson[]
  artworks: Artwork[]
  connections: Connection[]
  generatedAt: Date
  tags?: string[]
}


