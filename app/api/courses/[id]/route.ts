import { NextRequest, NextResponse } from 'next/server'

// In a real app, this would fetch from a database
// For now, we'll use a simple in-memory store or generate on demand
const courseCache = new Map<string, any>()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id
    
    // Check cache first
    if (courseCache.has(courseId)) {
      return NextResponse.json(courseCache.get(courseId))
    }

    // In a real app, fetch from database
    // For now, return 404
    return NextResponse.json(
      { error: 'Course not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}


