import { NextResponse } from 'next/server'
import { SUDANESE_CITIES } from '@/types'

// GET /api/states - Get all states (public endpoint)
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
        statesMap.get(city.state).cities.push({
          id: city.id,
          name: city.name,
          nameAr: city.nameAr
        })
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
