'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UserIcon, 
  PhoneIcon, 
  MapPinIcon, 
  DocumentTextIcon,
  CheckIcon, 
  ArrowLeftIcon,
  TruckIcon,
  CreditCardIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StepNavigation from '@/components/StepNavigation'
import Breadcrumb from '@/components/Breadcrumb'

interface RecipientDetails {
  fullName: string
  phoneNumber: string
  detailedAddress: string
  additionalNotes?: string
}

export default function RecipientPage() {
  const router = useRouter()
  const [recipientDetails, setRecipientDetails] = useState<RecipientDetails>({
    fullName: '',
    phoneNumber: '',
    detailedAddress: '',
    additionalNotes: ''
  })
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
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'recipient',
      title: 'Recipient',
      titleAr: 'المستلم',
      icon: UserIcon,
      isCompleted: false,
      isCurrent: true
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

  const handleInputChange = (field: keyof RecipientDetails, value: string) => {
    setRecipientDetails(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!recipientDetails.fullName.trim()) {
      newErrors.fullName = 'يرجى إدخال الاسم الكامل'
    }

    if (!recipientDetails.phoneNumber.trim()) {
      newErrors.phoneNumber = 'يرجى إدخال رقم الهاتف'
    } else if (!/^(\+249|0)[0-9]{9}$/.test(recipientDetails.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'يرجى إدخال رقم هاتف صحيح'
    }

    if (!recipientDetails.detailedAddress.trim()) {
      newErrors.detailedAddress = 'يرجى إدخال العنوان التفصيلي'
    } else if (recipientDetails.detailedAddress.trim().length < 10) {
      newErrors.detailedAddress = 'العنوان يجب أن يكون أكثر تفصيلاً (10 أحرف على الأقل)'
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

      // Update order data with recipient details
      const updatedOrderData = {
        ...orderData,
        recipientDetails
      }

      // Store updated data in session storage
      sessionStorage.setItem('orderData', JSON.stringify(updatedOrderData))

      // Redirect to summary page
      router.push('/summary')
    } catch (error) {
      console.error('Error processing recipient form:', error)
      setErrors({ submit: 'حدث خطأ في معالجة النموذج' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Step Navigation */}
      <StepNavigation currentStep="recipient" steps={steps} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { name: 'Select Car', nameAr: 'اختيار السيارة', href: '/' },
            { name: 'Spare Parts', nameAr: 'قطع الغيار', href: '/spare-parts' },
            { name: 'Shipping', nameAr: 'الشحن', href: '/shipping' },
            { name: 'Payment', nameAr: 'الدفع', href: '/payment' },
            { name: 'Recipient', nameAr: 'المستلم', isCurrent: true }
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
            بيانات المستلم
          </h1>
          <p className="text-lg text-gray-600 font-arabic">
            أدخل بيانات المستلم للحصول على الطلب
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recipient Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-arabic">
                معلومات المستلم
              </h2>

              {/* Full Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <UserIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={recipientDetails.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="أدخل الاسم الكامل"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                    suppressHydrationWarning
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600 font-arabic">{errors.fullName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  رقم الهاتف *
                </label>
                <div className="relative">
                  <PhoneIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="tel"
                    value={recipientDetails.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="09xxxxxxxx أو +249xxxxxxxxx"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                    suppressHydrationWarning
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-2 text-sm text-red-600 font-arabic">{errors.phoneNumber}</p>
                )}
                <p className="mt-1 text-sm text-gray-500 font-arabic">
                  مثال: 0912345678 أو +24912345678
                </p>
              </div>

              {/* Detailed Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  العنوان التفصيلي *
                </label>
                <div className="relative">
                  <MapPinIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3" />
                  <textarea
                    value={recipientDetails.detailedAddress}
                    onChange={(e) => handleInputChange('detailedAddress', e.target.value)}
                    placeholder="أدخل العنوان التفصيلي مع اسم الحي والشارع ورقم المنزل"
                    rows={4}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic resize-none"
                    suppressHydrationWarning
                  />
                </div>
                {errors.detailedAddress && (
                  <p className="mt-2 text-sm text-red-600 font-arabic">{errors.detailedAddress}</p>
                )}
                <p className="mt-1 text-sm text-gray-500 font-arabic">
                  مثال: حي الرياض، شارع النيل، مبنى رقم 15، شقة رقم 3
                </p>
              </div>

              {/* Additional Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  ملاحظات إضافية (اختياري)
                </label>
                <div className="relative">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3" />
                  <textarea
                    value={recipientDetails.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="أي ملاحظات إضافية أو تعليمات خاصة للتوصيل"
                    rows={3}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic resize-none"
                    suppressHydrationWarning
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 font-arabic">
                  مثال: "يرجى التوصيل في المساء" أو "اتصل قبل التوصيل"
                </p>
              </div>

              {/* Important Notice */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2 font-arabic">
                  تنبيه مهم
                </h3>
                <ul className="text-sm text-yellow-800 space-y-1 font-arabic">
                  <li>• تأكد من صحة البيانات المدخلة</li>
                  <li>• سيتم استخدام هذه البيانات لتوصيل الطلب</li>
                  <li>• في حالة عدم صحة البيانات، قد يتم تأخير التوصيل</li>
                  <li>• يمكنك تعديل هذه البيانات لاحقاً من لوحة التحكم</li>
                </ul>
              </div>

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

              {/* Delivery Info */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 font-arabic text-sm">
                  معلومات التوصيل
                </h3>
                <p className="text-xs text-blue-800 font-arabic">
                  سيتم استخدام بيانات المستلم لتوصيل الطلب إلى العنوان المحدد
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

