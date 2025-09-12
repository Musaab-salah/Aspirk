'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, TagIcon, GlobeAltIcon, CurrencyDollarIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { SparePart, COUNTRIES, ExchangeRateConfig, calculateSDGPrice } from '@/types'
import SparePartForm from '@/components/SparePartForm'

export default function AdminSparePartsPage() {
  const [parts, setParts] = useState<SparePart[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingPart, setEditingPart] = useState<SparePart | null>(null)
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Fetch data on component mount
  useEffect(() => {
    fetchExchangeRate()
    fetchSpareParts()
  }, [])

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('/api/admin/exchange-rate')
      const data = await response.json()
      if (data.success) {
        setExchangeRate(data.data)
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
    }
  }

  const fetchSpareParts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/spare-parts')
      const data = await response.json()
      if (data.success) {
        setParts(data.data)
      } else {
        setError(data.error || 'Failed to fetch spare parts')
      }
    } catch (error) {
      console.error('Error fetching spare parts:', error)
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePart = async (partId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه القطعة؟')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/spare-parts?id=${partId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        setParts(parts.filter(part => part.id !== partId))
        setSuccessMessage('تم حذف القطعة بنجاح')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setError(data.error || 'Failed to delete spare part')
      }
    } catch (error) {
      console.error('Error deleting spare part:', error)
      setError('خطأ في حذف القطعة')
    }
  }

  const handleEditPart = (part: SparePart) => {
    setEditingPart(part)
    setShowEditForm(true)
  }

  const handleCloseForms = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setEditingPart(null)
    setError('')
  }

  const handleSavePart = async (partData: any) => {
    setIsSaving(true)
    setError('')

    try {
      const isEdit = !!editingPart
      const url = '/api/admin/spare-parts'
      const method = isEdit ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partData),
      })

      const data = await response.json()

      if (data.success) {
        if (isEdit) {
          // Update existing part in the list
          setParts(parts.map(part => 
            part.id === editingPart.id ? data.data : part
          ))
          setSuccessMessage('تم تحديث القطعة بنجاح')
        } else {
          // Add new part to the list
          setParts([...parts, data.data])
          setSuccessMessage('تم إضافة القطعة بنجاح')
        }
        setTimeout(() => setSuccessMessage(''), 3000)
        handleCloseForms()
      } else {
        setError(data.error || 'فشل في حفظ القطعة')
      }
    } catch (error) {
      console.error('Error saving spare part:', error)
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredParts = parts.filter(part =>
    part.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.nameAr.includes(searchQuery)
  )

  const getCountryName = (code: string) => {
    const country = COUNTRIES.find(c => c.code === code)
    return country ? country.nameAr : code
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-arabic">
            إدارة قطع الغيار
          </h1>
          <p className="text-gray-600 font-arabic">
            إدارة قطع الغيار مع أرقام الأجزاء الفريدة
          </p>
          {exchangeRate && (
            <div className="mt-2 flex items-center space-x-2 space-x-reverse">
              <CurrencyDollarIcon className="h-4 w-4 text-primary-600" />
              <span className="text-sm text-primary-600 font-arabic">
                سعر الصرف الحالي: 1 AED = {exchangeRate.aedToSdg} SDG
              </span>
            </div>
          )}
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-arabic">
              <strong>ملاحظة:</strong> المدير يدخل الأسعار بالدرهم الإماراتي (AED)، 
              ويتم حساب الأسعار بالجنيه السوداني (SDG) تلقائياً بناءً على سعر الصرف الحالي. 
              المستخدمون يرون الأسعار بالجنيه السوداني فقط.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2 space-x-reverse"
        >
          <PlusIcon className="h-5 w-5" />
          <span>إضافة قطعة غيار</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث برقم الجزء، الاسم..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-arabic">جاري تحميل قطع الغيار...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XMarkIcon className="h-5 w-5 text-red-600 ml-2" />
              <p className="text-red-800 font-arabic">{error}</p>
            </div>
          </div>
        ) : successMessage ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-600 ml-2" />
              <p className="text-green-800 font-arabic">{successMessage}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  رقم الجزء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  اسم الجزء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  بلد المنشأ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  السعر الأصلي (AED)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  السعر التجاري (AED)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  السعر الأصلي (SDG)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">
                  السعر التجاري (SDG)
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
              {filteredParts.map(part => (
                <tr key={part.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-mono">
                      {part.partNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 font-arabic">
                        {part.nameAr}
                      </div>
                      <div className="text-sm text-gray-500">
                        {part.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-arabic">
                      {part.categoryAr}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <GlobeAltIcon className="h-4 w-4 text-gray-400 ml-2" />
                      <span className="text-sm text-gray-900 font-arabic">
                        {getCountryName(part.countryOfOrigin)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {part.prices.original.aed} AED
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {part.prices.commercial.aed} AED
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-primary-600 font-medium">
                      {part.prices.original.sdg} SDG
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-primary-600 font-medium">
                      {part.prices.commercial.sdg} SDG
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      part.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    } font-arabic`}>
                      {part.isAvailable ? 'متوفر' : 'غير متوفر'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button 
                        onClick={() => handleEditPart(part)}
                        className="text-primary-600 hover:text-primary-900 transition-colors p-1 rounded hover:bg-primary-50"
                        title="تعديل"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePart(part.id)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                        title="حذف"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Add Form */}
      <SparePartForm
        isOpen={showAddForm}
        onClose={handleCloseForms}
        onSave={handleSavePart}
        isLoading={isSaving}
      />

      {/* Edit Form */}
      <SparePartForm
        isOpen={showEditForm}
        onClose={handleCloseForms}
        onSave={handleSavePart}
        editingPart={editingPart}
        isLoading={isSaving}
      />
    </div>
  )
}
