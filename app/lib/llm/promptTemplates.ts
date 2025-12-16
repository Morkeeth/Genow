import type { Course } from '@/app/types/course'

export interface CourseGenerationParams {
  topic?: string
  artist?: string
  epoch?: string
  depth?: 'intro' | 'intermediate' | 'deep'
  focus?: string
}

export const generateCoursePrompt = (params: CourseGenerationParams): string => {
  const { topic, artist, epoch, depth = 'intermediate', focus } = params
  
  let prompt = `You are a poetic art historian and philosopher, creating an inspiring course about art appreciation. 

Generate a comprehensive course that helps people discover their personal resonance with art. The course should be philosophical, poetic, and emotionally engaging.

`

  if (topic) {
    prompt += `Topic: ${topic}\n`
  }
  if (artist) {
    prompt += `Focus Artist: ${artist}\n`
  }
  if (epoch) {
    prompt += `Epoch: ${epoch}\n`
  }
  if (focus) {
    prompt += `Special Focus: ${focus}\n`
  }

  prompt += `
Depth Level: ${depth}

Please generate a course in the following JSON format:
{
  "title": "Course title (poetic and inspiring)",
  "description": "A philosophical description of what this course offers",
  "epoch": "epoch name",
  "lessons": [
    {
      "id": "unique-id",
      "title": "Lesson title",
      "content": "Poetic, philosophical content that helps readers understand and feel the art. Write in a reflective, inspiring tone. Include historical context, emotional resonance, and personal reflection prompts.",
      "artworks": ["artwork-id-1", "artwork-id-2"],
      "order": 1
    }
  ],
  "artworks": [
    {
      "id": "unique-id",
      "title": "Artwork title",
      "artist": "Artist name",
      "year": 1911,
      "imageUrl": "URL or description of where to find image",
      "description": "Poetic description of the artwork, its emotional impact, and why it matters",
      "epoch": "epoch name",
      "medium": "medium used",
      "dimensions": "dimensions if known",
      "location": "museum or collection location"
    }
  ],
  "connections": [
    {
      "id": "unique-id",
      "from": "artist-or-artwork-id",
      "to": "artist-or-artwork-id",
      "type": "influenced|contemporary|movement|inspired",
      "story": "A poetic narrative about how these artists/works connect. Tell the story of influence, inspiration, or shared vision.",
      "strength": 0.8
    }
  ],
  "tags": ["relevant", "tags"]
}

Important guidelines:
- Write in a poetic, philosophical style that evokes emotion
- Help readers understand not just facts, but the feeling and meaning of art
- Include personal reflection questions
- Make connections between artists and movements clear and meaningful
- Each lesson should build understanding progressively
- Artworks should be described in ways that help readers see and feel them
- Connections should tell stories, not just list facts

Generate the course now:`

  return prompt
}

export const generateEpochStoryPrompt = (epochName: string, context: string): string => {
  return `You are a poetic art historian. Write a beautiful, inspiring narrative about the ${epochName} epoch in art history.

Context: ${context}

Write a story that:
- Captures the spirit and emotion of this epoch
- Explains why it matters culturally and artistically
- Helps readers understand the human experience behind the art
- Is poetic and evocative, not just factual
- Connects the art to broader cultural movements

Write 3-4 paragraphs in a reflective, inspiring tone.`
}

export const generateArtworkDescriptionPrompt = (artwork: {
  title: string
  artist: string
  year: number
}): string => {
  return `You are a poetic art critic. Write a beautiful, emotional description of ${artwork.artist}'s "${artwork.title}" (${artwork.year}).

Write in a way that:
- Helps someone truly see and feel the artwork
- Explains the emotional impact and meaning
- Connects to the artist's vision and the cultural moment
- Is poetic and inspiring, not just descriptive
- Invites personal reflection

Write 2-3 paragraphs.`
}


