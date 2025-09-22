'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  TruckIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { type SudaneseCity, SUDANESE_CITIES } from '@/types'

interface DeliveryCostWithCity {
  id: string
  cityId: string
  method: 'land' | 'sea'
  cost: number
  estimatedDays: number
  freeShippingThreshold?: number
  active: boolean
  createdAt: Date
  updatedAt: Date
  city?: SudaneseCity
}

export default function AdminDeliveryCostsPage() {
  const [deliveryCosts, setDeliveryCosts] = useState<DeliveryCostWithCity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [methodFilter, setMethodFilter] = useState<'all' | 'land' | 'sea'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCost, setSelectedCost] = useState<DeliveryCostWithCity | null>(null)
  const [formData, setFormData] = useState({
    cityId: '',
    method: 'land' as 'land' | 'sea',
    cost: 0,
    estimatedDays: 1,
    freeShippingThreshold: 0,
    active: true
  })

  useEffect(() => {
    fetchDeliveryCosts()
  }, [])

  const fetchDeliveryCosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/delivery-costs?includeInactive=true')
      const data = await response.json()
      if (data.success) {
        setDeliveryCosts(data.data)
      }
    } catch (error) {
      console.error('Error fetching delivery costs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        freeShippingThreshold: formData.freeShippingThreshold || undefined
      }
      
      const response = await fetch('/api/admin/delivery-costs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })
      const data = await response.json()
      if (data.success) {
        await fetchDeliveryCosts()
        setShowAddModal(false)
        resetForm()
      } else {
        alert(data.error || 'حدث خطأ في إضافة تكلفة التوصيل')
      }
    } catch (error) {
      console.error('Error adding delivery cost:', error)
      alert('حدث خطأ في الاتصال بالخادم')
    }
  }

  const handleEditCost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCost) return

    try {
      const submitData = {
        cost: formData.cost,
        estimatedDays: formData.estimatedDays,
        freeShippingThreshold: formData.freeShippingThreshold || undefined,
        active: formData.active
      }
      
      const response = await fetch(`/api/admin/delivery-costs/${selectedCost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })
      const data = await response.json()
      if (data.success) {
        await fetchDeliveryCosts()
        setShowEditModal(false)
        setSelectedCost(null)
        resetForm()
      } else {
        alert(data.error || 'حدث خطأ في تحديث تكلفة التوصيل')
      }
    } catch (error) {
      console.error('Error updating delivery cost:', error)
      alert('حدث خطأ في الاتصال بالخادم')
    }
  }

  const handleDeleteCost = async (costId: string) => {
    if (!confirm('هل أنت متأكد من إلغاء تفعيل تكلفة التوصيل هذه؟')) return

    try {
      const response = await fetch(`/api/admin/delivery-costs/${costId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        await fetchDeliveryCosts()
      } else {
        alert(data.error || 'حدث خطأ في حذف تكلفة التوصيل')
      }
    } catch (error) {
      console.error('Error deleting delivery cost:', error)
      alert('حدث خطأ في الاتصال بالخادم')
    }
  }

  const openEditModal = (cost: DeliveryCostWithCity) => {
    setSelectedCost(cost)
    setFormData({
      cityId: cost.cityId,
      method: cost.method,
      cost: cost.cost,
      estimatedDays: cost.estimatedDays,
      freeShippingThreshold: cost.freeShippingThreshold || 0,
      active: cost.active
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      cityId: '',
      method: 'land',
      cost: 0,
      estimatedDays: 1,
      freeShippingThreshold: 0,
      active: true
    })
  }

  const filteredCosts = deliveryCosts.filter(cost => {
    const matchesSearch = cost.city?.nameAr.includes(searchTerm) ||
                         cost.city?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMethod = methodFilter === 'all' || cost.method === methodFilter
    return matchesSearch && matchesMethod
  })

  // Get available cities for adding new costs
  const availableCities = SUDANESE_CITIES.filter(city => city.active)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading-spinner"></div>
        <span className="mr-2 font-arabic">جاري التحميل...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-arabic">إدارة تكاليف التوصيل</h1>
          <p className="text-gray-600 font-arabic">إدارة تكاليف التوصيل للمدن السودانية</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2 space-x-reverse"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="font-arabic">إضافة تكلفة توصيل</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في المدن..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic"
          />
        </div>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value as 'all' | 'land' | 'sea')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic"
        >
          <option value="all">جميع طرق الشحن</option>
          <option value="land">الشحن البري</option>
          <option value="sea">الشحن البحري</option>
        </select>
      </div>

      {/* Delivery Costs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  المدينة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  طريقة الشحن
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  التكلفة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  مدة التوصيل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  الشحن المجاني
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCosts.map((cost) => (
                <tr key={cost.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-arabic">
                      {cost.city?.nameAr || 'مدينة غير معروفة'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {cost.city?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {cost.method === 'land' ? (
                        <TruckIcon className="h-5 w-5 text-blue-500 ml-2" />
                      ) : (
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-500 ml-2" />
                      )}
                      <span className="text-sm text-gray-900 font-arabic">
                        {cost.method === 'land' ? 'بري' : 'بحري'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-arabic">
                      {cost.cost} جنيه سوداني
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 ml-1" />
                      <span className="text-sm text-gray-900 font-arabic">
                        {cost.estimatedDays} {cost.estimatedDays === 1 ? 'يوم' : 'أيام'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-arabic">
                      {cost.freeShippingThreshold ? 
                        `${cost.freeShippingThreshold} جنيه` : 
                        'غير محدد'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cost.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {cost.active ? (
                        <>
                          <CheckCircleIcon className="h-3 w-3 ml-1" />
                          <span className="font-arabic">مفعل</span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="h-3 w-3 ml-1" />
                          <span className="font-arabic">معطل</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => openEditModal(cost)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCost(cost.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={!cost.active}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Delivery Cost Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 font-arabic mb-4">إضافة تكلفة توصيل</h3>
              <form onSubmit={handleAddCost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    المدينة *
                  </label>
                  <select
                    value={formData.cityId}
                    onChange={(e) => setFormData({...formData, cityId: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic"
                    required
                  >
                    <option value="">اختر المدينة</option>
                    {availableCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    طريقة الشحن *
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({...formData, method: e.target.value as 'land' | 'sea'})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic"
                    required
                  >
                    <option value="land">الشحن البري</option>
                    <option value="sea">الشحن البحري</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    التكلفة (جنيه سوداني) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    مدة التوصيل المتوقعة (أيام) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.estimatedDays}
                    onChange={(e) => setFormData({...formData, estimatedDays: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    حد الشحن المجاني (جنيه سوداني)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.freeShippingThreshold}
                    onChange={(e) => setFormData({...formData, freeShippingThreshold: parseFloat(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اتركه فارغاً إذا لم يكن هناك شحن مجاني"
                  />
                </div>
                <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 font-arabic"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-arabic"
                  >
                    إضافة
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Delivery Cost Modal */}
      {showEditModal && selectedCost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 font-arabic mb-4">تعديل تكلفة التوصيل</h3>
              <form onSubmit={handleEditCost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    المدينة
                  </label>
                  <input
                    type="text"
                    value={selectedCost.city?.nameAr || ''}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 font-arabic text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    طريقة الشحن
                  </label>
                  <input
                    type="text"
                    value={selectedCost.method === 'land' ? 'الشحن البري' : 'الشحن البحري'}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 font-arabic text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    التكلفة (جنيه سوداني) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    مدة التوصيل المتوقعة (أيام) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.estimatedDays}
                    onChange={(e) => setFormData({...formData, estimatedDays: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    حد الشحن المجاني (جنيه سوداني)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.freeShippingThreshold}
                    onChange={(e) => setFormData({...formData, freeShippingThreshold: parseFloat(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اتركه فارغاً إذا لم يكن هناك شحن مجاني"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active-edit"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active-edit" className="mr-2 block text-sm text-gray-900 font-arabic">
                    مفعل
                  </label>
                </div>
                <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedCost(null)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 font-arabic"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-arabic"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}