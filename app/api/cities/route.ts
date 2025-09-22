import { NextRequest, NextResponse } from 'next/server'
import { SUDANESE_CITIES, DEFAULT_DELIVERY_COSTS } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeCosts = searchParams.get('includeCosts') === 'true'

    // Get only active cities
    const activeCities = SUDANESE_CITIES.filter(city => city.active)

    if (includeCosts) {
      // Include delivery costs for each city
      const citiesWithCosts = activeCities.map(city => {
        const deliveryCosts = DEFAULT_DELIVERY_COSTS.filter(
          cost => cost.cityId === city.id && cost.active
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
      data: activeCities,
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