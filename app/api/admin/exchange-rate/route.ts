import { NextRequest, NextResponse } from 'next/server'
import { validateExchangeRate } from '@/types'
import { getExchangeRateConfig, updateExchangeRate } from '@/utils/exchangeRateUtils'

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: getExchangeRateConfig()
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
    const updatedConfig = updateExchangeRate(aedToSdg)

    return NextResponse.json({
      success: true,
      data: updatedConfig,
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
