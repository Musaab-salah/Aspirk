import { NextRequest, NextResponse } from 'next/server'
import { SUDANESE_CITIES, DEFAULT_DELIVERY_COSTS, type SudaneseCity } from '@/types'

// In-memory storage for demo purposes
// In production, this would be replaced with database operations
let cities = [...SUDANESE_CITIES]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeCosts = searchParams.get('includeCosts') === 'true'
    const includeInactive = searchParams.get('includeInactive') === 'true'

    let filteredCities = includeInactive ? cities : cities.filter(city => city.active)

    if (includeCosts) {
      // Include delivery costs for each city
      const citiesWithCosts = filteredCities.map(city => {
        const deliveryCosts = DEFAULT_DELIVERY_COSTS.filter(
          cost => cost.cityId === city.id
        )
        
        return {
          ...city,
          deliveryCosts
        }
      })

      return NextResponse.json({
        success: true,
        data: citiesWithCosts,
        message: 'Cities with delivery costs retrieved successfully'
      })
    }

    return NextResponse.json({
      success: true,
      data: filteredCities,
      message: 'Cities retrieved successfully'
    })

  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, nameAr, state, stateAr } = body

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

    // Check for duplicate names
    const existingCity = cities.find(
      city => city.name.toLowerCase() === name.toLowerCase() || 
               city.nameAr === nameAr
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

    // Generate new ID
    const newId = (Math.max(...cities.map(c => parseInt(c.id))) + 1).toString()

    const newCity: SudaneseCity = {
      id: newId,
      name: name.trim(),
      nameAr: nameAr.trim(),
      active: true,
      state: state?.trim(),
      stateAr: stateAr?.trim()
    }

    cities.push(newCity)

    return NextResponse.json({
      success: true,
      data: newCity,
      message: 'City created successfully'
    })

  } catch (error) {
    console.error('Error creating city:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}