import { NextRequest, NextResponse } from 'next/server'
import {
  loadPreferences,
  savePreferences,
  addArtworkPreference,
  removeArtworkPreference,
  addArtistPreference,
  addEpochPreference,
  generateRecommendations,
  clearPreferences,
} from '@/app/lib/preferences/storage'

export async function GET() {
  try {
    const preferences = loadPreferences()
    const recommendations = generateRecommendations(preferences)
    
    return NextResponse.json({
      preferences,
      recommendations,
    })
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'add-artwork':
        addArtworkPreference(
          data.artworkId,
          data.artworkTitle,
          data.artist,
          data.rating,
          data.notes
        )
        break
      case 'remove-artwork':
        removeArtworkPreference(data.artworkId)
        break
      case 'add-artist':
        addArtistPreference(data.artistId, data.artistName, data.artworks)
        break
      case 'add-epoch':
        addEpochPreference(data.epochId, data.epochName, data.artworks)
        break
      case 'clear':
        clearPreferences()
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const preferences = loadPreferences()
    const recommendations = generateRecommendations(preferences)

    return NextResponse.json({
      success: true,
      preferences,
      recommendations,
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}


