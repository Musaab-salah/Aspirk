'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  DocumentTextIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import { Order, COUNTRIES } from '@/types'
import { processOrdersDates } from '@/utils/dateUtils'

// Mock data - in real app this would come from API
const mockUserOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerId: '1',
    carId: '1',
    status: 'pending',
    totalAmount: 450,
    shippingCost: 85,
    currency: 'AED',
    shippingMethod: 'air',
    destinationCountry: 'EG',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    customer: {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+971501234567',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    car: {
      id: '1',
      brandId: '1',
      modelId: '1',
      year: 2016,
      brand: { id: '1', name: 'Toyota', nameAr: 'تويوتا' },
      model: { id: '1', brandId: '1', name: 'Corolla', nameAr: 'كورولا', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    },
    items: [],
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerId: '1',
    carId: '2',
    status: 'approved',
    totalAmount: 320,
    shippingCost: 150,
    currency: 'AED',
    shippingMethod: 'air',
    destinationCountry: 'NG',
    createdAt: new Date('2024-01-14T15:45:00'),
    updatedAt: new Date('2024-01-14T16:20:00'),
    customer: {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+971501234567',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    car: {
      id: '2',
      brandId: '2',
      modelId: '4',
      year: 2018,
      brand: { id: '2', name: 'Hyundai', nameAr: 'هيونداي' },
      model: { id: '4', brandId: '2', name: 'Accent', nameAr: 'أكسنت', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    },
    items: [],
  },
]

export default function UserDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserOrders()
  }, [])

  const fetchUserOrders = async () => {
    try {
      // In a real app, you would get the user ID from authentication
      const userId = '1' // Mock user ID
      const response = await fetch(`/api/orders?customerId=${userId}`)
      const result = await response.json()
      
      if (result.success) {
        // Convert string dates back to Date objects
        const processedOrders = processOrdersDates(result.data)
        setOrders(processedOrders)
      } else {
        console.error('Failed to fetch orders:', result.error)
        // Fallback to mock data
        setOrders(mockUserOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      // Fallback to mock data
      setOrders(mockUserOrders)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد المراجعة'
      case 'approved':
        return 'تمت الموافقة'
      case 'rejected':
        return 'مرفوض'
      default:
        return 'غير محدد'
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusCount = (status: string) => {
    return orders.filter(order => order.status === status).length
  }

  const createNewRequest = () => {
    router.push('/new-request')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 font-arabic">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-arabic">
            لوحة التحكم
          </h1>
          <p className="text-gray-600 font-arabic">
            مرحباً بك في لوحة تحكم طلبات قطع الغيار
          </p>
        </div>
        <button
          onClick={createNewRequest}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-arabic flex items-center"
        >
          <PlusIcon className="h-5 w-5 ml-2" />
          طلب جديد
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-arabic">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-arabic">قيد المراجعة</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-arabic">تمت الموافقة</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('approved')}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-arabic">مرفوض</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('rejected')}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 font-arabic">
            الطلبات الحديثة
          </h2>
        </div>
        <div className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 font-arabic">لا توجد طلبات</h3>
              <p className="mt-1 text-sm text-gray-500 font-arabic">
                ابدأ بإنشاء طلب جديد لقطع الغيار
              </p>
              <div className="mt-6">
                <button
                  onClick={createNewRequest}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-arabic"
                >
                  إنشاء طلب جديد
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 space-x-reverse mb-2">
                        <h3 className="text-lg font-medium text-gray-900 font-arabic">
                          {order.orderNumber}
                        </h3>
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className={`mr-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full font-arabic ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 font-arabic">السيارة:</span>
                          <span className="mr-2 font-arabic">
                            {order.car.brand.nameAr} {order.car.model.nameAr} {order.car.year}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 font-arabic">المبلغ الإجمالي:</span>
                          <span className="mr-2">{order.totalAmount} {order.currency}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 font-arabic">الشحن:</span>
                          <span className="mr-2 font-arabic">
                            {order.shippingMethod === 'air' ? 'جوي' : 'بري'} - {COUNTRIES.find(c => c.code === order.destinationCountry)?.nameAr}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-arabic">تاريخ الطلب:</span> {order.createdAt.toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => router.push(`/my-orders`)}
                        className="text-primary-600 hover:text-primary-900 p-2"
                        title="عرض التفاصيل"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {orders.length > 5 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/my-orders')}
                className="text-primary-600 hover:text-primary-700 font-medium font-arabic"
              >
                عرض جميع الطلبات
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">
          إجراءات سريعة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={createNewRequest}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right"
          >
            <div className="flex items-center">
              <PlusIcon className="h-6 w-6 text-primary-600 ml-3" />
              <div>
                <p className="font-medium text-gray-900 font-arabic">إنشاء طلب جديد</p>
                <p className="text-sm text-gray-600 font-arabic">طلب قطع غيار جديدة</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/my-orders')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right"
          >
            <div className="flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-success-600 ml-3" />
              <div>
                <p className="font-medium text-gray-900 font-arabic">عرض جميع الطلبات</p>
                <p className="text-sm text-gray-600 font-arabic">مراجعة تاريخ الطلبات</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
