export interface Epoch {
  id: string
  name: string
  startYear: number
  endYear: number
  description: string
  keyArtists: string[]
  movements: string[]
  culturalContext: string
  story?: string // LLM-generated narrative
  color?: string // Color palette for the epoch
  imageUrl?: string
}

export interface ArtMovement {
  id: string
  name: string
  epoch: string
  startYear: number
  endYear: number
  description: string
  keyArtists: string[]
  characteristics: string[]
}


