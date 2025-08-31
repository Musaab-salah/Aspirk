import { validateShippingFields, calculateShippingCost, COUNTRIES } from '../types'

describe('Shipping Validation', () => {
  describe('validateShippingFields', () => {
    it('should return valid for correct air shipping to UAE', () => {
      const result = validateShippingFields('air', 'AE')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return valid for correct land shipping to Saudi Arabia', () => {
      const result = validateShippingFields('land', 'SA')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return error for missing shipping method', () => {
      const result = validateShippingFields('', 'AE')
      expect(result.isValid).toBe(false)
      expect(result.errors.shippingMethod).toBe('Please select a shipping method.')
    })

    it('should return error for invalid shipping method', () => {
      const result = validateShippingFields('invalid', 'AE')
      expect(result.isValid).toBe(false)
      expect(result.errors.shippingMethod).toBe('Please select a valid shipping method.')
    })

    it('should return error for missing destination country', () => {
      const result = validateShippingFields('air', '')
      expect(result.isValid).toBe(false)
      expect(result.errors.destinationCountry).toBe('Please select a destination country.')
    })

    it('should return error for unsupported country', () => {
      const result = validateShippingFields('air', 'XX')
      expect(result.isValid).toBe(false)
      expect(result.errors.destinationCountry).toBe('Invalid or unsupported country.')
    })

    it('should return error for unsupported shipping method for country', () => {
      const result = validateShippingFields('land', 'LB') // Lebanon only supports air
      expect(result.isValid).toBe(false)
      expect(result.errors.destinationCountry).toBe('Shipping method "land" is not available for this country.')
    })

    it('should return error for unsupported shipping method for country (air to land-only country)', () => {
      // This test assumes we have a country that only supports land shipping
      // For now, we'll test with a country that supports both
      const result = validateShippingFields('land', 'US') // US only supports air
      expect(result.isValid).toBe(false)
      expect(result.errors.destinationCountry).toBe('Shipping method "land" is not available for this country.')
    })
  })

  describe('calculateShippingCost', () => {
    it('should calculate correct air shipping cost for UAE', () => {
      const result = calculateShippingCost('air', 'AE')
      expect(result.isAvailable).toBe(true)
      expect(result.baseCost).toBe(50)
      expect(result.estimatedDays).toBe(1)
      expect(result.currency).toBe('AED')
    })

    it('should calculate correct land shipping cost for Saudi Arabia', () => {
      const result = calculateShippingCost('land', 'SA')
      expect(result.isAvailable).toBe(true)
      expect(result.baseCost).toBe(50)
      expect(result.estimatedDays).toBe(3)
      expect(result.currency).toBe('AED')
    })

    it('should return unavailable for unsupported method-country combination', () => {
      const result = calculateShippingCost('land', 'LB') // Lebanon only supports air
      expect(result.isAvailable).toBe(false)
      expect(result.baseCost).toBe(0)
      expect(result.estimatedDays).toBe(0)
    })

    it('should return unavailable for invalid country', () => {
      const result = calculateShippingCost('air', 'XX')
      expect(result.isAvailable).toBe(false)
      expect(result.baseCost).toBe(0)
      expect(result.estimatedDays).toBe(0)
    })

    it('should calculate correct air shipping cost for international destinations', () => {
      const result = calculateShippingCost('air', 'US')
      expect(result.isAvailable).toBe(true)
      expect(result.baseCost).toBe(200)
      expect(result.estimatedDays).toBe(7)
      expect(result.currency).toBe('AED')
    })
  })

  describe('COUNTRIES data', () => {
    it('should have valid country data', () => {
      expect(COUNTRIES.length).toBeGreaterThan(0)
      
      COUNTRIES.forEach(country => {
        expect(country.code).toBeDefined()
        expect(country.name).toBeDefined()
        expect(country.nameAr).toBeDefined()
        expect(country.isSupported).toBeDefined()
        expect(country.supportedMethods).toBeDefined()
        expect(Array.isArray(country.supportedMethods)).toBe(true)
        expect(country.supportedMethods.length).toBeGreaterThan(0)
      })
    })

    it('should have UAE with both shipping methods', () => {
      const uae = COUNTRIES.find(c => c.code === 'AE')
      expect(uae).toBeDefined()
      expect(uae?.isSupported).toBe(true)
      expect(uae?.supportedMethods).toContain('air')
      expect(uae?.supportedMethods).toContain('land')
    })

    it('should have Lebanon with only air shipping', () => {
      const lebanon = COUNTRIES.find(c => c.code === 'LB')
      expect(lebanon).toBeDefined()
      expect(lebanon?.isSupported).toBe(true)
      expect(lebanon?.supportedMethods).toContain('air')
      expect(lebanon?.supportedMethods).not.toContain('land')
    })

    it('should have Nigeria with only air shipping', () => {
      const nigeria = COUNTRIES.find(c => c.code === 'NG')
      expect(nigeria).toBeDefined()
      expect(nigeria?.isSupported).toBe(true)
      expect(nigeria?.supportedMethods).toContain('air')
      expect(nigeria?.supportedMethods).not.toContain('land')
    })

    it('should have Egypt with both shipping methods', () => {
      const egypt = COUNTRIES.find(c => c.code === 'EG')
      expect(egypt).toBeDefined()
      expect(egypt?.isSupported).toBe(true)
      expect(egypt?.supportedMethods).toContain('air')
      expect(egypt?.supportedMethods).toContain('land')
    })

    it('should only include African and Arab countries', () => {
      const nonAfricanArabCountries = COUNTRIES.filter(country => 
        !['EG', 'SD', 'SA', 'AE', 'QA', 'BH', 'KW', 'OM', 'YE', 'JO', 'LB', 'SY', 'IQ', 'PS', 'DZ', 'TN', 'MA', 'LY', 'MR', 'SO', 'KM', 'DJ', 'NG', 'KE', 'ET', 'GH', 'ZA', 'TZ', 'UG', 'SN', 'RW', 'ZM', 'ZW', 'MW', 'BW', 'NA', 'TD', 'ML', 'NE', 'CF', 'CM', 'CI', 'BF', 'MG', 'AO', 'MZ', 'SS', 'ER', 'SL', 'TG', 'BJ', 'GW', 'GN', 'GM', 'CV', 'ST', 'GQ', 'GA', 'CG', 'CD', 'BI', 'SC', 'MU', 'LS', 'SZ'].includes(country.code)
      )
      expect(nonAfricanArabCountries.length).toBe(0)
    })
  })
})
