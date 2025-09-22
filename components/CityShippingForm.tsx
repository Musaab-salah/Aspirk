'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, TruckIcon, BuildingOfficeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { 
  SUDANESE_CITIES, 
  calculateShippingCost, 
  validateCityShippingFields,
  type SudaneseCity,
  type CityShippingValidation,
  type ShippingCost
} from '@/types'

interface CityShippingFormProps {
  shippingMethod: string
  cityId: string
  totalAmount?: number
  onShippingMethodChange: (method: string) => void
  onCityChange: (cityId: string) => void
  onShippingCostChange?: (cost: ShippingCost) => void
  validation?: CityShippingValidation
  showValidation?: boolean
  className?: string
}

export default function CityShippingForm({
  shippingMethod,
  cityId,
  totalAmount = 0,
  onShippingMethodChange,
  onCityChange,
  onShippingCostChange,
  validation,
  showValidation = false,
  className = ''
}: CityShippingFormProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [shippingCost, setShippingCost] = useState<ShippingCost | null>(null)

  // Filter cities based on search term
  const filteredCities = SUDANESE_CITIES.filter(city => 
    city.active && (
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.nameAr.includes(searchTerm) ||
      city.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.stateAr?.includes(searchTerm)
    )
  )

  // Group cities by state
  const groupedCities = filteredCities.reduce((groups, city) => {
    const state = city.stateAr || city.state || 'أخرى'
    if (!groups[state]) {
      groups[state] = []
    }
    groups[state].push(city)
    return groups
  }, {} as Record<string, SudaneseCity[]>)

  // Calculate shipping cost when method or city changes
  useEffect(() => {
    if (shippingMethod && cityId) {
      const cost = calculateShippingCost(shippingMethod as 'land' | 'sea', cityId, totalAmount)
      setShippingCost(cost)
      onShippingCostChange?.(cost)
    } else {
      setShippingCost(null)
      onShippingCostChange?.(null as any)
    }
  }, [shippingMethod, cityId, totalAmount, onShippingCostChange])

  const selectedCity = SUDANESE_CITIES.find(city => city.id === cityId)

  const handleMethodChange = (method: string) => {
    onShippingMethodChange(method)
  }

  const handleCitySelect = (city: SudaneseCity) => {
    onCityChange(city.id)
    setIsDropdownOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Shipping Method Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-4 font-arabic">
          طريقة الشحن
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Land Shipping */}
          <div 
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
              shippingMethod === 'land'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleMethodChange('land')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="shippingMethod"
                value="land"
                checked={shippingMethod === 'land'}
                onChange={() => handleMethodChange('land')}
                className="sr-only"
              />
              <TruckIcon className="h-8 w-8 text-blue-600 ml-3" />
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 font-arabic">
                  الشحن البري
                </div>
                <div className="text-sm text-gray-600 font-arabic">
                  أسرع في التوصيل، مناسب للمدن القريبة
                </div>
              </div>
            </div>
          </div>

          {/* Sea Shipping */}
          <div 
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
              shippingMethod === 'sea'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleMethodChange('sea')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="shippingMethod"
                value="sea"
                checked={shippingMethod === 'sea'}
                onChange={() => handleMethodChange('sea')}
                className="sr-only"
              />
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600 ml-3" />
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 font-arabic">
                  الشحن البحري
                </div>
                <div className="text-sm text-gray-600 font-arabic">
                  أقل تكلفة، مناسب للشحنات الكبيرة
                </div>
              </div>
            </div>
          </div>
        </div>
        {showValidation && validation?.errors.shippingMethod && (
          <p className="mt-2 text-sm text-red-600 font-arabic">
            {validation.errors.shippingMethod}
          </p>
        )}
      </div>

      {/* City Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-4 font-arabic">
          المدينة
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`relative w-full rounded-md border px-3 py-3 text-right shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              showValidation && validation?.errors.cityId
                ? 'border-red-300'
                : 'border-gray-300'
            }`}
          >
            <span className="block truncate font-arabic">
              {selectedCity ? selectedCity.nameAr : 'اختر المدينة'}
            </span>
            <ChevronDownIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن المدينة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 text-right font-arabic focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-auto">
                {Object.entries(groupedCities).map(([state, cities]) => (
                  <div key={state}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 font-arabic">
                      {state}
                    </div>
                    {cities.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className={`w-full px-3 py-2 text-right font-arabic hover:bg-gray-100 ${
                          cityId === city.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                        }`}
                      >
                        {city.nameAr}
                      </button>
                    ))}
                  </div>
                ))}
                {filteredCities.length === 0 && (
                  <div className="px-3 py-2 text-gray-500 text-center font-arabic">
                    لا توجد مدن مطابقة للبحث
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {showValidation && validation?.errors.cityId && (
          <p className="mt-2 text-sm text-red-600 font-arabic">
            {validation.errors.cityId}
          </p>
        )}
      </div>

      {/* Shipping Cost Display */}
      {shippingCost && shippingCost.isAvailable && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 font-arabic">
            تفاصيل الشحن
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-arabic">تكلفة الشحن:</span>
              <span className="font-semibold text-gray-900 font-arabic">
                {shippingCost.baseCost === 0 ? 'مجاني' : `${shippingCost.baseCost} جنيه سوداني`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-arabic">مدة التوصيل المتوقعة:</span>
              <span className="font-semibold text-gray-900 font-arabic">
                {shippingCost.estimatedDays} {shippingCost.estimatedDays === 1 ? 'يوم' : 'أيام'}
              </span>
            </div>
            {shippingCost.freeShippingThreshold && totalAmount < shippingCost.freeShippingThreshold && (
              <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                <p className="text-sm text-blue-700 font-arabic">
                  احصل على شحن مجاني عند الطلب بقيمة {shippingCost.freeShippingThreshold} جنيه سوداني أو أكثر
                </p>
              </div>
            )}
            {totalAmount > 0 && (
              <div className="border-t pt-2 mt-3">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-900 font-arabic">المجموع الكلي:</span>
                  <span className="text-blue-600 font-arabic">
                    {totalAmount + shippingCost.baseCost} جنيه سوداني
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Method not available message */}
      {shippingMethod && cityId && shippingCost && !shippingCost.isAvailable && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-arabic">
            طريقة الشحن المختارة غير متاحة لهذه المدينة. يرجى اختيار طريقة شحن أخرى.
          </p>
        </div>
      )}
    </div>
  )
}