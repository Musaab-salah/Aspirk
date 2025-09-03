'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { TrashIcon, PlusIcon, MinusIcon, ArrowLeftIcon, ArrowRightIcon, HomeIcon, TruckIcon, WrenchScrewdriverIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StepNavigation from '@/components/StepNavigation'
import Breadcrumb from '@/components/Breadcrumb'
import { SparePart } from '@/types'

// Mock data - in real app this would come from API
const mockSpareParts: SparePart[] = [
  {
    id: '1',
    name: 'Oil Filter',
    nameAr: 'فلتر الزيت',
    description: 'High quality oil filter for engine protection',
    descriptionAr: 'فلتر زيت عالي الجودة لحماية المحرك',
    image: '/images/air-filter.svg',
    category: 'Engine Parts',
    categoryAr: 'قطع المحرك',
    compatibleCars: ['1', '2', '3'],
    price: 45,
    currency: 'AED',
    isAvailable: true,
    partNumber: 'OF-001',
    countryOfOrigin: 'Germany',
  },
  {
    id: '2',
    name: 'Brake Pads',
    nameAr: 'بطانات الفرامل',
    description: 'Premium brake pads for optimal stopping power',
    descriptionAr: 'بطانات فرامل مميزة لقوة توقف مثالية',
    image: '/images/brake-pads.svg',
    category: 'Brake System',
    categoryAr: 'نظام الفرامل',
    compatibleCars: ['1', '2', '3'],
    price: 120,
    currency: 'AED',
    isAvailable: true,
    partNumber: 'BP-002',
    countryOfOrigin: 'Japan',
  },
  {
    id: '3',
    name: 'Air Filter',
    nameAr: 'فلتر الهواء',
    description: 'Air filter for clean engine air intake',
    descriptionAr: 'فلتر هواء لمدخل هواء نظيف للمحرك',
    image: '/images/air-filter.svg',
    category: 'Engine Parts',
    categoryAr: 'قطع المحرك',
    compatibleCars: ['1', '2', '3'],
    price: 35,
    currency: 'AED',
    isAvailable: true,
    partNumber: 'AF-003',
    countryOfOrigin: 'USA',
  },
]

interface OrderItem {
  part: SparePart
  quantity: number
  totalPrice: number
}

export default function OrderReviewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const brand = searchParams.get('brand')
  const model = searchParams.get('model')
  const year = searchParams.get('year')
  const partsParam = searchParams.get('parts')

  // Progress steps
  const steps = [
    {
      id: 'home',
      title: 'Home',
      titleAr: 'الرئيسية',
      icon: HomeIcon,
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
      icon: WrenchScrewdriverIcon,
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'confirm-order',
      title: 'Confirm Order',
      titleAr: 'تأكيد الطلب',
      icon: ClipboardDocumentCheckIcon,
      isCompleted: false,
      isCurrent: true
    }
  ]

  useEffect(() => {
    if (partsParam) {
      const partIds = partsParam.split(',')
      const items: OrderItem[] = partIds.map(partId => {
        const part = mockSpareParts.find(p => p.id === partId)
        if (part) {
          return {
            part,
            quantity: 1,
            totalPrice: part.price || 0
          }
        }
        return null
      }).filter(Boolean) as OrderItem[]
      
      setOrderItems(items)
    }
    setIsLoading(false)
  }, [partsParam])

  const updateQuantity = (partId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setOrderItems(prev => prev.map(item => 
      item.part.id === partId 
        ? { ...item, quantity: newQuantity, totalPrice: (item.part.price || 0) * newQuantity }
        : item
    ))
  }

  const removeItem = (partId: string) => {
    setOrderItems(prev => prev.filter(item => item.part.id !== partId))
  }

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.totalPrice, 0)
  }

  const handleContinue = () => {
    if (orderItems.length === 0) {
      alert('يرجى اختيار قطع الغيار المطلوبة')
      return
    }
    
    // Navigate to login page with order data
    const partsParam = orderItems.map(item => item.part.id).join(',')
    const quantitiesParam = orderItems.map(item => item.quantity).join(',')
    router.push(`/login?parts=${partsParam}&quantities=${quantitiesParam}&brand=${brand}&model=${model}&year=${year}`)
  }

  const handleBack = () => {
    router.push(`/spare-parts?brand=${brand}&model=${model}&year=${year}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-arabic">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Step Navigation */}
      <StepNavigation currentStep="confirm-order" steps={steps} />
      
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { name: 'Select Car', nameAr: 'اختيار السيارة', href: '/' },
              { name: 'Spare Parts', nameAr: 'قطع الغيار', href: `/spare-parts?brand=${brand}&model=${model}&year=${year}` },
              { name: 'Confirm Order', nameAr: 'تأكيد الطلب', isCurrent: true }
            ]} 
          />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 space-x-reverse text-primary-600 hover:text-primary-700 font-arabic"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>العودة لاختيار قطع الغيار</span>
              </button>
              
              <div className="text-right">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
                  مراجعة الطلب
                </h1>
                {brand && model && year && (
                  <p className="text-lg text-gray-600 font-arabic">
                    السيارة المختارة: تويوتا كورولا 2016
                  </p>
                )}
              </div>
            </div>
          </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-arabic">
            ملخص الطلب
          </h2>
          
          {orderItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-arabic mb-4">لم يتم اختيار أي قطع غيار</p>
              <button
                onClick={handleBack}
                className="btn-primary font-arabic"
              >
                العودة لاختيار قطع الغيار
              </button>
            </div>
          ) : (
            <>
              {/* Order Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-4 px-4 font-semibold text-gray-900 font-arabic">القطعة</th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-900 font-arabic">الوصف</th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-900 font-arabic">السعر</th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-900 font-arabic">الكمية</th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-900 font-arabic">المجموع</th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-900 font-arabic">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.part.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <img 
                              src={item.part.image} 
                              alt={item.part.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-semibold text-gray-900 font-arabic">{item.part.nameAr}</p>
                              <p className="text-sm text-gray-500">{item.part.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600 font-arabic max-w-xs">
                            {item.part.descriptionAr}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-gray-900">
                            {item.part.price} {item.part.currency}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => updateQuantity(item.part.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                              <MinusIcon className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.part.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                              <PlusIcon className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-primary-600">
                            {item.totalPrice} {item.part.currency}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => removeItem(item.part.id)}
                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Total */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-900 font-arabic">المجموع الكلي:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {getTotalPrice()} AED
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 space-x-reverse px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors font-arabic"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>العودة</span>
          </button>

          <button
            onClick={handleContinue}
            disabled={orderItems.length === 0}
            className={`flex items-center space-x-2 space-x-reverse px-8 py-4 rounded-xl font-semibold font-arabic transition-all duration-300 ${
              orderItems.length > 0
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>متابعة الطلب</span>
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
