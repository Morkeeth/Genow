import type {
  UserPreferences,
  ArtworkPreference,
  ArtistPreference,
  EpochPreference,
  PreferenceRecommendation,
} from '@/app/types/preference'

const STORAGE_KEY = 'art-app-preferences'

export function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return {
      artworks: [],
      artists: [],
      epochs: [],
      lastUpdated: new Date(),
    }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...parsed,
        artworks: parsed.artworks.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        })),
        artists: parsed.artists.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        })),
        epochs: parsed.epochs.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        })),
        lastUpdated: new Date(parsed.lastUpdated),
      }
    }
  } catch (error) {
    console.error('Error loading preferences:', error)
  }

  return {
    artworks: [],
    artists: [],
    epochs: [],
    lastUpdated: new Date(),
  }
}

export function savePreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') return

  try {
    preferences.lastUpdated = new Date()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch (error) {
    console.error('Error saving preferences:', error)
  }
}

export function addArtworkPreference(
  artworkId: string,
  artworkTitle: string,
  artist: string,
  rating?: number,
  notes?: string
): void {
  const preferences = loadPreferences()
  
  // Remove existing preference for this artwork
  preferences.artworks = preferences.artworks.filter(
    (a) => a.artworkId !== artworkId
  )

  // Add new preference
  const preference: ArtworkPreference = {
    artworkId,
    artworkTitle,
    artist,
    timestamp: new Date(),
    rating,
    notes,
  }

  preferences.artworks.push(preference)
  savePreferences(preferences)
}

export function removeArtworkPreference(artworkId: string): void {
  const preferences = loadPreferences()
  preferences.artworks = preferences.artworks.filter(
    (a) => a.artworkId !== artworkId
  )
  savePreferences(preferences)
}

export function addArtistPreference(
  artistId: string,
  artistName: string,
  artworks: string[] = []
): void {
  const preferences = loadPreferences()
  
  // Remove existing preference
  preferences.artists = preferences.artists.filter(
    (a) => a.artistId !== artistId
  )

  const preference: ArtistPreference = {
    artistId,
    artistName,
    timestamp: new Date(),
    artworks,
  }

  preferences.artists.push(preference)
  savePreferences(preferences)
}

export function addEpochPreference(
  epochId: string,
  epochName: string,
  artworks: string[] = []
): void {
  const preferences = loadPreferences()
  
  preferences.epochs = preferences.epochs.filter((e) => e.epochId !== epochId)

  const preference: EpochPreference = {
    epochId,
    epochName,
    timestamp: new Date(),
    artworks,
  }

  preferences.epochs.push(preference)
  savePreferences(preferences)
}

export function generateRecommendations(
  preferences: UserPreferences
): PreferenceRecommendation[] {
  const recommendations: PreferenceRecommendation[] = []

  // Analyze artwork preferences
  const artworkCounts: Record<string, number> = {}
  preferences.artworks.forEach((a) => {
    artworkCounts[a.artist] = (artworkCounts[a.artist] || 0) + 1
  })

  // Recommend artists based on liked artworks
  Object.entries(artworkCounts).forEach(([artist, count]) => {
    if (count >= 2) {
      recommendations.push({
        type: 'artist',
        id: artist.toLowerCase().replace(/\s+/g, '-'),
        title: artist,
        reason: `You've liked ${count} artworks by this artist`,
        confidence: Math.min(count / 5, 1),
      })
    }
  })

  // Recommend epochs based on preferred artworks
  const epochCounts: Record<string, number> = {}
  preferences.artworks.forEach((a) => {
    // This would need epoch data from artworks
    // For now, placeholder logic
  })

  return recommendations.sort((a, b) => b.confidence - a.confidence)
}

export function clearPreferences(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}


