'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Order, COUNTRIES } from '@/types'
import { processOrdersDates } from '@/utils/dateUtils'

// Mock data - in real app this would come from API
const mockOrders: Order[] = [
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
    notes: 'Need urgent delivery',
    adminNotes: '',
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
    customerId: '2',
    carId: '2',
    status: 'approved',
    totalAmount: 320,
    shippingCost: 150,
    currency: 'AED',
    shippingMethod: 'air',
    destinationCountry: 'NG',
    notes: 'Standard delivery is fine',
    adminNotes: 'Approved after price verification',
    createdAt: new Date('2024-01-14T15:45:00'),
    updatedAt: new Date('2024-01-14T16:20:00'),
    customer: {
      id: '2',
      name: 'سارة أحمد',
      email: 'sara@example.com',
      phone: '+971507654321',
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
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerId: '3',
    carId: '3',
    status: 'rejected',
    totalAmount: 280,
    shippingCost: 100,
    currency: 'AED',
    shippingMethod: 'air',
    destinationCountry: 'KE',
    notes: 'Budget constraint',
    adminNotes: 'Rejected due to unavailability of parts',
    createdAt: new Date('2024-01-13T09:15:00'),
    updatedAt: new Date('2024-01-13T14:30:00'),
    customer: {
      id: '3',
      name: 'محمد علي',
      email: 'mohamed@example.com',
      phone: '+971509876543',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    car: {
      id: '3',
      brandId: '3',
      modelId: '7',
      year: 2019,
      brand: { id: '3', name: 'Nissan', nameAr: 'نيسان' },
      model: { id: '7', brandId: '3', name: 'Altima', nameAr: 'ألتيما', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    },
    items: [],
  },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter))
    }
  }, [orders, statusFilter])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const result = await response.json()
      
      if (result.success) {
        // Convert string dates back to Date objects
        const processedOrders = processOrdersDates(result.data)
        setOrders(processedOrders)
      } else {
        console.error('Failed to fetch orders:', result.error)
        // Fallback to mock data
        setOrders(mockOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      // Fallback to mock data
      setOrders(mockOrders)
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

  const openActionModal = (order: Order, type: 'approve' | 'reject') => {
    setSelectedOrder(order)
    setActionType(type)
    setAdminNotes('')
    setIsActionModalOpen(true)
  }

  const handleAction = async () => {
    if (!selectedOrder || !actionType) return

    setIsSubmitting(true)
    try {
      const endpoint = actionType === 'approve' ? 'approve' : 'reject'
      const response = await fetch(`/api/orders/${selectedOrder.id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminNotes }),
      })

      const result = await response.json()

      if (result.success) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === selectedOrder.id 
              ? { ...order, status: actionType === 'approve' ? 'approved' : 'rejected', adminNotes, updatedAt: new Date() }
              : order
          )
        )
        
        setIsActionModalOpen(false)
        setSelectedOrder(null)
        setActionType(null)
        setAdminNotes('')
      } else {
        alert('حدث خطأ أثناء تنفيذ العملية')
      }
    } catch (error) {
      console.error('Error performing action:', error)
      alert('حدث خطأ أثناء تنفيذ العملية')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusCount = (status: string) => {
    return orders.filter(order => order.status === status).length
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-arabic">
          إدارة الطلبات
        </h1>
        <p className="text-gray-600 font-arabic">
          مراجعة وإدارة جميع طلبات العملاء
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-arabic">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <FunnelIcon className="h-6 w-6 text-gray-600" />
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <label className="text-sm font-medium text-gray-700 font-arabic">تصفية حسب الحالة:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">جميع الطلبات</option>
            <option value="pending">قيد المراجعة</option>
            <option value="approved">تمت الموافقة</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 font-arabic">
            الطلبات ({filteredOrders.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  رقم الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  السيارة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-arabic">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-arabic">{order.customer.name}</div>
                      <div className="text-gray-500 text-xs">{order.customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-arabic">
                    {order.car.brand.nameAr} {order.car.model.nameAr} {order.car.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.totalAmount} {order.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className={`mr-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full font-arabic ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-arabic">
                    {order.createdAt.toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="text-primary-600 hover:text-primary-900 p-1"
                        title="عرض التفاصيل"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => openActionModal(order, 'approve')}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="موافقة"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openActionModal(order, 'reject')}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="رفض"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 font-arabic">لا توجد طلبات</p>
          </div>
        )}
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
                  <span className="font-medium text-gray-700 font-arabic">العميل:</span>
                  <span className="mr-2 font-arabic">{selectedOrder.customer.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">البريد الإلكتروني:</span>
                  <span className="mr-2">{selectedOrder.customer.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">الهاتف:</span>
                  <span className="mr-2">{selectedOrder.customer.phone}</span>
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
                    <span className="font-medium text-gray-700 font-arabic">ملاحظات العميل:</span>
                    <span className="mr-2 font-arabic">{selectedOrder.notes}</span>
                  </div>
                )}
                {selectedOrder.adminNotes && (
                  <div>
                    <span className="font-medium text-gray-700 font-arabic">ملاحظات الإدارة:</span>
                    <span className="mr-2 font-arabic">{selectedOrder.adminNotes}</span>
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

      {/* Action Modal */}
      {isActionModalOpen && selectedOrder && actionType && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 font-arabic">
                {actionType === 'approve' ? 'موافقة على الطلب' : 'رفض الطلب'}
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 font-arabic mb-2">
                  {actionType === 'approve' 
                    ? 'هل أنت متأكد من الموافقة على هذا الطلب؟' 
                    : 'هل أنت متأكد من رفض هذا الطلب؟'
                  }
                </p>
                <p className="text-sm font-medium text-gray-900 font-arabic">
                  الطلب: {selectedOrder.orderNumber}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-arabic"
                  placeholder={actionType === 'approve' ? 'ملاحظات إضافية...' : 'سبب الرفض...'}
                />
              </div>
              <div className="flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => {
                    setIsActionModalOpen(false)
                    setSelectedOrder(null)
                    setActionType(null)
                    setAdminNotes('')
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-arabic"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAction}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-md font-arabic ${
                    actionType === 'approve'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting 
                    ? 'جاري التنفيذ...' 
                    : actionType === 'approve' ? 'موافقة' : 'رفض'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

