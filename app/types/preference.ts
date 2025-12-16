export interface ArtworkPreference {
  artworkId: string
  artworkTitle: string
  artist: string
  timestamp: Date
  rating?: number // 1-5
  notes?: string
}

export interface ArtistPreference {
  artistId: string
  artistName: string
  timestamp: Date
  artworks: string[] // Artwork IDs
}

export interface EpochPreference {
  epochId: string
  epochName: string
  timestamp: Date
  artworks: string[] // Artwork IDs
}

export interface UserPreferences {
  artworks: ArtworkPreference[]
  artists: ArtistPreference[]
  epochs: EpochPreference[]
  lastUpdated: Date
}

export interface PreferenceRecommendation {
  type: 'artwork' | 'artist' | 'epoch' | 'course'
  id: string
  title: string
  reason: string
  confidence: number // 0-1
}


