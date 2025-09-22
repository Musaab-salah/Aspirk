import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_DELIVERY_COSTS, SUDANESE_CITIES, type DeliveryCost } from '@/types'

// In-memory storage for demo purposes
// In production, this would be replaced with database operations
let deliveryCosts = [...DEFAULT_DELIVERY_COSTS]

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const costId = params.id
    const body = await request.json()
    const { cost, estimatedDays, freeShippingThreshold, active } = body

    // Find the delivery cost
    const costIndex = deliveryCosts.findIndex(dc => dc.id === costId)
    if (costIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Delivery cost not found' 
        },
        { status: 404 }
      )
    }

    // Validation
    if (cost !== undefined && cost < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cost must be a positive number' 
        },
        { status: 400 }
      )
    }

    if (estimatedDays !== undefined && estimatedDays < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Estimated days must be a positive number' 
        },
        { status: 400 }
      )
    }

    if (freeShippingThreshold !== undefined && freeShippingThreshold !== null && freeShippingThreshold < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Free shipping threshold must be a positive number' 
        },
        { status: 400 }
      )
    }

    // Update the delivery cost
    const updatedDeliveryCost: DeliveryCost = {
      ...deliveryCosts[costIndex],
      cost: cost !== undefined ? Number(cost) : deliveryCosts[costIndex].cost,
      estimatedDays: estimatedDays !== undefined ? Number(estimatedDays) : deliveryCosts[costIndex].estimatedDays,
      freeShippingThreshold: freeShippingThreshold !== undefined ? 
        (freeShippingThreshold ? Number(freeShippingThreshold) : undefined) : 
        deliveryCosts[costIndex].freeShippingThreshold,
      active: active !== undefined ? active : deliveryCosts[costIndex].active,
      updatedAt: new Date()
    }

    deliveryCosts[costIndex] = updatedDeliveryCost

    // Include city information in response
    const city = SUDANESE_CITIES.find(c => c.id === updatedDeliveryCost.cityId)

    return NextResponse.json({
      success: true,
      data: {
        ...updatedDeliveryCost,
        city
      },
      message: 'Delivery cost updated successfully'
    })

  } catch (error) {
    console.error('Error updating delivery cost:', error)
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
    const costId = params.id

    // Find the delivery cost
    const costIndex = deliveryCosts.findIndex(dc => dc.id === costId)
    if (costIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Delivery cost not found' 
        },
        { status: 404 }
      )
    }

    // Soft delete (deactivate) the delivery cost
    deliveryCosts[costIndex] = {
      ...deliveryCosts[costIndex],
      active: false,
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      message: 'Delivery cost deactivated successfully'
    })

  } catch (error) {
    console.error('Error deleting delivery cost:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}