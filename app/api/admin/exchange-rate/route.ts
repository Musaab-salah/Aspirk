import { NextRequest, NextResponse } from 'next/server'
import { ExchangeRateConfig, validateExchangeRate } from '@/types'
import { updateExchangeRate } from '../spare-parts/route'

// Mock storage - in real app this would be in a database
let exchangeRateConfig: ExchangeRateConfig = {
  id: '1',
  aedToSdg: 30, // Default exchange rate: 1 AED = 30 SDG
  lastUpdated: new Date(),
  updatedBy: 'admin'
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: exchangeRateConfig
    })
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exchange rate' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { aedToSdg, updatedBy } = body

    // Validate the exchange rate
    const validation = validateExchangeRate(aedToSdg)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error 
        },
        { status: 400 }
      )
    }

    // Update the exchange rate
    exchangeRateConfig = {
      id: exchangeRateConfig.id,
      aedToSdg,
      lastUpdated: new Date(),
      updatedBy: updatedBy || 'admin'
    }

    // Update all spare parts with new SDG prices
    updateExchangeRate(aedToSdg)

    return NextResponse.json({
      success: true,
      data: exchangeRateConfig,
      message: 'Exchange rate updated successfully'
    })
  } catch (error) {
    console.error('Error updating exchange rate:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update exchange rate' },
      { status: 500 }
    )
  }
}
