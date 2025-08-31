'use client'

import { useState, useEffect } from 'react'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { User } from '@/types'

// Mock data - in real app this would come from API
const mockCustomers: User[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+971501234567',
    role: 'customer',
    createdAt: new Date('2024-01-10T08:30:00'),
    updatedAt: new Date('2024-01-15T14:20:00'),
  },
  {
    id: '2',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    phone: '+971507654321',
    role: 'customer',
    createdAt: new Date('2024-01-08T12:15:00'),
    updatedAt: new Date('2024-01-12T09:45:00'),
  },
  {
    id: '3',
    name: 'محمد علي',
    email: 'mohamed@example.com',
    phone: '+971509876543',
    role: 'customer',
    createdAt: new Date('2024-01-05T16:20:00'),
    updatedAt: new Date('2024-01-10T11:30:00'),
  },
  {
    id: '4',
    name: 'فاطمة حسن',
    email: 'fatima@example.com',
    phone: '+971501112223',
    role: 'customer',
    createdAt: new Date('2024-01-03T10:45:00'),
    updatedAt: new Date('2024-01-08T15:10:00'),
  },
  {
    id: '5',
    name: 'علي محمود',
    email: 'ali@example.com',
    phone: '+971504445556',
    role: 'customer',
    createdAt: new Date('2024-01-01T09:00:00'),
    updatedAt: new Date('2024-01-05T13:25:00'),
  },
]

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [customers, searchTerm])

  const fetchCustomers = async () => {
    try {
      // In a real app, this would fetch from API
      // const response = await fetch('/api/customers')
      // const result = await response.json()
      // if (result.success) {
      //   setCustomers(result.data)
      // }
      
      // For now, use mock data
      setCustomers(mockCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
      // Fallback to mock data
      setCustomers(mockCustomers)
    } finally {
      setIsLoading(false)
    }
  }

  const openCustomerDetails = (customer: User) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const getCustomerStats = () => {
    const totalCustomers = customers.length
    const activeCustomers = customers.filter(c => {
      const daysSinceLastUpdate = Math.floor((Date.now() - c.updatedAt.getTime()) / (1000 * 60 * 60 * 24))
      return daysSinceLastUpdate <= 30
    }).length
    const newCustomersThisMonth = customers.filter(c => {
      const daysSinceCreated = Math.floor((Date.now() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      return daysSinceCreated <= 30
    }).length

    return { totalCustomers, activeCustomers, newCustomersThisMonth }
  }

  const stats = getCustomerStats()

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
          إدارة العملاء
        </h1>
        <p className="text-gray-600 font-arabic">
          عرض وإدارة معلومات العملاء
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-arabic">إجمالي العملاء</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-arabic">العملاء النشطين</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeCustomers}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-arabic">عملاء جدد هذا الشهر</p>
              <p className="text-2xl font-bold text-purple-600">{stats.newCustomersThisMonth}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن عميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-arabic"
            />
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600 font-arabic">تصفية</span>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 font-arabic">
            العملاء ({filteredCustomers.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  البريد الإلكتروني
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  الهاتف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  تاريخ التسجيل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  آخر تحديث
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900 font-arabic">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {customer.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 ml-2" />
                      <span className="text-sm text-gray-900">{customer.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 text-gray-400 ml-2" />
                      <span className="text-sm text-gray-900">{customer.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-arabic">
                    {customer.createdAt.toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-arabic">
                    {customer.updatedAt.toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openCustomerDetails(customer)}
                      className="text-primary-600 hover:text-primary-900 p-1"
                      title="عرض التفاصيل"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 font-arabic">لا توجد نتائج</h3>
            <p className="mt-1 text-sm text-gray-500 font-arabic">
              {searchTerm ? 'جرب البحث بكلمات مختلفة' : 'لا يوجد عملاء مسجلين'}
            </p>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-medium text-gray-900 font-arabic">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {selectedCustomer.id}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700 font-arabic">البريد الإلكتروني:</span>
                  <span className="mr-2">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">الهاتف:</span>
                  <span className="mr-2">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">نوع الحساب:</span>
                  <span className="mr-2 font-arabic">
                    {selectedCustomer.role === 'customer' ? 'عميل' : 'مدير'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">تاريخ التسجيل:</span>
                  <span className="mr-2 font-arabic">
                    {selectedCustomer.createdAt.toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 font-arabic">آخر تحديث:</span>
                  <span className="mr-2 font-arabic">
                    {selectedCustomer.updatedAt.toLocaleDateString('ar-SA')}
                  </span>
                </div>
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
