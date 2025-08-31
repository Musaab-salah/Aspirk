import type { Metadata } from 'next'
import CarSelector from '@/components/CarSelector'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'اختيار السيارة - Spare Parts',
  description: 'اختر ماركة وموديل وسنة سيارتك للعثور على قطع الغيار المناسبة',
  keywords: 'اختيار السيارة, ماركة, موديل, سنة, قطع غيار, car selector, brand, model, year',
}

export default function CarSelectorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-arabic">
              اختر سيارتك
            </h1>
            <p className="text-lg text-gray-600 font-arabic">
              اختر ماركة وموديل وسنة سيارتك للعثور على قطع الغيار المناسبة
            </p>
          </div>
          
          <CarSelector />
        </div>
      </main>
      <Footer />
    </>
  )
}
