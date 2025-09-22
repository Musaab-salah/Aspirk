'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckIcon, TruckIcon, ClockIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CityShippingForm from '@/components/CityShippingForm'
import ShippingDeliveryModal from '@/components/ShippingDeliveryModal'

import { SparePart, validateCityShippingFields, calculateShippingCost, SUDANESE_CITIES, ExchangeRateConfig, calculateSDGPrice } from '@/types'
import { formatUserPrice } from '@/utils/priceUtils'

// Mock data - in real app this would come from API
const mockSpareParts: SparePart[] = [
  {
    id: '1',
    name: 'Oil Filter',
    nameAr: 'فلتر الزيت',
    description: 'High quality oil filter for engine protection',
    descriptionAr: 'فلتر زيت عالي الجودة لحماية المحرك',
    image: '/images/air-filter.svg',
    category: 'Engine Parts',
    categoryAr: 'قطع المحرك',
    compatibleCars: ['1', '2', '3'],
    prices: {
      original: { aed: 65, sdg: 1950, usd: 18 },
      commercial: { aed: 45, sdg: 1350, usd: 12 }
    },
    isAvailable: true,
    partNumber: 'OF-001',
    countryOfOrigin: 'Germany',
  },
  {
    id: '2',
    name: 'Brake Pads',
    nameAr: 'بطانات الفرامل',
    description: 'Premium brake pads for optimal stopping power',
    descriptionAr: 'بطانات فرامل مميزة لقوة توقف مثالية',
    image: '/images/brake-pads.svg',
    category: 'Brake System',
    categoryAr: 'نظام الفرامل',
    compatibleCars: ['1', '2', '3'],
    prices: {
      original: { aed: 180, sdg: 5400, usd: 49 },
      commercial: { aed: 120, sdg: 3600, usd: 33 }
    },
    isAvailable: true,
    partNumber: 'BP-002',
    countryOfOrigin: 'Japan',
  },
  {
    id: '3',
    name: 'Air Filter',
    nameAr: 'فلتر الهواء',
    description: 'Air filter for clean engine air intake',
    descriptionAr: 'فلتر هواء لمدخل هواء نظيف للمحرك',
    image: '/images/air-filter.svg',
    category: 'Engine Parts',
    categoryAr: 'قطع المحرك',
    compatibleCars: ['1', '2', '3'],
    prices: {
      original: { aed: 55, sdg: 1650, usd: 15 },
      commercial: { aed: 35, sdg: 1050, usd: 10 }
    },
    isAvailable: true,
    partNumber: 'AF-003',
    countryOfOrigin: 'USA',
  },
  {
    id: '4',
    name: 'Shock Absorber',
    nameAr: 'ممتص الصدمات',
    description: 'Quality shock absorbers for smooth ride',
    descriptionAr: 'ممتصات صدمات عالية الجودة لرحلة مريحة',
    image: '/images/shock-absorber.svg',
    category: 'Suspension',
    categoryAr: 'نظام التعليق',
    compatibleCars: ['1', '2', '3'],
    prices: {
      original: { aed: 420, sdg: 12600, usd: 114 },
      commercial: { aed: 280, sdg: 8400, usd: 76 }
    },
    isAvailable: true,
    partNumber: 'SA-004',
    countryOfOrigin: 'Italy',
  },
  {
    id: '5',
    name: 'Battery',
    nameAr: 'البطارية',
    description: 'Long-lasting car battery',
    descriptionAr: 'بطارية سيارة طويلة العمر',
    image: '/images/battery.svg',
    category: 'Electrical',
    categoryAr: 'الأنظمة الكهربائية',
    compatibleCars: ['1', '2', '3'],
    prices: {
      original: { aed: 680, sdg: 20400, usd: 185 },
      commercial: { aed: 450, sdg: 13500, usd: 123 }
    },
    isAvailable: true,
    partNumber: 'BAT-005',
    countryOfOrigin: 'South Korea',
  },
  {
    id: '6',
    name: 'Headlight',
    nameAr: 'المصباح الأمامي',
    description: 'LED headlight for better visibility',
    descriptionAr: 'مصباح أمامي LED لرؤية أفضل',
    image: '/images/headlight.svg',
    category: 'Electrical',
    categoryAr: 'الأنظمة الكهربائية',
    compatibleCars: ['1', '2', '3'],
    prices: {
      original: { aed: 480, sdg: 14400, usd: 131 },
      commercial: { aed: 320, sdg: 9600, usd: 87 }
    },
    isAvailable: false,
    partNumber: 'HL-006',
    countryOfOrigin: 'China',
  },
]

export default function RequestSummaryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedParts, setSelectedParts] = useState<SparePart[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  })
  const [shippingMethod, setShippingMethod] = useState('')
  const [cityId, setCityId] = useState('')
  const [validation, setValidation] = useState({ isValid: true, errors: {} })
  const [showValidation, setShowValidation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showShippingModal, setShowShippingModal] = useState(false)

  const partsParam = searchParams.get('parts')
  const brand = searchParams.get('brand')
  const model = searchParams.get('model')
  const year = searchParams.get('year')

  useEffect(() => {
    if (partsParam) {
      const partIds = partsParam.split(',')
      fetchSpareParts(partIds)
    }
  }, [partsParam])

  const fetchSpareParts = async (partIds: string[]) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/spare-parts')
      const data = await response.json()
      if (data.success) {
        const parts = data.data.filter((part: SparePart) => partIds.includes(part.id))
        setSelectedParts(parts)
      }
    } catch (error) {
      console.error('Error fetching spare parts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch exchange rate on component mount
  useEffect(() => {
    fetchExchangeRate()
  }, [])

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('/api/admin/exchange-rate')
      const data = await response.json()
      if (data.success) {
        setExchangeRate(data.data)
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
    }
  }

  const totalEstimatedPrice = selectedParts.reduce((sum, part) => sum + (part.prices.commercial.aed || 0), 0)

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    // Show shipping modal instead of direct submission
    setShowShippingModal(true)
  }

  const handleShippingConfirm = async (shippingMethod: string, cityId: string) => {
    setIsSubmitting(true)
    setShowShippingModal(false)

    try {
      // Prepare request data
      const requestData = {
        customerInfo,
        selectedParts: selectedParts.map(part => part.id),
        carInfo: { brand, model, year },
        totalEstimatedPrice,
        shippingMethod,
        cityId,
        notes: customerInfo.notes
      }

      console.log('Submitting request:', requestData)
      
      // Call API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.validation) {
          // Handle validation errors
          setValidation({ isValid: false, errors: result.validation })
          setShowValidation(true)
          return
        }
        throw new Error(result.error || 'Failed to create order')
      }
      
      // Redirect to success page
      router.push('/request-success')
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
            ملخص الطلب
          </h1>
          <p className="text-lg text-gray-600 font-arabic">
            راجع تفاصيل طلبك قبل الإرسال
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selected Parts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-arabic">
                قطع الغيار المختارة
              </h2>
              
              {selectedParts.map(part => (
                <div key={part.id} className="flex items-center space-x-4 space-x-reverse border-b border-gray-200 py-4 last:border-b-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 font-arabic">{part.nameAr}</h3>
                    <p className="text-sm text-gray-500 font-arabic">{part.name}</p>
                    <p className="text-sm text-gray-600 font-arabic">{part.categoryAr}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">
                      {exchangeRate ? formatUserPrice(part.prices.commercial.aed, exchangeRate.aedToSdg) : `${part.prices.commercial.sdg} SDG`}
                    </p>
                    <p className="text-xs text-gray-500 font-arabic">(سعر تقريبي)</p>
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 font-arabic">
                    إجمالي السعر التقريبي:
                  </span>
                  <span className="text-xl font-bold text-primary-600">
                    {exchangeRate ? formatUserPrice(totalEstimatedPrice, exchangeRate.aedToSdg) : `${totalEstimatedPrice} SDG`}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 font-arabic">
                  * السعر النهائي سيتم تأكيده من قبل فريقنا
                </p>
                {exchangeRate && (
                  <p className="text-xs text-blue-600 mt-2 font-arabic">
                    💡 جميع الأسعار معروضة بالجنيه السوداني (SDG) بناءً على سعر الصرف الحالي
                  </p>
                )}
              </div>

              {/* Shipping Information Summary */}
              {shippingMethod && cityId && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 font-arabic">معلومات الشحن</h4>
                  <div className="space-y-2 text-sm text-gray-600 font-arabic">
                    <div className="flex justify-between">
                      <span>طريقة الشحن:</span>
                      <span className="font-medium">
                        {shippingMethod === 'land' ? 'الشحن البري' : 'الشحن البحري'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>المدينة:</span>
                      <span className="font-medium">
                        {SUDANESE_CITIES.find(c => c.id === cityId)?.nameAr}
                      </span>
                    </div>
                    {(() => {
                      const shippingCost = calculateShippingCost(shippingMethod as 'land' | 'sea', cityId, totalEstimatedPrice)
                      if (shippingCost.isAvailable) {
                        return (
                          <>
                            <div className="flex justify-between">
                              <span>تكلفة الشحن:</span>
                              <span className="font-medium text-primary-600">
                                {shippingCost.baseCost} SDG
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>الوقت المتوقع:</span>
                              <span className="font-medium">
                                {shippingCost.estimatedDays} يوم
                              </span>
                            </div>
                          </>
                        )
                      }
                      return null
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Car Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-arabic">
                معلومات السيارة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                    الماركة
                  </label>
                  <p className="text-gray-900 font-arabic">تويوتا</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                    الموديل
                  </label>
                  <p className="text-gray-900 font-arabic">كورولا</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                    سنة التصنيع
                  </label>
                  <p className="text-gray-900 font-arabic">2016</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-arabic">
                معلومات العميل
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="form-input font-arabic"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-input font-arabic"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="form-input font-arabic"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                    العنوان
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="form-input font-arabic"
                    rows={3}
                    placeholder="أدخل عنوانك (اختياري)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="form-input font-arabic"
                    rows={3}
                    placeholder="أي ملاحظات إضافية (اختياري)"
                  />
                </div>

                {/* Note about shipping selection */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2 font-arabic">
                      معلومات الشحن
                    </h3>
                    <p className="text-blue-700 font-arabic text-sm">
                      سيتم طلب اختيار طريقة الشحن والولاية في الخطوة التالية
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors font-arabic ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>
              </form>

              {/* Process Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 font-arabic">
                  كيف يعمل النظام؟
                </h3>
                <div className="space-y-2 text-sm text-blue-800 font-arabic">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>نراجع طلبك خلال 24 ساعة</span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="h-4 w-4 mr-2" />
                    <span>نؤكد الأسعار والتوفر</span>
                  </div>
                  <div className="flex items-center">
                    <TruckIcon className="h-4 w-4 mr-2" />
                    <span>نرسل لك الفاتورة النهائية</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Shipping Delivery Modal */}
      <ShippingDeliveryModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        onConfirm={handleShippingConfirm}
        selectedParts={selectedParts}
        totalPrice={totalEstimatedPrice}
      />
    </div>
  )
}
