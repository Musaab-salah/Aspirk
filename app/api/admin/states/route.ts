import { NextRequest, NextResponse } from 'next/server'
import { SUDANESE_CITIES } from '@/types'

// GET /api/admin/states - Get all states
export async function GET() {
  try {
    // Group cities by state
    const statesMap = new Map()
    
    SUDANESE_CITIES.forEach(city => {
      if (city.state && city.stateAr) {
        if (!statesMap.has(city.state)) {
          statesMap.set(city.state, {
            id: city.state,
            name: city.state,
            nameAr: city.stateAr,
            cities: [],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
        statesMap.get(city.state).cities.push(city)
      }
    })
    
    const states = Array.from(statesMap.values())
    
    return NextResponse.json({
      success: true,
      data: states
    })
  } catch (error) {
    console.error('Error fetching states:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch states' },
      { status: 500 }
    )
  }
}

// POST /api/admin/states - Create new state
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, nameAr, isActive = true } = body

    // Validate required fields
    if (!name || !nameAr) {
      return NextResponse.json(
        { success: false, error: 'Name and Arabic name are required' },
        { status: 400 }
      )
    }

    // In a real app, you would save to database
    const newState = {
      id: `state-${Date.now()}`,
      name,
      nameAr,
      cities: [],
      isActive,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      data: newState,
      message: 'State created successfully'
    })
  } catch (error) {
    console.error('Error creating state:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create state' },
      { status: 500 }
    )
  }
}

