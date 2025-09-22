'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { type SudaneseCity } from '@/types'

interface CityWithCosts extends SudaneseCity {
  deliveryCosts?: Array<{
    id: string
    method: 'land' | 'sea'
    cost: number
    estimatedDays: number
  }>
}

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<CityWithCosts[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCity, setSelectedCity] = useState<CityWithCosts | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    state: '',
    stateAr: '',
    active: true
  })

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/cities?includeCosts=true&includeInactive=true')
      const data = await response.json()
      if (data.success) {
        setCities(data.data)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        await fetchCities()
        setShowAddModal(false)
        setFormData({ name: '', nameAr: '', state: '', stateAr: '', active: true })
      } else {
        alert(data.error || 'حدث خطأ في إضافة المدينة')
      }
    } catch (error) {
      console.error('Error adding city:', error)
      alert('حدث خطأ في الاتصال بالخادم')
    }
  }

  const handleEditCity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCity) return

    try {
      const response = await fetch(`/api/admin/cities/${selectedCity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        await fetchCities()
        setShowEditModal(false)
        setSelectedCity(null)
        setFormData({ name: '', nameAr: '', state: '', stateAr: '', active: true })
      } else {
        alert(data.error || 'حدث خطأ في تحديث المدينة')
      }
    } catch (error) {
      console.error('Error updating city:', error)
      alert('حدث خطأ في الاتصال بالخادم')
    }
  }

  const handleDeleteCity = async (cityId: string) => {
    if (!confirm('هل أنت متأكد من إلغاء تفعيل هذه المدينة؟')) return

    try {
      const response = await fetch(`/api/admin/cities/${cityId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        await fetchCities()
      } else {
        alert(data.error || 'حدث خطأ في حذف المدينة')
      }
    } catch (error) {
      console.error('Error deleting city:', error)
      alert('حدث خطأ في الاتصال بالخادم')
    }
  }

  const openEditModal = (city: CityWithCosts) => {
    setSelectedCity(city)
    setFormData({
      name: city.name,
      nameAr: city.nameAr,
      state: city.state || '',
      stateAr: city.stateAr || '',
      active: city.active
    })
    setShowEditModal(true)
  }

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.nameAr.includes(searchTerm) ||
    city.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.stateAr?.includes(searchTerm)
  )

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
          <h1 className="text-2xl font-bold text-gray-900 font-arabic">إدارة المدن</h1>
          <p className="text-gray-600 font-arabic">إدارة المدن السودانية وتكاليف التوصيل</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2 space-x-reverse"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="font-arabic">إضافة مدينة جديدة</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="البحث في المدن..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic"
        />
      </div>

      {/* Cities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  المدينة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  الولاية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  تكاليف التوصيل
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
              {filteredCities.map((city) => (
                <tr key={city.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400 ml-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 font-arabic">
                          {city.nameAr}
                        </div>
                        <div className="text-sm text-gray-500">
                          {city.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-arabic">
                      {city.stateAr || city.state || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {city.deliveryCosts?.map((cost) => (
                        <div key={cost.id} className="text-xs">
                          <span className="font-arabic">
                            {cost.method === 'land' ? 'بري' : 'بحري'}: {cost.cost} جنيه
                          </span>
                        </div>
                      )) || (
                        <span className="text-xs text-gray-400 font-arabic">لا توجد تكاليف</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      city.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {city.active ? (
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
                        onClick={() => openEditModal(city)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCity(city.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={!city.active}
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

      {/* Add City Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 font-arabic mb-4">إضافة مدينة جديدة</h3>
              <form onSubmit={handleAddCity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    اسم المدينة (بالإنجليزية) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    اسم المدينة (بالعربية) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    الولاية (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    الولاية (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={formData.stateAr}
                    onChange={(e) => setFormData({...formData, stateAr: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic text-right"
                  />
                </div>
                <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setFormData({ name: '', nameAr: '', state: '', stateAr: '', active: true })
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

      {/* Edit City Modal */}
      {showEditModal && selectedCity && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 font-arabic mb-4">تعديل المدينة</h3>
              <form onSubmit={handleEditCity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    اسم المدينة (بالإنجليزية) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    اسم المدينة (بالعربية) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    الولاية (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-arabic mb-1">
                    الولاية (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={formData.stateAr}
                    onChange={(e) => setFormData({...formData, stateAr: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic text-right"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="mr-2 block text-sm text-gray-900 font-arabic">
                    مفعل
                  </label>
                </div>
                <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedCity(null)
                      setFormData({ name: '', nameAr: '', state: '', stateAr: '', active: true })
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