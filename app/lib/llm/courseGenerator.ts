import OpenAI from 'openai'
import type { Course } from '@/app/types/course'
import { generateCoursePrompt, type CourseGenerationParams } from './promptTemplates'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function generateCourse(params: CourseGenerationParams): Promise<Course> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  const prompt = generateCoursePrompt(params)

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a poetic art historian and philosopher. You create inspiring, emotionally engaging courses about art appreciation. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    const courseData = JSON.parse(content)
    
    // Transform to match our Course type
    const course: Course = {
      id: `course-${Date.now()}`,
      slug: courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: courseData.title,
      description: courseData.description,
      epoch: courseData.epoch,
      lessons: courseData.lessons.map((lesson: any, index: number) => ({
        ...lesson,
        order: lesson.order || index + 1,
        artworks: lesson.artworks || [],
        deepDives: lesson.deepDives || [],
      })),
      artworks: courseData.artworks || [],
      connections: courseData.connections || [],
      generatedAt: new Date(),
      tags: courseData.tags || [],
    }

    return course
  } catch (error) {
    console.error('Error generating course:', error)
    throw error
  }
}

export async function generateEpochStory(epochName: string, context: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return 'Epoch story generation requires OpenAI API key.'
  }

  const { generateEpochStoryPrompt } = await import('./promptTemplates')
  const prompt = generateEpochStoryPrompt(epochName, context)

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a poetic art historian. Write beautiful, inspiring narratives about art epochs.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    })

    return completion.choices[0]?.message?.content || 'Unable to generate story.'
  } catch (error) {
    console.error('Error generating epoch story:', error)
    return 'Unable to generate story at this time.'
  }
}


