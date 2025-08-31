'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckIcon, TruckIcon, ClockIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShippingForm from '@/components/ShippingForm'
import { SparePart, validateShippingFields, calculateShippingCost, COUNTRIES } from '@/types'

// Mock data - in real app this would come from API
const mockSpareParts: SparePart[] = [
  {
    id: '1',
    name: 'Oil Filter',
    nameAr: 'فلتر الزيت',
    description: 'High quality oil filter for engine protection',
    descriptionAr: 'فلتر زيت عالي الجودة لحماية المحرك',
    image: '/images/oil-filter.jpg',
    category: 'Engine Parts',
    categoryAr: 'قطع المحرك',
    compatibleCars: ['1', '2', '3'],
    price: 45,
    currency: 'AED',
    isAvailable: true,
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
    price: 120,
    currency: 'AED',
    isAvailable: true,
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
    price: 35,
    currency: 'AED',
    isAvailable: true,
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
  const [destinationCountry, setDestinationCountry] = useState('')
  const [validation, setValidation] = useState({ isValid: true, errors: {} })
  const [showValidation, setShowValidation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const partsParam = searchParams.get('parts')
  const brand = searchParams.get('brand')
  const model = searchParams.get('model')
  const year = searchParams.get('year')

  useEffect(() => {
    if (partsParam) {
      const partIds = partsParam.split(',')
      const parts = mockSpareParts.filter(part => partIds.includes(part.id))
      setSelectedParts(parts)
    }
  }, [partsParam])

  const totalEstimatedPrice = selectedParts.reduce((sum, part) => sum + (part.price || 0), 0)

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate shipping fields
    const shippingValidation = validateShippingFields(shippingMethod, destinationCountry)
    setValidation(shippingValidation)
    setShowValidation(true)
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    if (!shippingValidation.isValid) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare request data
      const requestData = {
        customerInfo,
        selectedParts: selectedParts.map(part => part.id),
        carInfo: { brand, model, year },
        totalEstimatedPrice,
        shippingMethod,
        destinationCountry,
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
                      {part.price} {part.currency}
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
                    {totalEstimatedPrice} AED
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 font-arabic">
                  * السعر النهائي سيتم تأكيده من قبل فريقنا
                </p>
              </div>

              {/* Shipping Information Summary */}
              {shippingMethod && destinationCountry && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 font-arabic">معلومات الشحن</h4>
                  <div className="space-y-2 text-sm text-gray-600 font-arabic">
                    <div className="flex justify-between">
                      <span>طريقة الشحن:</span>
                      <span className="font-medium">
                        {shippingMethod === 'air' ? 'الشحن الجوي' : 'الشحن البري'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>دولة الوجهة:</span>
                      <span className="font-medium">
                        {COUNTRIES.find(c => c.code === destinationCountry)?.nameAr}
                      </span>
                    </div>
                    {(() => {
                      const shippingCost = calculateShippingCost(shippingMethod as 'air' | 'land', destinationCountry)
                      if (shippingCost.isAvailable) {
                        return (
                          <>
                            <div className="flex justify-between">
                              <span>تكلفة الشحن:</span>
                              <span className="font-medium text-primary-600">
                                {shippingCost.baseCost} {shippingCost.currency}
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

                {/* Shipping Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">
                    معلومات الشحن
                  </h3>
                  <ShippingForm
                    shippingMethod={shippingMethod}
                    destinationCountry={destinationCountry}
                    onShippingMethodChange={setShippingMethod}
                    onDestinationCountryChange={setDestinationCountry}
                    validation={validation}
                    showValidation={showValidation}
                  />
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
    </div>
  )
}
