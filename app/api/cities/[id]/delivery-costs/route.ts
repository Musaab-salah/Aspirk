import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_DELIVERY_COSTS, SUDANESE_CITIES } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cityId = params.id

    // Check if city exists
    const city = SUDANESE_CITIES.find(c => c.id === cityId)
    if (!city) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'City not found' 
        },
        { status: 404 }
      )
    }

    // Get delivery costs for the city
    const deliveryCosts = DEFAULT_DELIVERY_COSTS.filter(
      cost => cost.cityId === cityId && cost.active
    )

    return NextResponse.json({
      success: true,
      data: {
        city,
        deliveryCosts
      },
      message: 'Delivery costs retrieved successfully'
    })

  } catch (error) {
    console.error('Error fetching delivery costs:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}