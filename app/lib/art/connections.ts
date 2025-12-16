import type { Connection, Artwork } from '@/app/types/course'

// Sample artworks for exploration
export const sampleArtworks: Artwork[] = [
  {
    id: 'matisse-red-studio',
    title: 'The Red Studio',
    artist: 'Henri Matisse',
    year: 1911,
    imageUrl: 'https://images.metmuseum.org/CRDImages/ep/original/DT1967.jpg',
    description: 'A revolutionary work where Matisse unified space through color, creating a new visual language that would influence generations of artists.',
    epoch: 'Modernism',
    medium: 'Oil on canvas',
    dimensions: '71 1/4 x 86 1/4 in. (181 x 219.1 cm)',
    location: 'Museum of Modern Art, New York',
  },
  {
    id: 'rothko-no-14',
    title: 'No. 14',
    artist: 'Mark Rothko',
    year: 1960,
    imageUrl: 'https://www.sfmoma.org/wp-content/uploads/2017/06/60.16.jpg',
    description: 'Rothko\'s color field paintings, inspired by Matisse\'s use of color as emotional expression, create meditative spaces of pure feeling.',
    epoch: 'Modernism',
    medium: 'Oil on canvas',
    dimensions: '114 1/2 x 105 5/8 in. (290.8 x 268.3 cm)',
    location: 'San Francisco Museum of Modern Art',
  },
  {
    id: 'monet-water-lilies',
    title: 'Water Lilies',
    artist: 'Claude Monet',
    year: 1919,
    imageUrl: 'https://www.metmuseum.org/toah/images/hb/hb_1983.532.jpg',
    description: 'Monet\'s late works capture the fleeting effects of light and atmosphere, dissolving form into pure sensation.',
    epoch: 'Impressionism',
    medium: 'Oil on canvas',
    location: 'Metropolitan Museum of Art, New York',
  },
]

// Sample connections
export const sampleConnections: Connection[] = [
  {
    id: 'matisse-rothko',
    from: 'matisse-red-studio',
    to: 'rothko-no-14',
    type: 'influenced',
    story: 'Matisse\'s revolutionary use of color as the primary means of expression in "The Red Studio" deeply influenced Rothko. Rothko saw in Matisse\'s work the power of color to evoke emotion directly, without narrative or representation. This insight led Rothko to develop his color field paintings, where large blocks of color create meditative, emotional experiences.',
    strength: 0.9,
  },
]

export function getConnectionsForArtwork(artworkId: string): Connection[] {
  return sampleConnections.filter(
    (c) => c.from === artworkId || c.to === artworkId
  )
}

export function getArtworkById(id: string): Artwork | undefined {
  return sampleArtworks.find((a) => a.id === id)
}


