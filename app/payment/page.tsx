'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CreditCardIcon, 
  BuildingOfficeIcon, 
  CheckIcon, 
  ArrowLeftIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StepNavigation from '@/components/StepNavigation'
import Breadcrumb from '@/components/Breadcrumb'
import { PaymentMethod } from '@/types'

// Mock payment methods - in real app this would come from API
const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    name: 'Bank of Khartoum',
    nameAr: 'بنك الخرطوم',
    description: 'Transfer to Bank of Khartoum account',
    descriptionAr: 'تحويل إلى حساب بنك الخرطوم',
    icon: '🏦',
    accountNumber: '1234567890',
    isActive: true
  },
  {
    id: '2',
    name: 'Omdurman National Bank',
    nameAr: 'البنك الوطني أم درمان',
    description: 'Transfer to Omdurman National Bank account',
    descriptionAr: 'تحويل إلى حساب البنك الوطني أم درمان',
    icon: '🏛️',
    accountNumber: '0987654321',
    isActive: true
  },
  {
    id: '3',
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
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
      id: 'recipient',
      title: 'Recipient',
      titleAr: 'المستلم',
      icon: ClipboardDocumentCheckIcon,
      isCompleted: false,
      isCurrent: false
    },
    {
      id: 'summary',
      title: 'Summary',
      titleAr: 'الملخص',
      icon: ClipboardDocumentCheckIcon,
      isCompleted: false,
      isCurrent: false
    }
  ]

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
      // Get existing order data from session storage
      const existingData = sessionStorage.getItem('orderData')
      if (!existingData) {
        router.push('/spare-parts')
        return
      }

      const orderData = JSON.parse(existingData)
      const selectedMethod = PAYMENT_METHODS.find(method => method.id === selectedPaymentMethod)

      if (!selectedMethod) {
        setErrors({ paymentMethod: 'طريقة دفع غير صالحة' })
        return
      }

      // Update order data with payment method
      const updatedOrderData = {
        ...orderData,
        paymentMethod: selectedMethod
      }

      // Store updated data in session storage
      sessionStorage.setItem('orderData', JSON.stringify(updatedOrderData))

      // Redirect to recipient page
      router.push('/recipient')
    } catch (error) {
      console.error('Error processing payment form:', error)
      setErrors({ submit: 'حدث خطأ في معالجة النموذج' })
    } finally {
      setIsSubmitting(false)
    }
  }

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
            طريقة الدفع
          </h1>
          <p className="text-lg text-gray-600 font-arabic">
            اختر طريقة الدفع المناسبة لك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-arabic">
                طرق الدفع المتاحة
              </h2>

              <div className="space-y-4">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handlePaymentMethodChange(method.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {method.icon}
                        </div>
                      </div>
                      <div className="mr-4 flex-1">
                        <h3 className="font-semibold text-gray-900 font-arabic">
                          {method.nameAr}
                        </h3>
                        <p className="text-sm text-gray-600 font-arabic">
                          {method.descriptionAr}
                        </p>
                        {method.accountNumber && (
                          <p className="text-sm text-gray-500 font-arabic mt-1">
                            رقم الحساب: {method.accountNumber}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {selectedPaymentMethod === method.id && (
                          <CheckIcon className="h-6 w-6 text-primary-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.paymentMethod && (
                <p className="mt-4 text-sm text-red-600 font-arabic">{errors.paymentMethod}</p>
              )}

              {/* Payment Instructions */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 font-arabic">
                  تعليمات الدفع
                </h3>
                <ul className="text-sm text-blue-800 space-y-1 font-arabic">
                  <li>• قم بتحويل المبلغ إلى الحساب المحدد</li>
                  <li>• احتفظ بإيصال التحويل كدليل على الدفع</li>
                  <li>• سيتم تأكيد الطلب بعد التحقق من التحويل</li>
                  <li>• مدة التحقق من التحويل: 24-48 ساعة</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 space-x-reverse mt-6">
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
                      متابعة إلى بيانات المستلم
                    </>
                  )}
                </button>
              </div>

              {errors.submit && (
                <p className="mt-4 text-sm text-red-600 font-arabic text-center">{errors.submit}</p>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">
                ملخص الطلب
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-arabic">المجموع الفرعي:</span>
                  <span className="font-medium">0 جنيه</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-arabic">تكلفة الشحن:</span>
                  <span className="font-medium">0 جنيه</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 font-arabic">المجموع الكلي:</span>
                    <span className="text-lg font-bold text-primary-600">0 جنيه</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 font-arabic">
                  سيتم حساب التكلفة النهائية بعد تأكيد الطلب
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}