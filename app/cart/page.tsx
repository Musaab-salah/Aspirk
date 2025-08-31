import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'سلة المشتريات - Spare Parts',
  description: 'عرض قطع الغيار المضافة إلى سلة المشتريات',
  keywords: 'سلة المشتريات, cart, قطع غيار, spare parts',
}

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-arabic">
              سلة المشتريات
            </h1>
            <p className="text-gray-600 font-arabic">
              عرض قطع الغيار المضافة إلى سلة المشتريات
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCartIcon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">
                سلة المشتريات فارغة
              </h3>
              <p className="text-gray-600 mb-6 font-arabic">
                ابدأ بإضافة قطع الغيار إلى سلة المشتريات
              </p>
              <Link
                href="/car-selector"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors font-arabic"
              >
                اختيار قطع الغيار
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
