import type { Artwork } from '@/app/types/course'
import { sampleArtworks } from './connections'
import { sampleCourse } from './sampleCourses'

export function getAllArtworks(): Artwork[] {
  // Combine artworks from sample course and sample artworks
  const courseArtworks = sampleCourse.artworks || []
  const allArtworks = [...sampleArtworks, ...courseArtworks]
  
  // Remove duplicates by ID
  const uniqueArtworks = allArtworks.reduce((acc, artwork) => {
    if (!acc.find(a => a.id === artwork.id)) {
      acc.push(artwork)
    }
    return acc
  }, [] as Artwork[])
  
  return uniqueArtworks
}

