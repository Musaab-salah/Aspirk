'use client'

import { useState, useEffect } from 'react'
import { PaperAirplaneIcon, TruckIcon, ChevronDownIcon, MagnifyingGlassIcon, GlobeAltIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { COUNTRIES, validateShippingFields, calculateShippingCost, ShippingValidation, ShippingCost } from '@/types'

interface ShippingFormProps {
  shippingMethod: string
  setShippingMethod: (method: string) => void
  destinationCountry: string
  setDestinationCountry: (country: string) => void
  validation?: ShippingValidation
  showValidation?: boolean
  className?: string
}

export default function ShippingForm({
  shippingMethod,
  setShippingMethod,
  destinationCountry,
  setDestinationCountry,
  validation,
  showValidation = false,
  className = ''
}: ShippingFormProps) {
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [countrySearchTerm, setCountrySearchTerm] = useState('')
  const [shippingCost, setShippingCost] = useState<ShippingCost | null>(null)

  // Filter countries based on search term
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.nameAr.includes(countrySearchTerm)
  )

  // Group countries by category
  const arabCountries = filteredCountries.filter(country => 
    ['EG', 'SD', 'SA', 'AE', 'QA', 'BH', 'KW', 'OM', 'YE', 'JO', 'LB', 'SY', 'IQ', 'PS', 'DZ', 'TN', 'MA', 'LY', 'MR', 'SO', 'KM', 'DJ'].includes(country.code)
  )
  const africanCountries = filteredCountries.filter(country => 
    !['EG', 'SD', 'SA', 'AE', 'QA', 'BH', 'KW', 'OM', 'YE', 'JO', 'LB', 'SY', 'IQ', 'PS', 'DZ', 'TN', 'MA', 'LY', 'MR', 'SO', 'KM', 'DJ'].includes(country.code)
  )

  // Calculate shipping cost when method or country changes
  useEffect(() => {
    if (shippingMethod && destinationCountry) {
      const cost = calculateShippingCost(shippingMethod as 'air' | 'land', destinationCountry)
      setShippingCost(cost)
    } else {
      setShippingCost(null)
    }
  }, [shippingMethod, destinationCountry])

  const handleCountrySelect = (countryCode: string) => {
    setDestinationCountry(countryCode)
    setIsCountryDropdownOpen(false)
    setCountrySearchTerm('')
  }

  const selectedCountry = COUNTRIES.find(c => c.code === destinationCountry)

  const shippingMethods = [
    {
      id: 'air',
      name: 'الشحن الجوي',
      nameEn: 'Air Shipping',
      description: 'أسرع - مناسب للشحنات العاجلة',
      descriptionEn: 'Fastest - Suitable for urgent shipments',
      icon: PaperAirplaneIcon,
      color: 'blue',
      features: ['توصيل سريع', 'تتبع مباشر', 'مناسب للشحنات العاجلة']
    },
    {
      id: 'land',
      name: 'الشحن البري',
      nameEn: 'Land Shipping',
      description: 'أرخص - مناسب للشحنات غير العاجلة',
      descriptionEn: 'Cheapest - Suitable for non-urgent shipments',
      icon: TruckIcon,
      color: 'green',
      features: ['تكلفة منخفضة', 'مناسب للكميات الكبيرة', 'شحن آمن']
    }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Shipping Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4 font-arabic">
          طريقة الشحن *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shippingMethods.map((method) => (
            <div
              key={method.id}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                shippingMethod === method.id
                  ? 'border-primary-500 bg-primary-50 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300 bg-white'
              }`}
              onClick={() => setShippingMethod(method.id)}
            >
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className={`w-12 h-12 bg-gradient-to-br from-${method.color}-100 to-${method.color}-200 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <method.icon className={`h-6 w-6 text-${method.color}-600`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 font-arabic">{method.name}</h3>
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={method.id}
                      checked={shippingMethod === method.id}
                      onChange={() => setShippingMethod(method.id)}
                      className="form-radio"
                    />
                  </div>
                  <p className="text-sm text-gray-600 font-arabic mb-3">{method.description}</p>
                  <div className="space-y-1">
                    {method.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-500 font-arabic">
                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full ml-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {shippingMethod === method.id && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        {showValidation && validation?.errors.shippingMethod && (
          <div className="mt-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-sm text-danger-700 font-arabic flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 ml-2" />
              {validation.errors.shippingMethod}
            </p>
          </div>
        )}
      </div>

      {/* Destination Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4 font-arabic">
          دولة الوجهة *
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <GlobeAltIcon className="h-5 w-5 text-gray-400" />
              <span className={selectedCountry ? 'text-gray-900 font-medium' : 'text-gray-500 font-arabic'}>
                {selectedCountry ? `${selectedCountry.nameAr} (${selectedCountry.name})` : 'اختر دولة الوجهة'}
              </span>
            </div>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCountryDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-xl max-h-80 overflow-hidden animate-in fade-in duration-200">
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن دولة..."
                    value={countrySearchTerm}
                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-arabic"
                    autoFocus
                  />
                </div>
              </div>

              {/* Countries List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  <>
                    {/* Arab Countries */}
                    {arabCountries.length > 0 && (
                      <>
                        <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 text-sm font-semibold text-primary-800 font-arabic border-b border-primary-200">
                          🌍 الدول العربية
                        </div>
                        {arabCountries.map((country) => {
                          const isMethodSupported = country.supportedMethods.includes(shippingMethod as 'air' | 'land')
                          return (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => handleCountrySelect(country.code)}
                              disabled={!isMethodSupported}
                              className={`w-full text-right px-4 py-3 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 ${
                                !isMethodSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-primary-50'
                              } ${destinationCountry === country.code ? 'bg-primary-50 border-primary-200' : ''}`}
                            >
                              <div className="font-arabic">
                                <div className="font-medium text-gray-900 flex items-center justify-between">
                                  <span>{country.nameAr}</span>
                                  {destinationCountry === country.code && (
                                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">{country.name}</div>
                                {!isMethodSupported && (
                                  <div className="text-xs text-danger-600 mt-1 flex items-center">
                                    <ExclamationTriangleIcon className="h-3 w-3 ml-1" />
                                    طريقة الشحن المختارة غير متوفرة لهذه الدولة
                                  </div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </>
                    )}

                    {/* African Countries */}
                    {africanCountries.length > 0 && (
                      <>
                        <div className="px-4 py-3 bg-gradient-to-r from-success-50 to-success-100 text-sm font-semibold text-success-800 font-arabic border-b border-success-200">
                          🌍 الدول الأفريقية
                        </div>
                        {africanCountries.map((country) => {
                          const isMethodSupported = country.supportedMethods.includes(shippingMethod as 'air' | 'land')
                          return (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => handleCountrySelect(country.code)}
                              disabled={!isMethodSupported}
                              className={`w-full text-right px-4 py-3 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 ${
                                !isMethodSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-success-50'
                              } ${destinationCountry === country.code ? 'bg-success-50 border-success-200' : ''}`}
                            >
                              <div className="font-arabic">
                                <div className="font-medium text-gray-900 flex items-center justify-between">
                                  <span>{country.nameAr}</span>
                                  {destinationCountry === country.code && (
                                    <div className="w-2 h-2 bg-success-600 rounded-full"></div>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">{country.name}</div>
                                {!isMethodSupported && (
                                  <div className="text-xs text-danger-600 mt-1 flex items-center">
                                    <ExclamationTriangleIcon className="h-3 w-3 ml-1" />
                                    طريقة الشحن المختارة غير متوفرة لهذه الدولة
                                  </div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 font-arabic">
                    <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>لا توجد نتائج</p>
                    <p className="text-sm">جرب البحث بكلمات مختلفة</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {showValidation && validation?.errors.destinationCountry && (
          <div className="mt-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-sm text-danger-700 font-arabic flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 ml-2" />
              {validation.errors.destinationCountry}
            </p>
          </div>
        )}
      </div>

      {/* Shipping Cost Display */}
      {shippingCost && shippingCost.isAvailable && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center ml-3">
              <TruckIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 font-arabic">معلومات الشحن</h4>
              <p className="text-sm text-primary-700 font-arabic">تفاصيل التكلفة والوقت المتوقع</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-primary-200">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full ml-2"></div>
                <span className="font-medium text-gray-900 font-arabic">تكلفة الشحن</span>
              </div>
              <p className="text-2xl font-bold text-primary-600">{shippingCost.baseCost} {shippingCost.currency}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-primary-200">
              <div className="flex items-center mb-2">
                <ClockIcon className="h-4 w-4 text-primary-600 ml-2" />
                <span className="font-medium text-gray-900 font-arabic">الوقت المتوقع</span>
              </div>
              <p className="text-2xl font-bold text-primary-600">{shippingCost.estimatedDays} يوم</p>
            </div>
          </div>
        </div>
      )}

      {shippingCost && !shippingCost.isAvailable && (
        <div className="bg-gradient-to-r from-danger-50 to-danger-100 rounded-xl p-6 border border-danger-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-danger-600 rounded-xl flex items-center justify-center ml-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-danger-900 font-arabic">غير متوفر</h4>
              <p className="text-sm text-danger-700 font-arabic">
                طريقة الشحن المختارة غير متوفرة للدولة المحددة
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
