import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'تسجيل الدخول - Spare Parts',
  description: 'سجل دخولك إلى حسابك للوصول إلى طلباتك وقطع الغيار',
  keywords: 'تسجيل دخول, login, حساب, account, قطع غيار',
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 font-arabic">
                تسجيل الدخول
              </h1>
              <p className="text-gray-600 font-arabic">
                سجل دخولك للوصول إلى حسابك
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form className="space-y-4">
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
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="mr-2 text-sm text-gray-600 font-arabic">تذكرني</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-arabic">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors font-arabic"
                >
                  تسجيل الدخول
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 font-arabic">
                  ليس لديك حساب؟{' '}
                  <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold font-arabic">
                    إنشاء حساب جديد
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
