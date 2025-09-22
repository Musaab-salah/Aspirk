import { NextRequest, NextResponse } from 'next/server'
import { SUDANESE_CITIES } from '@/types'

// PUT /api/admin/states/[id] - Update state
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, nameAr, isActive } = body
    const stateId = params.id

    // Validate required fields
    if (!name || !nameAr) {
      return NextResponse.json(
        { success: false, error: 'Name and Arabic name are required' },
        { status: 400 }
      )
    }

    // In a real app, you would update in database
    const updatedState = {
      id: stateId,
      name,
      nameAr,
      isActive,
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      data: updatedState,
      message: 'State updated successfully'
    })
  } catch (error) {
    console.error('Error updating state:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update state' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/states/[id] - Delete state
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stateId = params.id

    // In a real app, you would delete from database
    // Check if state has cities
    const stateCities = SUDANESE_CITIES.filter(city => city.state === stateId)
    
    if (stateCities.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete state with existing cities. Please remove all cities first.' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'State deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting state:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete state' },
      { status: 500 }
    )
  }
}
