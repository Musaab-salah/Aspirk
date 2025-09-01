'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UserIcon, 
  WrenchScrewdriverIcon, 
  TruckIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import ShippingForm from './ShippingForm'
import { validateShippingFields, ShippingValidation } from '@/types'

interface UserRequestFormProps {
  className?: string
}

export default function UserRequestForm({ className = '' }: UserRequestFormProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [carInfo, setCarInfo] = useState({
    brand: '',
    model: '',
    year: ''
  })
  const [selectedParts, setSelectedParts] = useState<string[]>([])
  const [totalEstimatedPrice, setTotalEstimatedPrice] = useState(0)
  const [shippingMethod, setShippingMethod] = useState('')
  const [destinationCountry, setDestinationCountry] = useState('')
  const [validation, setValidation] = useState<ShippingValidation | undefined>(undefined)
  const [showValidation, setShowValidation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  // Mock spare parts data
  const availableParts = [
    { id: '1', name: 'Air Filter', nameAr: 'فلتر الهواء', price: 50, category: 'Engine' },
    { id: '2', name: 'Brake Pads', nameAr: 'وسادات الفرامل', price: 120, category: 'Brakes' },
    { id: '3', name: 'Oil Filter', nameAr: 'فلتر الزيت', price: 30, category: 'Engine' },
    { id: '4', name: 'Spark Plugs', nameAr: 'شمعات الإشعال', price: 80, category: 'Engine' },
    { id: '5', name: 'Battery', nameAr: 'البطارية', price: 200, category: 'Electrical' },
    { id: '6', name: 'Headlight', nameAr: 'المصباح الأمامي', price: 150, category: 'Lighting' },
    { id: '7', name: 'Shock Absorber', nameAr: 'ممتص الصدمات', price: 180, category: 'Suspension' },
  ]

  const handlePartSelection = (partId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedParts(prev => [...prev, partId])
      const part = availableParts.find(p => p.id === partId)
      if (part) {
        setTotalEstimatedPrice(prev => prev + part.price)
      }
    } else {
      setSelectedParts(prev => prev.filter(id => id !== partId))
      const part = availableParts.find(p => p.id === partId)
      if (part) {
        setTotalEstimatedPrice(prev => prev - part.price)
      }
    }
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

    if (!carInfo.brand || !carInfo.model || !carInfo.year) {
      alert('يرجى تحديد معلومات السيارة')
      return
    }

    if (selectedParts.length === 0) {
      alert('يرجى اختيار قطع الغيار المطلوبة')
      return
    }

    if (!shippingValidation.isValid) {
      return
    }

    setIsSubmitting(true)

    try {
      const requestData = {
        customerInfo,
        carInfo,
        selectedParts,
        totalEstimatedPrice,
        shippingMethod,
        destinationCountry,
        notes: customerInfo.notes
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        router.push('/request-success')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'حدث خطأ في إرسال الطلب')
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('حدث خطأ في الاتصال بالخادم')
    }

    setIsSubmitting(false)
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed'
    if (step === currentStep) return 'current'
    return 'upcoming'
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                getStepStatus(step) === 'completed' 
                  ? 'bg-success-600 border-success-600 text-white' 
                  : getStepStatus(step) === 'current'
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}>
                {getStepStatus(step) === 'completed' ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  <span className="font-semibold">{step}</span>
                )}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  getStepStatus(step) === 'completed' ? 'bg-success-600' : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm font-arabic">
          <span className={getStepStatus(1) === 'current' ? 'text-primary-600 font-semibold' : 'text-gray-500'}>معلومات العميل</span>
          <span className={getStepStatus(2) === 'current' ? 'text-primary-600 font-semibold' : 'text-gray-500'}>معلومات السيارة</span>
          <span className={getStepStatus(3) === 'current' ? 'text-primary-600 font-semibold' : 'text-gray-500'}>قطع الغيار</span>
          <span className={getStepStatus(4) === 'current' ? 'text-primary-600 font-semibold' : 'text-gray-500'}>الشحن والدفع</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Customer Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 animate-in fade-in duration-500">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center ml-4">
                <UserIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-arabic">معلومات العميل</h2>
                <p className="text-gray-600 font-arabic">أدخل معلوماتك الشخصية</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">الاسم الكامل *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="form-input"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">البريد الإلكتروني *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="form-input"
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">رقم الهاتف *</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="form-input"
                  placeholder="+971 50 123 4567"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">ملاحظات إضافية</label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                  className="form-textarea"
                  placeholder="أي ملاحظات إضافية..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={nextStep}
                disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Car Information */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 animate-in fade-in duration-500">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl flex items-center justify-center ml-4">
                <div className="h-6 w-6 text-success-600">🚗</div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-arabic">معلومات السيارة</h2>
                <p className="text-gray-600 font-arabic">حدد معلومات سيارتك</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">الماركة *</label>
                <select
                  value={carInfo.brand}
                  onChange={(e) => setCarInfo({...carInfo, brand: e.target.value})}
                  className="form-select"
                  required
                >
                  <option value="">اختر الماركة</option>
                  <option value="toyota">تويوتا</option>
                  <option value="hyundai">هيونداي</option>
                  <option value="nissan">نيسان</option>
                  <option value="honda">هوندا</option>
                  <option value="bmw">بي إم دبليو</option>
                  <option value="mercedes">مرسيدس</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">الموديل *</label>
                <select
                  value={carInfo.model}
                  onChange={(e) => setCarInfo({...carInfo, model: e.target.value})}
                  className="form-select"
                  required
                  disabled={!carInfo.brand}
                >
                  <option value="">اختر الموديل</option>
                  {carInfo.brand === 'toyota' && (
                    <>
                      <option value="corolla">كورولا</option>
                      <option value="camry">كامري</option>
                      <option value="land-cruiser">لاند كروزر</option>
                    </>
                  )}
                  {carInfo.brand === 'hyundai' && (
                    <>
                      <option value="accent">أكسنت</option>
                      <option value="sonata">سوناتا</option>
                      <option value="santa-fe">سانتا في</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">سنة الصنع *</label>
                <select
                  value={carInfo.year}
                  onChange={(e) => setCarInfo({...carInfo, year: e.target.value})}
                  className="form-select"
                  required
                  disabled={!carInfo.model}
                >
                  <option value="">اختر السنة</option>
                  {Array.from({length: 15}, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="btn-outline"
              >
                السابق
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!carInfo.brand || !carInfo.model || !carInfo.year}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Spare Parts Selection */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 animate-in fade-in duration-500">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-100 to-warning-200 rounded-xl flex items-center justify-center ml-4">
                <WrenchScrewdriverIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-arabic">اختيار قطع الغيار</h2>
                <p className="text-gray-600 font-arabic">حدد قطع الغيار المطلوبة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {availableParts.map((part) => (
                <div
                  key={part.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedParts.includes(part.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => handlePartSelection(part.id, !selectedParts.includes(part.id))}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 font-arabic">{part.nameAr}</h3>
                    <input
                      type="checkbox"
                      checked={selectedParts.includes(part.id)}
                      onChange={() => {}}
                      className="form-checkbox"
                    />
                  </div>
                  <p className="text-sm text-gray-600 font-arabic mb-2">{part.name}</p>
                  <p className="text-lg font-bold text-primary-600">{part.price} AED</p>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-arabic">
                    {part.category}
                  </span>
                </div>
              ))}
            </div>

            {selectedParts.length > 0 && (
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">ملخص الطلب</h3>
                <div className="space-y-2">
                  {selectedParts.map(partId => {
                    const part = availableParts.find(p => p.id === partId)
                    return part ? (
                      <div key={partId} className="flex justify-between items-center">
                        <span className="font-arabic">{part.nameAr}</span>
                        <span className="font-semibold">{part.price} AED</span>
                      </div>
                    ) : null
                  })}
                  <div className="border-t border-primary-200 pt-2 mt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span className="font-arabic">المجموع</span>
                      <span className="text-primary-600">{totalEstimatedPrice} AED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="btn-outline"
              >
                السابق
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={selectedParts.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Shipping and Payment */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 animate-in fade-in duration-500">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-danger-100 to-danger-200 rounded-xl flex items-center justify-center ml-4">
                <TruckIcon className="h-6 w-6 text-danger-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-arabic">الشحن والدفع</h2>
                <p className="text-gray-600 font-arabic">حدد طريقة الشحن والدفع</p>
              </div>
            </div>

            <ShippingForm
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
              destinationCountry={destinationCountry}
              setDestinationCountry={setDestinationCountry}
              validation={validation}
              showValidation={showValidation}
            />

            {/* Final Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">ملخص الطلب النهائي</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 font-arabic">معلومات العميل</h4>
                  <p className="text-sm text-gray-600 font-arabic">{customerInfo.name}</p>
                  <p className="text-sm text-gray-600 font-arabic">{customerInfo.email}</p>
                  <p className="text-sm text-gray-600 font-arabic">{customerInfo.phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 font-arabic">معلومات السيارة</h4>
                  <p className="text-sm text-gray-600 font-arabic">{carInfo.brand} {carInfo.model} {carInfo.year}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span className="font-arabic">إجمالي المبلغ</span>
                  <span className="text-primary-600">{totalEstimatedPrice} AED</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="btn-outline"
              >
                السابق
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !shippingMethod || !destinationCountry}
                className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="loading-spinner"></div>
                    <span className="font-arabic">جاري الإرسال...</span>
                  </div>
                ) : (
                  <span className="font-arabic">إرسال الطلب</span>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
