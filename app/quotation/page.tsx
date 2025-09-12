'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon, ArrowRightIcon, EnvelopeIcon, ChatBubbleLeftRightIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProgressStepper from '@/components/ProgressStepper'

interface QuotationMethod {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const quotationMethods: QuotationMethod[] = [
  {
    id: 'email',
    name: 'Email',
    nameAr: 'البريد الإلكتروني',
    description: 'Receive quotation via email',
    descriptionAr: 'استلم عرض السعر عبر البريد الإلكتروني',
    icon: EnvelopeIcon,
    color: 'primary'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    nameAr: 'واتساب',
    description: 'Receive quotation via WhatsApp',
    descriptionAr: 'استلم عرض السعر عبر واتساب',
    icon: ChatBubbleLeftRightIcon,
    color: 'success'
  },
  {
    id: 'both',
    name: 'Both',
    nameAr: 'كلاهما',
    description: 'Receive quotation via both email and WhatsApp',
    descriptionAr: 'استلم عرض السعر عبر البريد الإلكتروني وواتساب',
    icon: DocumentArrowDownIcon,
    color: 'warning'
  }
]

export default function QuotationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    name: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get order data from URL params
  const parts = searchParams.get('parts')
  const quantities = searchParams.get('quantities')
  const brand = searchParams.get('brand')
  const model = searchParams.get('model')
  const year = searchParams.get('year')

  // Progress steps
  const steps = [
    {
      id: 'car-selection',
      title: 'Car Selection',
      titleAr: 'اختيار السيارة',
      description: 'Choose your car',
      descriptionAr: 'اختر سيارتك',
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'parts-selection',
      title: 'Parts Selection',
      titleAr: 'اختيار قطع الغيار',
      description: 'Select spare parts',
      descriptionAr: 'اختر قطع الغيار',
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'order-review',
      title: 'Order Review',
      titleAr: 'مراجعة الطلب',
      description: 'Review your order',
      descriptionAr: 'راجع طلبك',
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'login',
      title: 'Login/Signup',
      titleAr: 'تسجيل الدخول',
      description: 'Login or create account',
      descriptionAr: 'سجل دخول أو أنشئ حساب',
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'quotation',
      title: 'Request Quotation',
      titleAr: 'طلب عرض سعر',
      description: 'Get price quote',
      descriptionAr: 'احصل على عرض السعر',
      isCompleted: false,
      isCurrent: true
    },
    {
      id: 'payment',
      title: 'Payment',
      titleAr: 'الدفع',
      description: 'Complete payment',
      descriptionAr: 'أكمل الدفع',
      isCompleted: false,
      isCurrent: false
    }
  ]

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const handleInputChange = (field: string, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedMethod) {
      alert('يرجى اختيار طريقة استلام عرض السعر')
      return
    }

    if (selectedMethod === 'email' && !contactInfo.email) {
      alert('يرجى إدخال البريد الإلكتروني')
      return
    }

    if (selectedMethod === 'whatsapp' && !contactInfo.phone) {
      alert('يرجى إدخال رقم الهاتف')
      return
    }

    if (selectedMethod === 'both' && (!contactInfo.email || !contactInfo.phone)) {
      alert('يرجى إدخال البريد الإلكتروني ورقم الهاتف')
      return
    }

    setIsSubmitting(true)

    try {
      // In real app, this would make an API call to send quotation
      console.log('Submitting quotation request:', {
        method: selectedMethod,
        contactInfo,
        parts,
        quantities,
        brand,
        model,
        year
      })

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Navigate to payment page
      const params = new URLSearchParams()
      if (parts) params.append('parts', parts)
      if (quantities) params.append('quantities', quantities)
      if (brand) params.append('brand', brand)
      if (model) params.append('model', model)
      if (year) params.append('year', year)
      params.append('quotationMethod', selectedMethod)
      
      router.push(`/payment?${params.toString()}`)
    } catch (error) {
      console.error('Error submitting quotation request:', error)
      alert('حدث خطأ أثناء إرسال طلب عرض السعر. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    const params = new URLSearchParams()
    if (parts) params.append('parts', parts)
    if (quantities) params.append('quantities', quantities)
    if (brand) params.append('brand', brand)
    if (model) params.append('model', model)
    if (year) params.append('year', year)
    
    router.push(`/login?${params.toString()}`)
  }

  const downloadQuotation = () => {
    // In real app, this would generate and download a PDF
    console.log('Downloading quotation PDF...')
    alert('سيتم تحميل عرض السعر كملف PDF')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Progress Stepper */}
      <ProgressStepper steps={steps} currentStep="quotation" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 space-x-reverse text-primary-600 hover:text-primary-700 font-arabic"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>العودة لتسجيل الدخول</span>
            </button>
            
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
                طلب عرض السعر
              </h1>
              <p className="text-lg text-gray-600 font-arabic">
                اختر كيف تريد استلام عرض السعر لطلبك
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quotation Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-arabic">
                اختر طريقة استلام عرض السعر
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quotationMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedMethod === method.id
                        ? method.color === 'primary' 
                          ? 'border-primary-500 bg-primary-50'
                          : method.color === 'success'
                          ? 'border-success-500 bg-success-50'
                          : 'border-warning-500 bg-warning-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${
                        method.color === 'primary' 
                          ? 'bg-primary-500'
                          : method.color === 'success'
                          ? 'bg-success-500'
                          : 'bg-warning-500'
                      }`}>
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        method.color === 'primary' 
                          ? 'bg-primary-100'
                          : method.color === 'success'
                          ? 'bg-success-100'
                          : 'bg-warning-100'
                      }`}>
                        <method.icon className={`h-8 w-8 ${
                          method.color === 'primary' 
                            ? 'text-primary-600'
                            : method.color === 'success'
                            ? 'text-success-600'
                            : 'text-warning-600'
                        }`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 font-arabic">
                        {method.nameAr}
                      </h3>
                      <p className="text-sm text-gray-600 font-arabic">
                        {method.descriptionAr}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Information Form */}
              {selectedMethod && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-arabic">
                    معلومات الاتصال
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                          الاسم الكامل
                        </label>
                        <input
                          type="text"
                          value={contactInfo.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 font-arabic"
                          placeholder="أدخل اسمك الكامل"
                          required
                        />
                      </div>

                      {(selectedMethod === 'email' || selectedMethod === 'both') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                            البريد الإلكتروني
                          </label>
                          <input
                            type="email"
                            value={contactInfo.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 font-arabic"
                            placeholder="أدخل بريدك الإلكتروني"
                            required
                          />
                        </div>
                      )}

                      {(selectedMethod === 'whatsapp' || selectedMethod === 'both') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                            رقم الهاتف
                          </label>
                          <input
                            type="tel"
                            value={contactInfo.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 font-arabic"
                            placeholder="أدخل رقم هاتفك"
                            required
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center space-x-2 space-x-reverse px-8 py-4 rounded-xl font-semibold font-arabic transition-all duration-300 ${
                          isSubmitting
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>جاري الإرسال...</span>
                          </>
                        ) : (
                          <>
                            <span>إرسال طلب عرض السعر</span>
                            <ArrowRightIcon className="h-5 w-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Actions */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">
                ملخص الطلب
              </h3>
              
              {parts && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-arabic">عدد قطع الغيار:</span>
                    <span className="font-semibold">{parts.split(',').length}</span>
                  </div>
                  
                  {brand && model && year && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-arabic">السيارة:</span>
                      <span className="font-semibold">تويوتا كورولا 2016</span>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={downloadQuotation}
                      className="w-full flex items-center justify-center space-x-2 space-x-reverse px-4 py-3 border-2 border-primary-300 text-primary-600 rounded-xl hover:bg-primary-50 transition-colors font-arabic"
                    >
                      <DocumentArrowDownIcon className="h-5 w-5" />
                      <span>تحميل عرض السعر كملف PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quotation Process Info */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-800 mb-4 font-arabic text-center">
                كيف يعمل عرض السعر؟
              </h3>
              <div className="space-y-3 text-sm text-primary-700 font-arabic">
                <div className="flex items-start space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2"></span>
                  <span>نستلم طلبك ونراجعه</span>
                </div>
                <div className="flex items-start space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2"></span>
                  <span>نبحث عن أفضل الأسعار</span>
                </div>
                <div className="flex items-start space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2"></span>
                  <span>نرسل لك عرض السعر خلال 24 ساعة</span>
                </div>
                <div className="flex items-start space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2"></span>
                  <span>يمكنك الموافقة أو طلب تعديلات</span>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-arabic text-center">
                تحتاج مساعدة؟
              </h3>
              <p className="text-sm text-gray-600 font-arabic text-center mb-4">
                فريق الدعم متاح لمساعدتك على مدار الساعة
              </p>
              <div className="space-y-2 text-sm text-gray-600 font-arabic">
                <p>📧 support@spareparts.com</p>
                <p>📱 +971 50 123 4567</p>
                <p>💬 WhatsApp: +971 50 123 4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
