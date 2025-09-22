import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_DELIVERY_COSTS, SUDANESE_CITIES, type DeliveryCost } from '@/types'

// In-memory storage for demo purposes
// In production, this would be replaced with database operations
let deliveryCosts = [...DEFAULT_DELIVERY_COSTS]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cityId = searchParams.get('cityId')
    const method = searchParams.get('method') as 'land' | 'sea' | null
    const includeInactive = searchParams.get('includeInactive') === 'true'

    let filteredCosts = includeInactive ? deliveryCosts : deliveryCosts.filter(cost => cost.active)

    // Filter by city if specified
    if (cityId) {
      filteredCosts = filteredCosts.filter(cost => cost.cityId === cityId)
    }

    // Filter by method if specified
    if (method) {
      filteredCosts = filteredCosts.filter(cost => cost.method === method)
    }

    // Include city information
    const costsWithCityInfo = filteredCosts.map(cost => {
      const city = SUDANESE_CITIES.find(c => c.id === cost.cityId)
      return {
        ...cost,
        city
      }
    })

    return NextResponse.json({
      success: true,
      data: costsWithCityInfo,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cityId, method, cost, estimatedDays, freeShippingThreshold } = body

    // Validation
    if (!cityId || !method || cost === undefined || estimatedDays === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'City ID, method, cost, and estimated days are required' 
        },
        { status: 400 }
      )
    }

    // Validate method
    if (!['land', 'sea'].includes(method)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Method must be either "land" or "sea"' 
        },
        { status: 400 }
      )
    }

    // Validate city exists
    const city = SUDANESE_CITIES.find(c => c.id === cityId)
    if (!city) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid city ID' 
        },
        { status: 400 }
      )
    }

    // Validate numeric values
    if (cost < 0 || estimatedDays < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cost and estimated days must be positive numbers' 
        },
        { status: 400 }
      )
    }

    // Check for duplicate (same city and method)
    const existingCost = deliveryCosts.find(
      dc => dc.cityId === cityId && dc.method === method && dc.active
    )

    if (existingCost) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Delivery cost for this city and method already exists' 
        },
        { status: 400 }
      )
    }

    // Generate new ID
    const newId = (Math.max(...deliveryCosts.map(dc => parseInt(dc.id))) + 1).toString()

    const newDeliveryCost: DeliveryCost = {
      id: newId,
      cityId,
      method,
      cost: Number(cost),
      estimatedDays: Number(estimatedDays),
      freeShippingThreshold: freeShippingThreshold ? Number(freeShippingThreshold) : undefined,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    deliveryCosts.push(newDeliveryCost)

    return NextResponse.json({
      success: true,
      data: {
        ...newDeliveryCost,
        city
      },
      message: 'Delivery cost created successfully'
    })

  } catch (error) {
    console.error('Error creating delivery cost:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}