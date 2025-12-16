import type { Epoch } from '@/app/types/epoch'

export const epochs: Epoch[] = [
  {
    id: 'renaissance',
    name: 'Renaissance',
    startYear: 1400,
    endYear: 1600,
    description: 'The rebirth of classical learning and artistic achievement',
    keyArtists: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Botticelli'],
    movements: ['Italian Renaissance', 'Northern Renaissance'],
    culturalContext: 'A period of renewed interest in classical antiquity, humanism, and scientific discovery',
    color: '#8B4513',
  },
  {
    id: 'baroque',
    name: 'Baroque',
    startYear: 1600,
    endYear: 1750,
    description: 'Dramatic, emotional, and ornate artistic expression',
    keyArtists: ['Caravaggio', 'Rembrandt', 'Rubens', 'Vermeer'],
    movements: ['Italian Baroque', 'Dutch Golden Age'],
    culturalContext: 'A time of religious conflict, scientific revolution, and absolute monarchy',
    color: '#4A4A4A',
  },
  {
    id: 'impressionism',
    name: 'Impressionism',
    startYear: 1860,
    endYear: 1890,
    description: 'Capturing the fleeting effects of light and color',
    keyArtists: ['Monet', 'Renoir', 'Degas', 'Pissarro'],
    movements: ['French Impressionism', 'Post-Impressionism'],
    culturalContext: 'Modern urban life, leisure, and the changing landscape of industrial Europe',
    color: '#87CEEB',
  },
  {
    id: 'modernism',
    name: 'Modernism',
    startYear: 1890,
    endYear: 1970,
    description: 'Breaking from tradition, exploring new forms and perspectives',
    keyArtists: ['Matisse', 'Picasso', 'Rothko', 'Pollock'],
    movements: ['Fauvism', 'Cubism', 'Abstract Expressionism', 'Color Field'],
    culturalContext: 'Rapid industrialization, world wars, and the search for new meaning in art',
    color: '#FF6347',
  },
  {
    id: 'contemporary',
    name: 'Contemporary',
    startYear: 1970,
    endYear: 2024,
    description: 'Diverse artistic practices reflecting our complex world',
    keyArtists: ['Banksy', 'Ai Weiwei', 'Yayoi Kusama', 'Damien Hirst'],
    movements: ['Conceptual Art', 'Street Art', 'Digital Art', 'Installation Art'],
    culturalContext: 'Globalization, digital revolution, and questioning of traditional art forms',
    color: '#9370DB',
  },
]

export function getEpochById(id: string): Epoch | undefined {
  return epochs.find((e) => e.id === id)
}

export function getEpochsByYear(year: number): Epoch[] {
  return epochs.filter((e) => year >= e.startYear && year <= e.endYear)
}


