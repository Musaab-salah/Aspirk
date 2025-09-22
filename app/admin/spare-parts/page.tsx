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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            {/* Title and Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-arabic leading-tight">
                  إدارة قطع الغيار
                </h1>
                <p className="text-lg text-gray-600 font-arabic mt-2 leading-relaxed">
                  إدارة قطع الغيار مع أرقام الأجزاء الفريدة
                </p>
              </div>
              
              {/* Exchange Rate Info */}
              {exchangeRate && (
                <div className="flex items-center space-x-2 space-x-reverse p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <CurrencyDollarIcon className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-primary-700 font-arabic">
                    سعر الصرف الحالي: 1 AED = {exchangeRate.aedToSdg} SDG
                  </span>
                </div>
              )}
              
              {/* Info Alert */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">!</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 font-arabic leading-relaxed">
                      <strong>ملاحظة:</strong> المدير يدخل الأسعار بالدرهم الإماراتي (AED)، 
                      ويتم حساب الأسعار بالجنيه السوداني (SDG) تلقائياً بناءً على سعر الصرف الحالي. 
                      المستخدمون يرون الأسعار بالجنيه السوداني فقط.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Add Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center space-x-2 space-x-reverse px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="font-arabic">إضافة قطعة غيار</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث برقم الجزء، الاسم..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic text-sm"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-arabic text-lg">جاري تحميل قطع الغيار...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <XMarkIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 font-arabic text-sm">{error}</p>
                </div>
              </div>
            ) : successMessage ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-800 font-arabic text-sm">{successMessage}</p>
                </div>
              </div>
            ) : (
              /* Table */
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider font-arabic border-l border-gray-200">
                        رقم الجزء
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider font-arabic border-l border-gray-200">
                        اسم الجزء
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider font-arabic border-l border-gray-200">
                        الفئة
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider font-arabic border-l border-gray-200">
                        بلد المنشأ
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider font-arabic border-l border-gray-200">
                        السعر الأصلي (AED)
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider font-arabic border-l border-gray-200">
                        السعر التجاري (AED)
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider font-arabic border-l border-gray-200">
                        السعر الأصلي (SDG)
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider font-arabic border-l border-gray-200">
                        السعر التجاري (SDG)
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider font-arabic border-l border-gray-200">
                        الحالة
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider font-arabic">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredParts.map((part, index) => (
                      <tr key={part.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-4 py-4 whitespace-nowrap border-l border-gray-200">
                          <div className="text-sm font-semibold text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                            {part.partNumber}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-l border-gray-200">
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-gray-900 font-arabic">
                              {part.nameAr}
                            </div>
                            <div className="text-xs text-gray-500 font-arabic">
                              {part.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-l border-gray-200">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 font-arabic">
                            {part.categoryAr}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-l border-gray-200">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <GlobeAltIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-900 font-arabic">
                              {getCountryName(part.countryOfOrigin)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-l border-gray-200">
                          <div className="text-sm font-semibold text-gray-700">
                            {part.prices.original.aed} <span className="text-xs text-gray-500">AED</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-l border-gray-200">
                          <div className="text-sm font-semibold text-gray-700">
                            {part.prices.commercial.aed} <span className="text-xs text-gray-500">AED</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-l border-gray-200">
                          <div className="text-sm font-semibold text-primary-600">
                            {part.prices.original.sdg} <span className="text-xs text-primary-500">SDG</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-l border-gray-200">
                          <div className="text-sm font-semibold text-primary-600">
                            {part.prices.commercial.sdg} <span className="text-xs text-primary-500">SDG</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-l border-gray-200">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            part.isAvailable 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          } font-arabic`}>
                            {part.isAvailable ? 'متوفر' : 'غير متوفر'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <button 
                              onClick={() => handleEditPart(part)}
                              className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-all duration-150"
                              title="تعديل"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeletePart(part.id)}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-150"
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
    </div>
  )
}
