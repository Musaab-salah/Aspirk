'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { TrashIcon, PlusIcon, MinusIcon, ArrowLeftIcon, ArrowRightIcon, HomeIcon, TruckIcon, WrenchScrewdriverIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StepNavigation from '@/components/StepNavigation'
import Breadcrumb from '@/components/Breadcrumb'
import { SparePart, SparePartSelection } from '@/types'

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
    prices: {
      original: { aed: 65, sdg: 1950, usd: 18 },
      commercial: { aed: 45, sdg: 1350, usd: 12 }
    },
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
    prices: {
      original: { aed: 180, sdg: 5400, usd: 49 },
      commercial: { aed: 120, sdg: 3600, usd: 33 }
    },
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
    prices: {
      original: { aed: 55, sdg: 1650, usd: 15 },
      commercial: { aed: 35, sdg: 1050, usd: 10 }
    },
    isAvailable: true,
    partNumber: 'AF-003',
    countryOfOrigin: 'USA',
  },
  {
    id: '4',
    name: 'Shock Absorber',
    nameAr: 'ممتص الصدمات',
    description: 'Quality shock absorbers for smooth ride',
    descriptionAr: 'ممتصات صدمات عالية الجودة لرحلة مريحة',
    image: '/images/shock-absorber.svg',
    category: 'Suspension',
    categoryAr: 'نظام التعليق',
    compatibleCars: ['1', '2', '3'],
    prices: {
      original: { aed: 420, sdg: 12600, usd: 114 },
      commercial: { aed: 280, sdg: 8400, usd: 76 }
    },
    isAvailable: true,
    partNumber: 'SA-004',
    countryOfOrigin: 'Italy',
  },
  {
    id: '5',
    name: 'Battery',
    nameAr: 'البطارية',
    description: 'Long-lasting car battery',
    descriptionAr: 'بطارية سيارة طويلة العمر',
    image: '/images/battery.svg',
    category: 'Electrical',
    categoryAr: 'الأنظمة الكهربائية',
    compatibleCars: ['1', '2', '3'],
    prices: {
      original: { aed: 680, sdg: 20400, usd: 185 },
      commercial: { aed: 450, sdg: 13500, usd: 123 }
    },
    isAvailable: true,
    partNumber: 'BAT-005',
    countryOfOrigin: 'South Korea',
  },
  {
    id: '6',
    name: 'Headlight',
    nameAr: 'المصباح الأمامي',
    description: 'LED headlight for better visibility',
    descriptionAr: 'مصباح أمامي LED لرؤية أفضل',
    image: '/images/headlight.svg',
    category: 'Electrical',
    categoryAr: 'الأنظمة الكهربائية',
    compatibleCars: ['1', '2', '3'],
    prices: {
      original: { aed: 480, sdg: 14400, usd: 131 },
      commercial: { aed: 320, sdg: 9600, usd: 87 }
    },
    isAvailable: false,
    partNumber: 'HL-006',
    countryOfOrigin: 'China',
  },
]

interface OrderItem {
  part: SparePart
  quantity: number
  type: 'original' | 'commercial'
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
  const quantitiesParam = searchParams.get('quantities')
  const typesParam = searchParams.get('types')

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
      const quantities = quantitiesParam ? quantitiesParam.split(',').map(Number) : partIds.map(() => 1)
      const types = typesParam ? typesParam.split(',') as ('original' | 'commercial')[] : partIds.map(() => 'commercial' as const)
      
      const items: OrderItem[] = partIds.map((partId, index) => {
        const part = mockSpareParts.find(p => p.id === partId)
        if (part) {
          const type = types[index] || 'commercial'
          const quantity = quantities[index] || 1
          const price = part.prices[type].aed
          
          return {
            part,
            quantity,
            type,
            totalPrice: price * quantity
          }
        }
        return null
      }).filter(Boolean) as OrderItem[]
      
      setOrderItems(items)
    }
    setIsLoading(false)
  }, [partsParam, quantitiesParam, typesParam])

  const updateQuantity = (partId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setOrderItems(prev => prev.map(item => 
      item.part.id === partId 
        ? { ...item, quantity: newQuantity, totalPrice: item.part.prices[item.type].aed * newQuantity }
        : item
    ))
  }

  const updateType = (partId: string, newType: 'original' | 'commercial') => {
    setOrderItems(prev => prev.map(item => 
      item.part.id === partId 
        ? { ...item, type: newType, totalPrice: item.part.prices[newType].aed * item.quantity }
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
      alert('يرجى اختيار قطع الغيار المطلوبة قبل المتابعة')
      return
    }
    
    // Navigate to login page with order data
    const partsParam = orderItems.map(item => item.part.id).join(',')
    const quantitiesParam = orderItems.map(item => item.quantity).join(',')
    const typesParam = orderItems.map(item => item.type).join(',')
    router.push(`/login?parts=${partsParam}&quantities=${quantitiesParam}&types=${typesParam}&brand=${brand}&model=${model}&year=${year}`)
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <WrenchScrewdriverIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">
                لا توجد قطع غيار مختارة
              </h3>
              <p className="text-gray-500 font-arabic mb-6">
                يبدو أنك لم تختر أي قطع غيار بعد. يرجى العودة لصفحة قطع الغيار واختيار القطع المطلوبة.
              </p>
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
                      <th className="text-right py-4 px-4 font-semibold text-gray-900 font-arabic">النوع</th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-900 font-arabic">الأسعار</th>
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
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => updateType(item.part.id, 'original')}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                item.type === 'original'
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              أصلي
                            </button>
                            <button
                              onClick={() => updateType(item.part.id, 'commercial')}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                item.type === 'commercial'
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              تجاري
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-primary-600">
                              {item.part.prices[item.type].aed} AED
                            </div>
                            <div className="text-xs text-success-600">
                              {item.part.prices[item.type].sdg} SDG
                            </div>
                            <div className="text-xs text-warning-600">
                              ${item.part.prices[item.type].usd} USD
                            </div>
                          </div>
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
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-primary-600">
                              {item.totalPrice} AED
                            </div>
                            <div className="text-xs text-success-600">
                              {item.part.prices[item.type].sdg * item.quantity} SDG
                            </div>
                            <div className="text-xs text-warning-600">
                              ${item.part.prices[item.type].usd * item.quantity} USD
                            </div>
                          </div>
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
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-gray-900 font-arabic">المجموع الكلي:</span>
                    <div className="text-right space-y-1">
                      <div className="text-2xl font-bold text-primary-600">
                        {getTotalPrice()} AED
                      </div>
                      <div className="text-lg font-semibold text-success-600">
                        {orderItems.reduce((total, item) => total + (item.part.prices[item.type].sdg * item.quantity), 0)} SDG
                      </div>
                      <div className="text-lg font-semibold text-warning-600">
                        ${orderItems.reduce((total, item) => total + (item.part.prices[item.type].usd * item.quantity), 0)} USD
                      </div>
                    </div>
                  </div>
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
