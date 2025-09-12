'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import { SparePart, COUNTRIES } from '@/types'

interface SparePartFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (partData: any) => Promise<void>
  editingPart?: SparePart | null
  isLoading?: boolean
}

const sparePartCategories = [
  { id: 'Engine Parts', name: 'Engine Parts', nameAr: 'قطع المحرك' },
  { id: 'Brake System', name: 'Brake System', nameAr: 'نظام الفرامل' },
  { id: 'Suspension', name: 'Suspension', nameAr: 'نظام التعليق' },
  { id: 'Electrical', name: 'Electrical', nameAr: 'الأنظمة الكهربائية' },
  { id: 'Body Parts', name: 'Body Parts', nameAr: 'قطع الهيكل' },
  { id: 'Interior', name: 'Interior', nameAr: 'التجهيزات الداخلية' },
]

export default function SparePartForm({ 
  isOpen, 
  onClose, 
  onSave, 
  editingPart, 
  isLoading = false 
}: SparePartFormProps) {
  const [formData, setFormData] = useState({
    partNumber: '',
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    image: '',
    category: '',
    categoryAr: '',
    originalPriceAed: '',
    commercialPriceAed: '',
    countryOfOrigin: '',
    isAvailable: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingPart) {
      setFormData({
        partNumber: editingPart.partNumber,
        name: editingPart.name,
        nameAr: editingPart.nameAr,
        description: editingPart.description || '',
        descriptionAr: editingPart.descriptionAr || '',
        image: editingPart.image || '',
        category: editingPart.category,
        categoryAr: editingPart.categoryAr,
        originalPriceAed: editingPart.prices.original.aed.toString(),
        commercialPriceAed: editingPart.prices.commercial.aed.toString(),
        countryOfOrigin: editingPart.countryOfOrigin,
        isAvailable: editingPart.isAvailable
      })
    } else {
      setFormData({
        partNumber: '',
        name: '',
        nameAr: '',
        description: '',
        descriptionAr: '',
        image: '',
        category: '',
        categoryAr: '',
        originalPriceAed: '',
        commercialPriceAed: '',
        countryOfOrigin: '',
        isAvailable: true
      })
    }
    setErrors({})
  }, [editingPart, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.partNumber.trim()) {
      newErrors.partNumber = 'رقم الجزء مطلوب'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'اسم الجزء بالإنجليزية مطلوب'
    }

    if (!formData.nameAr.trim()) {
      newErrors.nameAr = 'اسم الجزء بالعربية مطلوب'
    }

    if (!formData.category) {
      newErrors.category = 'فئة الجزء مطلوبة'
    }

    if (!formData.originalPriceAed || parseFloat(formData.originalPriceAed) <= 0) {
      newErrors.originalPriceAed = 'السعر الأصلي يجب أن يكون أكبر من صفر'
    }

    if (!formData.commercialPriceAed || parseFloat(formData.commercialPriceAed) <= 0) {
      newErrors.commercialPriceAed = 'السعر التجاري يجب أن يكون أكبر من صفر'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const partData = {
      ...formData,
      originalPriceAed: parseFloat(formData.originalPriceAed),
      commercialPriceAed: parseFloat(formData.commercialPriceAed),
      ...(editingPart && { id: editingPart.id })
    }

    try {
      await onSave(partData)
      onClose()
    } catch (error) {
      console.error('Error saving spare part:', error)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    const category = sparePartCategories.find(c => c.id === categoryId)
    if (category) {
      setFormData(prev => ({
        ...prev,
        category: category.name,
        categoryAr: category.nameAr
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 font-arabic">
            {editingPart ? 'تعديل قطعة الغيار' : 'إضافة قطعة غيار جديدة'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Part Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
              رقم الجزء *
            </label>
            <input
              type="text"
              value={formData.partNumber}
              onChange={(e) => handleInputChange('partNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-arabic ${
                errors.partNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="مثال: ENG-123456"
            />
            {errors.partNumber && (
              <p className="text-red-600 text-sm mt-1 font-arabic">{errors.partNumber}</p>
            )}
          </div>

          {/* Name (English) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
              اسم الجزء (إنجليزي) *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Oil Filter"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1 font-arabic">{errors.name}</p>
            )}
          </div>

          {/* Name (Arabic) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
              اسم الجزء (عربي) *
            </label>
            <input
              type="text"
              value={formData.nameAr}
              onChange={(e) => handleInputChange('nameAr', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-arabic ${
                errors.nameAr ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="فلتر الزيت"
            />
            {errors.nameAr && (
              <p className="text-red-600 text-sm mt-1 font-arabic">{errors.nameAr}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
              الوصف (إنجليزي)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2}
              placeholder="High quality oil filter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
              الوصف (عربي)
            </label>
            <textarea
              value={formData.descriptionAr}
              onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-arabic"
              rows={2}
              placeholder="فلتر زيت عالي الجودة"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
              الفئة *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-arabic ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">اختر الفئة</option>
              {sparePartCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.nameAr} - {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1 font-arabic">{errors.category}</p>
            )}
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                السعر الأصلي (AED) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPriceAed}
                onChange={(e) => handleInputChange('originalPriceAed', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.originalPriceAed ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="65.00"
              />
              {errors.originalPriceAed && (
                <p className="text-red-600 text-sm mt-1 font-arabic">{errors.originalPriceAed}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                السعر التجاري (AED) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.commercialPriceAed}
                onChange={(e) => handleInputChange('commercialPriceAed', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.commercialPriceAed ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="45.00"
              />
              {errors.commercialPriceAed && (
                <p className="text-red-600 text-sm mt-1 font-arabic">{errors.commercialPriceAed}</p>
              )}
            </div>
          </div>

          {/* Country of Origin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
              بلد المنشأ
            </label>
            <select
              value={formData.countryOfOrigin}
              onChange={(e) => handleInputChange('countryOfOrigin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-arabic"
            >
              <option value="">اختر بلد المنشأ</option>
              {COUNTRIES.map(country => (
                <option key={country.code} value={country.code}>
                  {country.nameAr} - {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
              رابط الصورة
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isAvailable" className="mr-2 text-sm font-medium text-gray-700 font-arabic">
              متوفر
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-arabic"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-arabic transition-colors ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isLoading ? 'جاري الحفظ...' : (editingPart ? 'تحديث' : 'إضافة')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
