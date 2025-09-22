import { NextRequest, NextResponse } from 'next/server'
import { SUDANESE_CITIES, type SudaneseCity } from '@/types'

// In-memory storage for demo purposes
// In production, this would be replaced with database operations
let cities = [...SUDANESE_CITIES]

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cityId = params.id
    const body = await request.json()
    const { name, nameAr, state, stateAr, active } = body

    // Find the city
    const cityIndex = cities.findIndex(c => c.id === cityId)
    if (cityIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'City not found' 
        },
        { status: 404 }
      )
    }

    // Validation
    if (!name || !nameAr) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name and Arabic name are required' 
        },
        { status: 400 }
      )
    }

    // Check for duplicate names (excluding current city)
    const existingCity = cities.find(
      city => city.id !== cityId && (
        city.name.toLowerCase() === name.toLowerCase() || 
        city.nameAr === nameAr
      )
    )

    if (existingCity) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'City with this name already exists' 
        },
        { status: 400 }
      )
    }

    // Update the city
    const updatedCity: SudaneseCity = {
      ...cities[cityIndex],
      name: name.trim(),
      nameAr: nameAr.trim(),
      state: state?.trim(),
      stateAr: stateAr?.trim(),
      active: active !== undefined ? active : cities[cityIndex].active
    }

    cities[cityIndex] = updatedCity

    return NextResponse.json({
      success: true,
      data: updatedCity,
      message: 'City updated successfully'
    })

  } catch (error) {
    console.error('Error updating city:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cityId = params.id

    // Find the city
    const cityIndex = cities.findIndex(c => c.id === cityId)
    if (cityIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'City not found' 
        },
        { status: 404 }
      )
    }

    // Soft delete (deactivate) the city
    cities[cityIndex] = {
      ...cities[cityIndex],
      active: false
    }

    return NextResponse.json({
      success: true,
      message: 'City deactivated successfully'
    })

  } catch (error) {
    console.error('Error deleting city:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}