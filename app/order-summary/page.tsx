'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TruckIcon, 
  BuildingOfficeIcon, 
  MapPinIcon, 
  CheckIcon, 
  ArrowLeftIcon,
  ClipboardDocumentCheckIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StepNavigation from '@/components/StepNavigation'
import Breadcrumb from '@/components/Breadcrumb'
import { SparePartSelection, ShippingCost } from '@/types'

interface OrderData {
  parts: SparePartSelection[]
  shippingMethod: 'land' | 'sea'
  state: string
  city: string
  shippingCost: ShippingCost
  brand?: string
  model?: string
  year?: string
}

export default function OrderSummaryPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Define the workflow steps
  const steps = [
    {
      id: 'home',
      title: 'Home',
      titleAr: 'الرئيسية',
      icon: TruckIcon,
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
      icon: TruckIcon,
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'shipping',
      title: 'Shipping',
      titleAr: 'الشحن',
      icon: TruckIcon,
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'order-summary',
      title: 'Order Summary',
      titleAr: 'ملخص الطلب',
      icon: ClipboardDocumentCheckIcon,
      isCompleted: false,
      isCurrent: true
    }
  ]

  useEffect(() => {
    loadOrderData()
  }, [])

  const loadOrderData = () => {
    try {
      const storedData = sessionStorage.getItem('orderData')
      if (storedData) {
        const data = JSON.parse(storedData)
        setOrderData(data)
      } else {
        // Redirect to spare parts if no data
        router.push('/spare-parts')
      }
    } catch (error) {
      console.error('Error loading order data:', error)
      router.push('/spare-parts')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateSubtotal = () => {
    if (!orderData) return 0
    return orderData.parts.reduce((total, selection) => 
      total + (selection.part.prices[selection.type]?.sdg || 0) * selection.quantity, 0
    )
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shippingCost = orderData?.shippingCost?.baseCost || 0
    return subtotal + shippingCost
  }

  const handleSubmitOrder = async () => {
    if (!orderData) return

    setIsSubmitting(true)

    try {
      // Here you would typically send the order to your API
      // For now, we'll just show a success message and redirect
      
      // Clear the stored data
      sessionStorage.removeItem('orderData')
      
      // Redirect to success page or back to home
      router.push('/request-success')
    } catch (error) {
      console.error('Error submitting order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditShipping = () => {
    router.push('/shipping')
  }

  const handleEditParts = () => {
    router.push('/spare-parts')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-arabic">
              لا توجد بيانات طلب
            </h1>
            <p className="text-gray-600 mb-6 font-arabic">
              يرجى العودة لاختيار قطع الغيار
            </p>
            <button
              onClick={() => router.push('/spare-parts')}
              className="btn-primary font-arabic"
            >
              العودة لقطع الغيار
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const subtotal = calculateSubtotal()
  const total = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Step Navigation */}
      <StepNavigation currentStep="order-summary" steps={steps} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { name: 'Select Car', nameAr: 'اختيار السيارة', href: '/' },
            { name: 'Spare Parts', nameAr: 'قطع الغيار', href: '/spare-parts' },
            { name: 'Shipping', nameAr: 'الشحن', href: '/shipping' },
            { name: 'Order Summary', nameAr: 'ملخص الطلب', isCurrent: true }
          ]} 
        />
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 ml-2" />
              <span className="font-arabic">العودة</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
            ملخص الطلب
          </h1>
          <p className="text-lg text-gray-600 font-arabic">
            راجع تفاصيل طلبك قبل التأكيد
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Information */}
            {orderData.brand && orderData.model && orderData.year && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">
                  معلومات السيارة
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 font-arabic">
                      {orderData.brand} {orderData.model} {orderData.year}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/')}
                    className="text-primary-600 hover:text-primary-700 font-arabic text-sm"
                  >
                    تغيير السيارة
                  </button>
                </div>
              </div>
            )}

            {/* Selected Parts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 font-arabic">
                  قطع الغيار المختارة
                </h2>
                <button
                  onClick={handleEditParts}
                  className="text-primary-600 hover:text-primary-700 font-arabic text-sm"
                >
                  تعديل
                </button>
              </div>
              <div className="space-y-4">
                {orderData.parts.map((selection, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 font-arabic">
                        {selection.part.nameAr}
                      </h3>
                      <p className="text-sm text-gray-600 font-arabic">
                        الكمية: {selection.quantity} • النوع: {selection.type === 'original' ? 'أصلي' : 'تجاري'}
                      </p>
                      <p className="text-sm text-gray-500 font-arabic">
                        رقم القطعة: {selection.part.partNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">
                        {(selection.part.prices[selection.type]?.sdg || 0) * selection.quantity} جنيه
                      </p>
                      <p className="text-sm text-gray-500">
                        {selection.part.prices[selection.type]?.sdg || 0} × {selection.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 font-arabic">
                  معلومات الشحن
                </h2>
                <button
                  onClick={handleEditShipping}
                  className="text-primary-600 hover:text-primary-700 font-arabic text-sm"
                >
                  تعديل
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-primary-100 rounded-lg ml-3">
                    {orderData.shippingMethod === 'land' ? (
                      <TruckIcon className="h-5 w-5 text-primary-600" />
                    ) : (
                      <BuildingOfficeIcon className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 font-arabic">
                      طريقة الشحن: {orderData.shippingMethod === 'land' ? 'بري' : 'بحري'}
                    </p>
                    <p className="text-sm text-gray-600 font-arabic">
                      المدة المتوقعة: {orderData.shippingCost.estimatedDays} أيام
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-primary-100 rounded-lg ml-3">
                    <MapPinIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 font-arabic">
                      الوجهة: {orderData.city}
                    </p>
                    <p className="text-sm text-gray-600 font-arabic">
                      الولاية: {orderData.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">
                ملخص التكلفة
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-arabic">المجموع الفرعي:</span>
                  <span className="font-medium">{subtotal} جنيه</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-arabic">تكلفة الشحن:</span>
                  <span className="font-medium">
                    {orderData.shippingCost.baseCost} جنيه
                    {orderData.shippingCost.freeShippingThreshold && subtotal >= orderData.shippingCost.freeShippingThreshold && (
                      <span className="text-green-600 text-sm mr-1">(مجاني)</span>
                    )}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 font-arabic">المجموع الكلي:</span>
                    <span className="text-lg font-bold text-primary-600">
                      {orderData.shippingCost.freeShippingThreshold && subtotal >= orderData.shippingCost.freeShippingThreshold 
                        ? subtotal 
                        : total} جنيه
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {orderData.shippingCost.freeShippingThreshold && subtotal < orderData.shippingCost.freeShippingThreshold && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-arabic">
                    أضف {orderData.shippingCost.freeShippingThreshold - subtotal} جنيه أخرى للحصول على شحن مجاني
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-arabic flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري إرسال الطلب...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 ml-2" />
                    تأكيد الطلب
                  </>
                )}
              </button>

              {/* Additional Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 font-arabic">
                  سيتم مراجعة طلبك وإرسال عرض السعر خلال 24 ساعة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
