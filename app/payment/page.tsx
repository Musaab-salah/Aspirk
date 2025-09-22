'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TruckIcon, 
  BuildingOfficeIcon, 
  MapPinIcon, 
  CheckIcon, 
  ArrowLeftIcon,
  CreditCardIcon,
  BanknotesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StepNavigation from '@/components/StepNavigation'
import Breadcrumb from '@/components/Breadcrumb'
import { SparePartSelection, ShippingCost, PaymentMethod } from '@/types'

interface OrderData {
  parts: SparePartSelection[]
  shippingMethod: 'land' | 'sea'
  state: string
  city: string
  shippingCost: ShippingCost
  brand?: string
  model?: string
  year?: string
}

// Hardcoded payment methods - will be manageable from Admin Panel later
const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bank-khartoum',
    name: 'Bank of Khartoum',
    nameAr: 'بنك الخرطوم',
    description: 'Transfer to Bank of Khartoum account',
    descriptionAr: 'تحويل إلى حساب بنك الخرطوم',
    icon: '🏦',
    accountNumber: '1234567890',
    isActive: true
  },
  {
    id: 'omdurman-national',
    name: 'Omdurman National Bank',
    nameAr: 'بنك أم درمان الوطني',
    description: 'Transfer to Omdurman National Bank account',
    descriptionAr: 'تحويل إلى حساب بنك أم درمان الوطني',
    icon: '🏛️',
    accountNumber: '0987654321',
    isActive: true
  },
  {
    id: 'faisal-islamic',
    name: 'Faisal Islamic Bank',
    nameAr: 'بنك فيصل الإسلامي',
    description: 'Transfer to Faisal Islamic Bank account',
    descriptionAr: 'تحويل إلى حساب بنك فيصل الإسلامي',
    icon: '🕌',
    accountNumber: '1122334455',
    isActive: true
  }
]

export default function PaymentPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

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
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'payment',
      title: 'Payment',
      titleAr: 'الدفع',
      icon: CreditCardIcon,
      isCompleted: false,
      isCurrent: true
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
    loadOrderData()
  }, [])

  const loadOrderData = () => {
    try {
      const storedData = sessionStorage.getItem('orderData')
      if (storedData) {
        const data = JSON.parse(storedData)
        setOrderData(data)
      } else {
        // Redirect to spare parts if no data
        router.push('/spare-parts')
      }
    } catch (error) {
      console.error('Error loading order data:', error)
      router.push('/spare-parts')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
    setErrors(prev => ({ ...prev, paymentMethod: '' }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = 'يرجى اختيار طريقة الدفع'
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
      // Update order data with payment method
      const selectedMethod = PAYMENT_METHODS.find(method => method.id === selectedPaymentMethod)
      const updatedOrderData = {
        ...orderData,
        paymentMethod: selectedMethod
      }

      // Store updated data in session storage
      sessionStorage.setItem('orderData', JSON.stringify(updatedOrderData))

      // Redirect to summary page
      router.push('/summary')
    } catch (error) {
      console.error('Error processing payment form:', error)
      setErrors({ submit: 'حدث خطأ في معالجة النموذج' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateSubtotal = () => {
    if (!orderData) return 0
    return orderData.parts.reduce((total, selection) => 
      total + (selection.part.prices[selection.type]?.sdg || 0) * selection.quantity, 0
    )
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shippingCost = orderData?.shippingCost?.baseCost || 0
    return subtotal + shippingCost
  }

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

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-arabic">
              لا توجد بيانات طلب
            </h1>
            <p className="text-gray-600 mb-6 font-arabic">
              يرجى العودة لاختيار قطع الغيار
            </p>
            <button
              onClick={() => router.push('/spare-parts')}
              className="btn-primary font-arabic"
            >
              العودة لقطع الغيار
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const subtotal = calculateSubtotal()
  const total = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Step Navigation */}
      <StepNavigation currentStep="payment" steps={steps} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { name: 'Select Car', nameAr: 'اختيار السيارة', href: '/' },
            { name: 'Spare Parts', nameAr: 'قطع الغيار', href: '/spare-parts' },
            { name: 'Shipping', nameAr: 'الشحن', href: '/shipping' },
            { name: 'Payment', nameAr: 'الدفع', isCurrent: true }
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
            طرق الدفع
          </h1>
          <p className="text-lg text-gray-600 font-arabic">
            اختر طريقة الدفع المناسبة لك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">
                ملخص الطلب
              </h2>
              
              {/* Selected Parts */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2 font-arabic">قطع الغيار المختارة</h3>
                <div className="space-y-2">
                  {orderData.parts.map((selection, index) => (
                    <div key={index} className="text-sm text-gray-600 font-arabic">
                      <span className="font-medium">{selection.part.nameAr}</span>
                      <span className="mr-1">× {selection.quantity}</span>
                      <span className="text-primary-600">
                        {(selection.part.prices[selection.type]?.sdg || 0) * selection.quantity} جنيه
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2 font-arabic">معلومات الشحن</h3>
                <div className="text-sm text-gray-600 font-arabic space-y-1">
                  <div>الطريقة: {orderData.shippingMethod === 'land' ? 'بري' : 'بحري'}</div>
                  <div>الوجهة: {orderData.city}</div>
                  <div>الولاية: {orderData.state}</div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-arabic">المجموع الفرعي:</span>
                    <span className="font-medium">{subtotal} جنيه</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-arabic">تكلفة الشحن:</span>
                    <span className="font-medium">
                      {orderData.shippingCost.baseCost} جنيه
                      {orderData.shippingCost.freeShippingThreshold && subtotal >= orderData.shippingCost.freeShippingThreshold && (
                        <span className="text-green-600 text-xs mr-1">(مجاني)</span>
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 font-arabic">المجموع الكلي:</span>
                      <span className="font-bold text-primary-600">
                        {orderData.shippingCost.freeShippingThreshold && subtotal >= orderData.shippingCost.freeShippingThreshold 
                          ? subtotal 
                          : total} جنيه
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-arabic">
                طرق الدفع المتاحة
              </h2>

              <div className="space-y-4 mb-6">
                {PAYMENT_METHODS.filter(method => method.isActive).map((method) => (
                  <div
                    key={method.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handlePaymentMethodChange(method.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => handlePaymentMethodChange(method.id)}
                        className="sr-only"
                      />
                      <div className="text-3xl ml-4">{method.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 font-arabic">
                          {method.nameAr}
                        </h3>
                        <p className="text-sm text-gray-600 font-arabic">
                          {method.descriptionAr}
                        </p>
                        {method.accountNumber && (
                          <p className="text-xs text-gray-500 font-arabic mt-1">
                            رقم الحساب: {method.accountNumber}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="w-6 h-6 border-2 rounded-full flex items-center justify-center">
                          {selectedPaymentMethod === method.id && (
                            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.paymentMethod && (
                <p className="mb-4 text-sm text-red-600 font-arabic">{errors.paymentMethod}</p>
              )}

              {/* Payment Instructions */}
              {selectedPaymentMethod && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 font-arabic">
                    تعليمات الدفع
                  </h3>
                  <div className="text-blue-800 text-sm font-arabic space-y-2">
                    <p>1. قم بتحويل المبلغ إلى الحساب المحدد</p>
                    <p>2. احتفظ بإيصال التحويل</p>
                    <p>3. ستحتاج لإدخال رقم الإيصال في الخطوة التالية</p>
                    <p>4. سيتم مراجعة طلبك وإرسال قطع الغيار بعد تأكيد الدفع</p>
                  </div>
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
                      متابعة إلى الملخص
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
