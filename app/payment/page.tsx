'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon, CheckIcon, CreditCardIcon, BuildingLibraryIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProgressStepper from '@/components/ProgressStepper'

interface PaymentMethod {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  instructions: string[]
  instructionsAr: string[]
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bankek',
    name: 'Bankek',
    nameAr: 'بنكك',
    description: 'Pay via Bank of Khartoum app',
    descriptionAr: 'ادفع عبر تطبيق بنك الخرطوم',
    icon: BuildingLibraryIcon,
    color: 'primary',
    instructions: [
      'Open Bankek app on your phone',
      'Login to your Bank of Khartoum account',
      'Select "Send Money" or "Transfer"',
      'Enter our account details and amount',
      'Include your order number in the description',
      'Confirm the transfer and keep the receipt'
    ],
    instructionsAr: [
      'افتح تطبيق بنكك على هاتفك',
      'سجل دخول إلى حساب بنك الخرطوم',
      'اختر "إرسال أموال" أو "تحويل"',
      'أدخل تفاصيل حسابنا والمبلغ',
      'أضف رقم طلبك في الوصف',
      'أكد التحويل واحتفظ بالإيصال'
    ]
  },
  {
    id: 'kashi',
    name: 'Kashi',
    nameAr: 'كاشي',
    description: 'Pay via Omdurman National Bank app',
    descriptionAr: 'ادفع عبر تطبيق البنك الوطني أم درمان',
    icon: CreditCardIcon,
    color: 'warning',
    instructions: [
      'Open Kashi app on your phone',
      'Login to your Omdurman National Bank account',
      'Select "Payments" or "Transfer"',
      'Enter our bank details and payment amount',
      'Add your order number in the reference field',
      'Complete the payment and save the confirmation'
    ],
    instructionsAr: [
      'افتح تطبيق كاشي على هاتفك',
      'سجل دخول إلى حساب البنك الوطني أم درمان',
      'اختر "المدفوعات" أو "تحويل"',
      'أدخل تفاصيل البنك ومبلغ الدفع',
      'أضف رقم طلبك في حقل المرجع',
      'أكمل الدفع واحفظ التأكيد'
    ]
  },
  {
    id: 'fawry',
    name: 'Fawry',
    nameAr: 'فوري',
    description: 'Pay via Bank of Faisal app',
    descriptionAr: 'ادفع عبر تطبيق بنك فيصل',
    icon: BanknotesIcon,
    color: 'success',
    instructions: [
      'Open Fawry app on your phone',
      'Login to your Bank of Faisal account',
      'Select "Pay Bills" or "Send Money"',
      'Enter our account information and amount',
      'Include your order number in the notes',
      'Confirm payment and keep the receipt'
    ],
    instructionsAr: [
      'افتح تطبيق فوري على هاتفك',
      'سجل دخول إلى حساب بنك فيصل',
      'اختر "دفع الفواتير" أو "إرسال أموال"',
      'أدخل معلومات حسابنا والمبلغ',
      'أضف رقم طلبك في الملاحظات',
      'أكد الدفع واحتفظ بالإيصال'
    ]
  }
]

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Get order data from URL params
  const parts = searchParams.get('parts')
  const quantities = searchParams.get('quantities')
  const brand = searchParams.get('brand')
  const model = searchParams.get('model')
  const year = searchParams.get('year')
  const quotationMethod = searchParams.get('quotationMethod')

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
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'payment',
      title: 'Payment',
      titleAr: 'الدفع',
      description: 'Complete payment',
      descriptionAr: 'أكمل الدفع',
      isCompleted: false,
      isCurrent: true
    }
  ]

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('يرجى اختيار طريقة الدفع')
      return
    }

    setIsProcessing(true)

    try {
      // In real app, this would process the payment
      console.log('Processing payment with method:', selectedMethod)
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Navigate to success page
      const params = new URLSearchParams()
      if (parts) params.append('parts', parts)
      if (quantities) params.append('quantities', quantities)
      if (brand) params.append('brand', brand)
      if (model) params.append('model', model)
      if (year) params.append('year', year)
      params.append('paymentMethod', selectedMethod)
      
      router.push(`/request-success?${params.toString()}`)
    } catch (error) {
      console.error('Payment error:', error)
      alert('حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBack = () => {
    const params = new URLSearchParams()
    if (parts) params.append('parts', parts)
    if (quantities) params.append('quantities', quantities)
    if (brand) params.append('brand', brand)
    if (model) params.append('model', model)
    if (year) params.append('year', year)
    params.append('quotationMethod', quotationMethod || '')
    
    router.push(`/quotation?${params.toString()}`)
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Progress Stepper */}
      <ProgressStepper steps={steps} currentStep="payment" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 space-x-reverse text-primary-600 hover:text-primary-700 font-arabic"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>العودة لطلب عرض السعر</span>
            </button>
            
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
                إتمام الدفع - السودان
              </h1>
              <p className="text-lg text-gray-600 font-arabic">
                اختر طريقة الدفع المناسبة لك عبر تطبيقات البنوك السودانية
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-arabic">
                طرق الدفع المتاحة في السودان
              </h2>
              
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedMethod === method.id
                        ? `border-${method.color}-500 bg-${method.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <div className={`absolute top-4 right-4 w-6 h-6 bg-${method.color}-500 rounded-full flex items-center justify-center`}>
                        <CheckIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className={`w-16 h-16 bg-${method.color}-100 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <method.icon className={`h-8 w-8 text-${method.color}-600`} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-arabic">
                          {method.nameAr}
                        </h3>
                        <p className="text-gray-600 font-arabic mb-4">
                          {method.descriptionAr}
                        </p>
                        
                        {/* Payment Instructions */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-800 font-arabic">تعليمات الدفع:</h4>
                          <ul className="space-y-1">
                            {method.instructionsAr.map((instruction, index) => (
                              <li key={index} className="flex items-start space-x-2 space-x-reverse text-sm text-gray-600 font-arabic">
                                <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sudan Bank Details */}
              {selectedMethod && (
                <div className="mt-6 p-6 bg-primary-50 rounded-2xl border border-primary-200">
                  <h3 className="text-lg font-semibold text-primary-800 mb-4 font-arabic">
                    تفاصيل الحساب البنكي في السودان
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-arabic">
                    <div>
                      <span className="text-primary-700">اسم البنك:</span>
                      <span className="mr-2 font-semibold">بنك الخرطوم</span>
                    </div>
                    <div>
                      <span className="text-primary-700">اسم الحساب:</span>
                      <span className="mr-2 font-semibold">شركة قطع الغيار السودان</span>
                    </div>
                    <div>
                      <span className="text-primary-700">رقم الحساب:</span>
                      <span className="mr-2 font-semibold">1234567890</span>
                    </div>
                    <div>
                      <span className="text-primary-700">IBAN:</span>
                      <span className="mr-2 font-semibold">SD123456789012345678901</span>
                    </div>
                    <div>
                      <span className="text-primary-700">Swift Code:</span>
                      <span className="mr-2 font-semibold">BKHKSDAD</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-sm text-yellow-800 font-arabic text-center">
                      💡 استخدم تطبيق البنك المحدد لإتمام عملية الدفع بسهولة وأمان
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              {selectedMethod && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full flex items-center justify-center space-x-2 space-x-reverse px-8 py-4 rounded-xl font-semibold font-arabic transition-all duration-300 ${
                      isProcessing
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>جاري معالجة الدفع...</span>
                      </>
                    ) : (
                      <>
                        <span>إتمام الدفع</span>
                        <CheckIcon className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Payment Info */}
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
                  
                  {quotationMethod && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-arabic">طريقة الاستلام:</span>
                      <span className="font-semibold">
                        {quotationMethod === 'email' ? 'البريد الإلكتروني' : 
                         quotationMethod === 'whatsapp' ? 'واتساب' : 'كلاهما'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Security */}
            <div className="bg-gradient-to-r from-success-50 to-success-100 rounded-2xl p-6 border border-success-200">
              <h3 className="text-lg font-semibold text-success-800 mb-4 font-arabic text-center">
                🔒 أمان الدفع
              </h3>
              <div className="space-y-3 text-sm text-success-700 font-arabic">
                <div className="flex items-start space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-success-600 rounded-full mt-2"></span>
                  <span>جميع المعاملات آمنة ومشفرة</span>
                </div>
                <div className="flex items-start space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-success-600 rounded-full mt-2"></span>
                  <span>بياناتك محمية ومؤمنة</span>
                </div>
                <div className="flex items-start space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-success-600 rounded-full mt-2"></span>
                  <span>لا نخزن معلومات الدفع</span>
                </div>
              </div>
            </div>

            {/* Payment Support */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-arabic text-center">
                تحتاج مساعدة في الدفع؟
              </h3>
              <p className="text-sm text-gray-600 font-arabic text-center mb-4">
                فريق الدعم متاح لمساعدتك
              </p>
              <div className="space-y-2 text-sm text-gray-600 font-arabic">
                <p>📧 payments@spareparts.sd</p>
                <p>📱 +249 91 123 4567</p>
                <p>💬 WhatsApp: +249 91 123 4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
