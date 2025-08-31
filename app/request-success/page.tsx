'use client'

import { CheckCircleIcon, ClockIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function RequestSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100 mb-6">
            <CheckCircleIcon className="h-8 w-8 text-success-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-arabic">
            تم إرسال طلبك بنجاح!
          </h1>
          <p className="text-lg text-gray-600 mb-8 font-arabic">
            شكراً لك على طلبك. سنراجع تفاصيل الطلب ونتواصل معك قريباً
          </p>

          {/* Order Number */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-arabic">
              تفاصيل الطلب
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-arabic">رقم الطلب:</span>
                <span className="font-semibold text-gray-900">#12345</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-arabic">تاريخ الطلب:</span>
                <span className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString('ar-SA')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-arabic">حالة الطلب:</span>
                <span className="status-pending font-arabic">قيد المراجعة</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 font-arabic">
              الخطوات التالية
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-right">
                  <p className="font-medium text-blue-900 font-arabic">
                    مراجعة الطلب
                  </p>
                  <p className="text-sm text-blue-700 font-arabic">
                    سنراجع طلبك خلال 24 ساعة ونؤكد الأسعار والتوفر
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <EnvelopeIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-right">
                  <p className="font-medium text-blue-900 font-arabic">
                    إشعار بالبريد الإلكتروني
                  </p>
                  <p className="text-sm text-blue-700 font-arabic">
                    ستتلقى رسالة بريد إلكتروني مع تفاصيل الفاتورة النهائية
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-right">
                  <p className="font-medium text-blue-900 font-arabic">
                    تأكيد الطلب
                  </p>
                  <p className="text-sm text-blue-700 font-arabic">
                    بعد مراجعة الفاتورة، يمكنك تأكيد الطلب والدفع
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">
              معلومات الاتصال
            </h3>
            <div className="space-y-2 text-gray-600 font-arabic">
              <p>البريد الإلكتروني: info@spareparts-uae.ae</p>
              <p>الهاتف: +971 50 123 4567</p>
              <p>ساعات العمل: 24/7</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary font-arabic"
            >
              العودة للصفحة الرئيسية
            </Link>
            <Link
              href="/my-orders"
              className="btn-secondary font-arabic"
            >
              عرض طلباتي
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
