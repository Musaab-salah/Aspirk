import { calculateSDGPrice } from '@/types'

/**
 * Utility functions for price formatting and display
 */

/**
 * Format price with currency symbol
 * @param amount - The price amount
 * @param currency - The currency code (AED, SDG, USD)
 * @param locale - The locale for formatting (default: 'ar-SA')
 * @returns Formatted price string
 */
export const formatPrice = (amount: number, currency: 'AED' | 'SDG' | 'USD', locale: string = 'ar-SA'): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  
  return formatter.format(amount)
}

/**
 * Format price with custom currency display
 * @param amount - The price amount
 * @param currency - The currency code
 * @returns Formatted price string with currency suffix
 */
export const formatPriceWithSuffix = (amount: number, currency: 'AED' | 'SDG' | 'USD'): string => {
  const formattedAmount = new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
  
  return `${formattedAmount} ${currency}`
}

/**
 * Get user-facing price in SDG from AED price
 * @param aedPrice - Price in AED
 * @param exchangeRate - AED to SDG exchange rate
 * @returns Price in SDG
 */
export const getUserPrice = (aedPrice: number, exchangeRate: number): number => {
  return calculateSDGPrice(aedPrice, exchangeRate)
}

/**
 * Format user-facing price (always in SDG)
 * @param aedPrice - Price in AED
 * @param exchangeRate - AED to SDG exchange rate
 * @returns Formatted SDG price string
 */
export const formatUserPrice = (aedPrice: number, exchangeRate: number): string => {
  const sdgPrice = getUserPrice(aedPrice, exchangeRate)
  return formatPriceWithSuffix(sdgPrice, 'SDG')
}

/**
 * Get admin-facing price in AED
 * @param aedPrice - Price in AED
 * @returns Formatted AED price string
 */
export const formatAdminPrice = (aedPrice: number): string => {
  return formatPriceWithSuffix(aedPrice, 'AED')
}

/**
 * Get display price for spare part based on user type
 * @param part - Spare part object
 * @param type - Price type (original or commercial)
 * @param exchangeRate - AED to SDG exchange rate
 * @param isAdmin - Whether the user is an admin
 * @returns Formatted price string
 */
export const getSparePartDisplayPrice = (
  part: { prices: { original: { aed: number; sdg: number }; commercial: { aed: number; sdg: number } } },
  type: 'original' | 'commercial',
  exchangeRate: number,
  isAdmin: boolean = false
): string => {
  const price = part.prices[type]
  
  if (isAdmin) {
    // Admin sees both AED and SDG
    return `${formatAdminPrice(price.aed)} (${formatUserPrice(price.aed, exchangeRate)})`
  } else {
    // User sees only SDG
    return formatUserPrice(price.aed, exchangeRate)
  }
}

/**
 * Calculate total price for multiple spare parts
 * @param parts - Array of spare parts with quantities
 * @param exchangeRate - AED to SDG exchange rate
 * @param isAdmin - Whether the user is an admin
 * @returns Formatted total price string
 */
export const calculateTotalPrice = (
  parts: Array<{
    part: { prices: { original: { aed: number }; commercial: { aed: number } } };
    quantity: number;
    type: 'original' | 'commercial';
  }>,
  exchangeRate: number,
  isAdmin: boolean = false
): string => {
  const totalAED = parts.reduce((sum, item) => {
    return sum + (item.part.prices[item.type].aed * item.quantity)
  }, 0)
  
  if (isAdmin) {
    return `${formatAdminPrice(totalAED)} (${formatUserPrice(totalAED, exchangeRate)})`
  } else {
    return formatUserPrice(totalAED, exchangeRate)
  }
}

/**
 * Get currency display name in Arabic
 * @param currency - Currency code
 * @returns Arabic currency name
 */
export const getCurrencyNameAr = (currency: 'AED' | 'SDG' | 'USD'): string => {
  const names = {
    AED: 'درهم إماراتي',
    SDG: 'جنيه سوداني',
    USD: 'دولار أمريكي'
  }
  return names[currency]
}

/**
 * Get currency display name in English
 * @param currency - Currency code
 * @returns English currency name
 */
export const getCurrencyNameEn = (currency: 'AED' | 'SDG' | 'USD'): string => {
  const names = {
    AED: 'UAE Dirham',
    SDG: 'Sudanese Pound',
    USD: 'US Dollar'
  }
  return names[currency]
}
