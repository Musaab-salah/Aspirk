'use client'

import { useSearchParams } from 'next/navigation'
import { CheckCircleIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProgressStepper from '@/components/ProgressStepper'

export default function RequestSuccessPage() {
  const searchParams = useSearchParams()
  
  // Get order data from URL params
  const parts = searchParams.get('parts')
  const quantities = searchParams.get('quantities')
  const brand = searchParams.get('brand')
  const model = searchParams.get('model')
  const year = searchParams.get('year')
  const paymentMethod = searchParams.get('paymentMethod')

  // Progress steps - all completed
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
      isCompleted: true,
      isCurrent: false
    }
  ]

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'bank-transfer':
        return 'التحويل البنكي'
      case 'cash':
        return 'الدفع عند الاستلام'
      case 'fawry':
        return 'فوري'
      default:
        return 'غير محدد'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Progress Stepper - All Completed */}
      <ProgressStepper steps={steps} currentStep="payment" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-arabic">
            تم إتمام الطلب بنجاح! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 font-arabic max-w-2xl mx-auto leading-relaxed">
            شكراً لك! تم استلام طلبك بنجاح. سنقوم بمراجعته وإرسال عرض السعر إليك في أقرب وقت ممكن.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-arabic text-center">
            ملخص الطلب
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-arabic">عدد قطع الغيار:</span>
                <span className="font-semibold">{parts ? parts.split(',').length : 0}</span>
              </div>
              
              {brand && model && year && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-arabic">السيارة:</span>
                  <span className="font-semibold">تويوتا كورولا 2016</span>
                </div>
              )}
              
              {paymentMethod && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-arabic">طريقة الدفع:</span>
                  <span className="font-semibold">{getPaymentMethodName(paymentMethod)}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-arabic">رقم الطلب:</span>
                <span className="font-semibold text-primary-600">#{Date.now().toString().slice(-8)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-arabic">تاريخ الطلب:</span>
                <span className="font-semibold">{new Date().toLocaleDateString('ar-SA')}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-arabic">حالة الطلب:</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-arabic">
                  قيد المراجعة
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 mb-8 border border-primary-200">
          <h3 className="text-xl font-semibold text-primary-800 mb-4 font-arabic text-center">
            الخطوات التالية
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="font-semibold text-primary-800 mb-2 font-arabic">مراجعة الطلب</h4>
              <p className="text-sm text-primary-700 font-arabic">
                سنراجع طلبك خلال 24 ساعة
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold text-primary-800 mb-2 font-arabic">عرض السعر</h4>
              <p className="text-sm text-primary-700 font-arabic">
                سنرسل لك عرض السعر النهائي
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="font-semibold text-primary-800 mb-2 font-arabic">التوصيل</h4>
              <p className="text-sm text-primary-700 font-arabic">
                سنبدأ في تجهيز وتوصيل طلبك
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 font-arabic text-center">
            تحتاج مساعدة؟
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 mb-2 font-arabic">معلومات الاتصال</h4>
              <div className="space-y-2 text-sm text-gray-600 font-arabic">
                <p>📧 support@spareparts.com</p>
                <p>📱 +971 50 123 4567</p>
                <p>💬 WhatsApp: +971 50 123 4567</p>
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 mb-2 font-arabic">ساعات العمل</h4>
              <div className="space-y-2 text-sm text-gray-600 font-arabic">
                <p>الأحد - الخميس: 8:00 ص - 6:00 م</p>
                <p>الجمعة: 9:00 ص - 1:00 م</p>
                <p>السبت: 10:00 ص - 4:00 م</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 space-x-reverse px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors font-arabic shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <HomeIcon className="h-5 w-5" />
            <span>العودة للصفحة الرئيسية</span>
          </Link>
          
          <Link
            href="/user-dashboard"
            className="flex items-center justify-center space-x-2 space-x-reverse px-8 py-4 border-2 border-primary-300 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors font-arabic shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <UserIcon className="h-5 w-5" />
            <span>لوحة التحكم</span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
