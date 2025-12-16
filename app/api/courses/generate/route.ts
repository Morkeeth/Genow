import { NextRequest, NextResponse } from 'next/server'
import { generateCourse } from '@/app/lib/llm/courseGenerator'
import type { CourseGenerationParams } from '@/app/lib/llm/promptTemplates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const params: CourseGenerationParams = {
      topic: body.topic,
      artist: body.artist,
      epoch: body.epoch,
      depth: body.depth || 'intermediate',
      focus: body.focus,
    }

    const course = await generateCourse(params)
    
    return NextResponse.json(course, { status: 200 })
  } catch (error) {
    console.error('Error in course generation API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate course' },
      { status: 500 }
    )
  }
}


