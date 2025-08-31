'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
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

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const createNewRequest = () => {
    // Navigate to new request page
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
            طلباتي
          </h1>
          <p className="text-gray-600 font-arabic">
            عرض وإدارة طلبات قطع الغيار
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

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 font-arabic">
            تاريخ الطلبات ({orders.length})
          </h2>
        </div>
        <div className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 font-arabic">لا توجد طلبات حتى الآن</p>
              <button
                onClick={createNewRequest}
                className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-arabic"
              >
                إنشاء طلب جديد
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
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
                        onClick={() => openOrderDetails(order)}
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
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 font-arabic">
                تفاصيل الطلب {selectedOrder.orderNumber}
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700 font-arabic">الحالة:</span>
                  <span className={`mr-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full font-arabic ${getStatusClass(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">السيارة:</span>
                  <span className="mr-2 font-arabic">
                    {selectedOrder.car.brand.nameAr} {selectedOrder.car.model.nameAr} {selectedOrder.car.year}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">المبلغ الإجمالي:</span>
                  <span className="mr-2">{selectedOrder.totalAmount} {selectedOrder.currency}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">تكلفة الشحن:</span>
                  <span className="mr-2">{selectedOrder.shippingCost} {selectedOrder.currency}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">طريقة الشحن:</span>
                  <span className="mr-2 font-arabic">
                    {selectedOrder.shippingMethod === 'air' ? 'جوي' : 'بري'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">دولة الوجهة:</span>
                  <span className="mr-2 font-arabic">
                    {COUNTRIES.find(c => c.code === selectedOrder.destinationCountry)?.nameAr}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">تاريخ الطلب:</span>
                  <span className="mr-2">{selectedOrder.createdAt.toLocaleDateString('ar-SA')}</span>
                </div>
                {selectedOrder.notes && (
                  <div>
                    <span className="font-medium text-gray-700 font-arabic">ملاحظات:</span>
                    <span className="mr-2 font-arabic">{selectedOrder.notes}</span>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-arabic"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
