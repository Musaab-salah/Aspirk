import { ExchangeRateConfig, calculateSDGPrice } from '@/types'

// Mock storage - in real app this would be in a database
let exchangeRateConfig: ExchangeRateConfig = {
  id: '1',
  aedToSdg: 30, // Default exchange rate: 1 AED = 30 SDG
  lastUpdated: new Date(),
  updatedBy: 'admin'
}

// Helper function to get current exchange rate
export function getCurrentExchangeRate(): number {
  return exchangeRateConfig.aedToSdg
}

// Function to update exchange rate
export function updateExchangeRate(newRate: number) {
  exchangeRateConfig = {
    id: exchangeRateConfig.id,
    aedToSdg: newRate,
    lastUpdated: new Date(),
    updatedBy: 'admin'
  }
  return exchangeRateConfig
}

// Function to get exchange rate config
export function getExchangeRateConfig(): ExchangeRateConfig {
  return exchangeRateConfig
}

// Helper function to update SDG prices based on current exchange rate
export function updateSDGPrices(part: any): any {
  const exchangeRate = getCurrentExchangeRate()
  
  return {
    ...part,
    prices: {
      original: {
        aed: part.prices.original.aed,
        sdg: calculateSDGPrice(part.prices.original.aed, exchangeRate),
        usd: part.prices.original.usd
      },
      commercial: {
        aed: part.prices.commercial.aed,
        sdg: calculateSDGPrice(part.prices.commercial.aed, exchangeRate),
        usd: part.prices.commercial.usd
      }
    }
  }
}
