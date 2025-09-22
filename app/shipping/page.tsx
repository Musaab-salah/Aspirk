'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { TruckIcon, BuildingOfficeIcon, MapPinIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StepNavigation from '@/components/StepNavigation'
import Breadcrumb from '@/components/Breadcrumb'
import { SparePart, SparePartSelection, SUDANESE_CITIES, validateCityShippingFields, calculateShippingCost } from '@/types'

interface SudaneseState {
  id: string
  name: string
  nameAr: string
  cities: Array<{
    id: string
    name: string
    nameAr: string
  }>
  isActive: boolean
}

export default function ShippingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedParts, setSelectedParts] = useState<SparePartSelection[]>([])
  const [parts, setParts] = useState<SparePart[]>([])
  const [states, setStates] = useState<SudaneseState[]>([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [shippingMethod, setShippingMethod] = useState<'land' | 'sea' | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Get URL parameters
  const partsParam = searchParams.get('parts')
  const quantitiesParam = searchParams.get('quantities')
  const typesParam = searchParams.get('types')
  const brand = searchParams.get('brand')
  const model = searchParams.get('model')
  const year = searchParams.get('year')

  // Define the workflow steps
  const steps = [
    {
      id: 'home',
      title: 'Home',
      titleAr: 'الرئيسية',
      icon: TruckIcon,
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'select-car',
      title: 'Select Car',
      titleAr: 'اختيار السيارة',
      icon: TruckIcon,
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'spare-parts',
      title: 'Spare Parts',
      titleAr: 'قطع الغيار',
      icon: TruckIcon,
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'shipping',
      title: 'Shipping',
      titleAr: 'الشحن',
      icon: TruckIcon,
      isCompleted: false,
      isCurrent: true
    },
    {
      id: 'payment',
      title: 'Payment',
      titleAr: 'الدفع',
      icon: TruckIcon,
      isCompleted: false,
      isCurrent: false
    },
    {
      id: 'summary',
      title: 'Summary',
      titleAr: 'الملخص',
      icon: TruckIcon,
      isCompleted: false,
      isCurrent: false
    }
  ]

  useEffect(() => {
    fetchStates()
    fetchSpareParts()
    parseSelectedParts()
  }, [])

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/states')
      const data = await response.json()
      if (data.success) {
        setStates(data.data)
      }
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  const fetchSpareParts = async () => {
    try {
      const response = await fetch('/api/admin/spare-parts')
      const data = await response.json()
      if (data.success) {
        setParts(data.data)
      }
    } catch (error) {
      console.error('Error fetching spare parts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const parseSelectedParts = () => {
    if (!partsParam || !quantitiesParam || !typesParam) return

    const partIds = partsParam.split(',')
    const quantities = quantitiesParam.split(',').map(Number)
    const types = typesParam.split(',') as ('original' | 'commercial')[]

    const parsedParts: SparePartSelection[] = partIds.map((partId, index) => {
      const part = parts.find(p => p.id === partId)
      return {
        partId,
        quantity: quantities[index] || 1,
        type: types[index] || 'commercial',
        part: part || {} as SparePart
      }
    }).filter(selection => selection.part.id)

    setSelectedParts(parsedParts)
  }

  // Update selected parts when parts data is loaded
  useEffect(() => {
    if (parts.length > 0) {
      parseSelectedParts()
    }
  }, [parts])

  const handleStateChange = (stateId: string) => {
    setSelectedState(stateId)
    setSelectedCity('')
    setErrors(prev => ({ ...prev, state: '', city: '' }))
  }

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId)
    setErrors(prev => ({ ...prev, city: '' }))
  }

  const handleShippingMethodChange = (method: 'land' | 'sea') => {
    setShippingMethod(method)
    setErrors(prev => ({ ...prev, shippingMethod: '' }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!shippingMethod) {
      newErrors.shippingMethod = 'يرجى اختيار طريقة الشحن'
    }

    if (!selectedState) {
      newErrors.state = 'يرجى اختيار الولاية'
    }

    if (!selectedCity) {
      newErrors.city = 'يرجى اختيار المدينة'
    }

    // Validate shipping method and city combination
    if (shippingMethod && selectedCity) {
      const validation = validateCityShippingFields(shippingMethod, selectedCity)
      if (!validation.isValid) {
        Object.assign(newErrors, validation.errors)
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Calculate shipping cost
      const shippingCost = calculateShippingCost(shippingMethod as 'land' | 'sea', selectedCity)
      
      // Prepare data for order summary
      const orderData = {
        parts: selectedParts,
        shippingMethod,
        state: selectedState,
        city: selectedCity,
        shippingCost,
        brand,
        model,
        year
      }

      // Store in session storage for order summary page
      sessionStorage.setItem('orderData', JSON.stringify(orderData))

      // Redirect to payment page
      router.push('/payment')
    } catch (error) {
      console.error('Error processing shipping form:', error)
      setErrors({ submit: 'حدث خطأ في معالجة النموذج' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedStateData = states.find(s => s.id === selectedState)
  const availableCities = selectedStateData?.cities || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Step Navigation */}
      <StepNavigation currentStep="shipping" steps={steps} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { name: 'Select Car', nameAr: 'اختيار السيارة', href: '/' },
            { name: 'Spare Parts', nameAr: 'قطع الغيار', href: '/spare-parts' },
            { name: 'Shipping', nameAr: 'الشحن', isCurrent: true }
          ]} 
        />
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 ml-2" />
              <span className="font-arabic">العودة</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
            معلومات الشحن
          </h1>
          <p className="text-lg text-gray-600 font-arabic">
            اختر طريقة الشحن والولاية والمدينة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selected Parts Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">
                قطع الغيار المختارة
              </h2>
              <div className="space-y-3">
                {selectedParts.map((selection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 font-arabic">
                        {selection.part.nameAr}
                      </p>
                      <p className="text-sm text-gray-600 font-arabic">
                        الكمية: {selection.quantity} • النوع: {selection.type === 'original' ? 'أصلي' : 'تجاري'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">
                        {selection.part.prices[selection.type]?.sdg || 0} جنيه
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 font-arabic">المجموع:</span>
                  <span className="font-bold text-primary-600">
                    {selectedParts.reduce((total, selection) => 
                      total + (selection.part.prices[selection.type]?.sdg || 0) * selection.quantity, 0
                    )} جنيه
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-arabic">
                تفاصيل الشحن
              </h2>

              {/* Shipping Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 font-arabic">
                  طريقة الشحن *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleShippingMethodChange('land')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      shippingMethod === 'land'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <TruckIcon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900 font-arabic">الشحن البري</h3>
                    <p className="text-sm text-gray-600 font-arabic">أسرع وأكثر موثوقية</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShippingMethodChange('sea')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      shippingMethod === 'sea'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <BuildingOfficeIcon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900 font-arabic">الشحن البحري</h3>
                    <p className="text-sm text-gray-600 font-arabic">أقل تكلفة للشحنات الكبيرة</p>
                  </button>
                </div>
                {errors.shippingMethod && (
                  <p className="mt-2 text-sm text-red-600 font-arabic">{errors.shippingMethod}</p>
                )}
              </div>

              {/* State Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  الولاية *
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                >
                  <option value="">اختر الولاية</option>
                  {states.filter(state => state.isActive).map(state => (
                    <option key={state.id} value={state.id}>
                      {state.nameAr}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-2 text-sm text-red-600 font-arabic">{errors.state}</p>
                )}
              </div>

              {/* City Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  المدينة *
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  disabled={!selectedState}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">اختر المدينة</option>
                  {availableCities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.nameAr}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-2 text-sm text-red-600 font-arabic">{errors.city}</p>
                )}
              </div>

              {/* Shipping Cost Preview */}
              {shippingMethod && selectedCity && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MapPinIcon className="h-5 w-5 text-blue-600 ml-2" />
                    <h3 className="font-semibold text-blue-900 font-arabic">تكلفة الشحن المقدرة</h3>
                  </div>
                  {(() => {
                    const shippingCost = calculateShippingCost(shippingMethod as 'land' | 'sea', selectedCity)
                    return (
                      <div className="text-blue-800 font-arabic">
                        <p>طريقة الشحن: {shippingMethod === 'land' ? 'بري' : 'بحري'}</p>
                        <p>التكلفة: {shippingCost.baseCost} جنيه</p>
                        <p>المدة المتوقعة: {shippingCost.estimatedDays} أيام</p>
                        {shippingCost.freeShippingThreshold && (
                          <p className="text-sm">الشحن مجاني للطلبات أكثر من {shippingCost.freeShippingThreshold} جنيه</p>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 space-x-reverse">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-arabic"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-arabic flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4 ml-2" />
                      متابعة إلى الدفع
                    </>
                  )}
                </button>
              </div>

              {errors.submit && (
                <p className="mt-4 text-sm text-red-600 font-arabic text-center">{errors.submit}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
