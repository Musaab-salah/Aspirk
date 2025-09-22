import { NextRequest, NextResponse } from 'next/server'
import { SparePart, calculateSDGPrice } from '@/types'
import { getCurrentExchangeRate, updateSDGPrices } from '@/utils/exchangeRateUtils'

// Mock database - in real app this would be a proper database
let spareParts: SparePart[] = [
  {
    id: '1',
    partNumber: 'ENG-123456',
    name: 'Oil Filter',
    nameAr: 'فلتر الزيت',
    description: 'High quality oil filter',
    descriptionAr: 'فلتر زيت عالي الجودة',
    image: '/images/air-filter.svg',
    category: 'Engine Parts',
    categoryAr: 'قطع المحرك',
    compatibleCars: ['1', '2', '3'],
    prices: {
      original: { aed: 65, sdg: 1950, usd: 18 },
      commercial: { aed: 45, sdg: 1350, usd: 12 }
    },
    isAvailable: true,
    countryOfOrigin: 'JP',
  },
  {
    id: '2',
    partNumber: 'BRA-789012',
    name: 'Brake Pads',
    nameAr: 'بطانات الفرامل',
    description: 'Premium brake pads',
    descriptionAr: 'بطانات فرامل مميزة',
    image: '/images/brake-pads.svg',
    category: 'Brake System',
    categoryAr: 'نظام الفرامل',
    compatibleCars: ['1', '2', '3'],
    prices: {
      original: { aed: 180, sdg: 5400, usd: 49 },
      commercial: { aed: 120, sdg: 3600, usd: 33 }
    },
    isAvailable: true,
    countryOfOrigin: 'DE',
  },
]

// Function to update exchange rate (called from exchange-rate API)
export function updateExchangeRate(newRate: number) {
  // Update all existing spare parts with new SDG prices
  spareParts.forEach(part => {
    part.prices.original.sdg = calculateSDGPrice(part.prices.original.aed, newRate)
    part.prices.commercial.sdg = calculateSDGPrice(part.prices.commercial.aed, newRate)
  })
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: spareParts
    })
  } catch (error) {
    console.error('Error fetching spare parts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch spare parts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      partNumber, 
      name, 
      nameAr, 
      description, 
      descriptionAr, 
      image, 
      category, 
      categoryAr, 
      compatibleCars, 
      originalPriceAed, 
      commercialPriceAed, 
      countryOfOrigin 
    } = body

    // Validation
    if (!partNumber || !name || !nameAr || !category || !categoryAr) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!originalPriceAed || !commercialPriceAed || originalPriceAed <= 0 || commercialPriceAed <= 0) {
      return NextResponse.json(
        { success: false, error: 'Prices must be greater than 0' },
        { status: 400 }
      )
    }

    // Check if part number already exists
    if (spareParts.some(part => part.partNumber === partNumber)) {
      return NextResponse.json(
        { success: false, error: 'Part number already exists' },
        { status: 400 }
      )
    }

    // Create new spare part
    const newPart: Omit<SparePart, 'id'> = {
      partNumber,
      name,
      nameAr,
      description: description || '',
      descriptionAr: descriptionAr || '',
      image: image || '/images/default-part.svg',
      category,
      categoryAr,
      compatibleCars: compatibleCars || [],
      prices: {
        original: { aed: originalPriceAed, sdg: 0, usd: 0 },
        commercial: { aed: commercialPriceAed, sdg: 0, usd: 0 }
      },
      isAvailable: true,
      countryOfOrigin: countryOfOrigin || 'Unknown'
    }

    // Update SDG prices based on current exchange rate
    const partWithSDGPrices = updateSDGPrices(newPart)

    // Generate new ID
    const newId = `part-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const finalPart: SparePart = {
      id: newId,
      ...partWithSDGPrices
    }

    // Add to database
    spareParts.push(finalPart)

    return NextResponse.json({
      success: true,
      data: finalPart,
      message: 'Spare part created successfully'
    })
  } catch (error) {
    console.error('Error creating spare part:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create spare part' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      id,
      partNumber, 
      name, 
      nameAr, 
      description, 
      descriptionAr, 
      image, 
      category, 
      categoryAr, 
      compatibleCars, 
      originalPriceAed, 
      commercialPriceAed, 
      countryOfOrigin,
      isAvailable
    } = body

    // Validation
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Part ID is required' },
        { status: 400 }
      )
    }

    // Find the part to update
    const partIndex = spareParts.findIndex(part => part.id === id)
    if (partIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Spare part not found' },
        { status: 404 }
      )
    }

    // Check if part number already exists (excluding current part)
    if (spareParts.some(part => part.partNumber === partNumber && part.id !== id)) {
      return NextResponse.json(
        { success: false, error: 'Part number already exists' },
        { status: 400 }
      )
    }

    // Update the part
    const updatedPart: Omit<SparePart, 'id'> = {
      partNumber: partNumber || spareParts[partIndex].partNumber,
      name: name || spareParts[partIndex].name,
      nameAr: nameAr || spareParts[partIndex].nameAr,
      description: description !== undefined ? description : spareParts[partIndex].description,
      descriptionAr: descriptionAr !== undefined ? descriptionAr : spareParts[partIndex].descriptionAr,
      image: image || spareParts[partIndex].image,
      category: category || spareParts[partIndex].category,
      categoryAr: categoryAr || spareParts[partIndex].categoryAr,
      compatibleCars: compatibleCars || spareParts[partIndex].compatibleCars,
      prices: {
        original: { 
          aed: originalPriceAed || spareParts[partIndex].prices.original.aed, 
          sdg: 0, 
          usd: spareParts[partIndex].prices.original.usd 
        },
        commercial: { 
          aed: commercialPriceAed || spareParts[partIndex].prices.commercial.aed, 
          sdg: 0, 
          usd: spareParts[partIndex].prices.commercial.usd 
        }
      },
      isAvailable: isAvailable !== undefined ? isAvailable : spareParts[partIndex].isAvailable,
      countryOfOrigin: countryOfOrigin || spareParts[partIndex].countryOfOrigin
    }

    // Update SDG prices based on current exchange rate
    const partWithSDGPrices = updateSDGPrices(updatedPart)

    // Update in database
    spareParts[partIndex] = {
      id,
      ...partWithSDGPrices
    }

    return NextResponse.json({
      success: true,
      data: spareParts[partIndex],
      message: 'Spare part updated successfully'
    })
  } catch (error) {
    console.error('Error updating spare part:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update spare part' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Part ID is required' },
        { status: 400 }
      )
    }

    // Find and remove the part
    const partIndex = spareParts.findIndex(part => part.id === id)
    if (partIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Spare part not found' },
        { status: 404 }
      )
    }

    const deletedPart = spareParts[partIndex]
    spareParts.splice(partIndex, 1)

    return NextResponse.json({
      success: true,
      data: deletedPart,
      message: 'Spare part deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting spare part:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete spare part' },
      { status: 500 }
    )
  }
}
