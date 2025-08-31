import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'إنشاء حساب جديد - Spare Parts',
  description: 'أنشئ حسابك الجديد للوصول إلى خدمات قطع الغيار',
  keywords: 'إنشاء حساب, register, حساب جديد, signup, قطع غيار',
}

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 font-arabic">
                إنشاء حساب جديد
              </h1>
              <p className="text-gray-600 font-arabic">
                أنشئ حسابك للوصول إلى خدمات قطع الغيار
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                      placeholder="الاسم الأول"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                      اسم العائلة
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                      placeholder="اسم العائلة"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                    placeholder="+971501234567"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                    placeholder="أدخل كلمة المرور"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                    placeholder="أعد إدخال كلمة المرور"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="mr-2 text-sm text-gray-600 font-arabic">
                    أوافق على{' '}
                    <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                      الشروط والأحكام
                    </Link>
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors font-arabic"
                >
                  إنشاء الحساب
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 font-arabic">
                  لديك حساب بالفعل؟{' '}
                  <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold font-arabic">
                    تسجيل الدخول
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
