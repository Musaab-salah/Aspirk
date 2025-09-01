'use client'

import { useState } from 'react'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, TagIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { SparePart, COUNTRIES } from '@/types'

// Mock data
const mockSpareParts: SparePart[] = [
  {
    id: '1',
    partNumber: 'ENG-123456',
    name: 'Oil Filter',
    nameAr: 'فلتر الزيت',
    description: 'High quality oil filter',
    descriptionAr: 'فلتر زيت عالي الجودة',
    image: '/images/oil-filter.jpg',
    category: 'Engine Parts',
    categoryAr: 'قطع المحرك',
    compatibleCars: ['1', '2', '3'],
    price: 45,
    currency: 'AED',
    isAvailable: true,
    countryOfOrigin: 'JP',
  },
  {
    id: '2',
    partNumber: 'BRA-789012',
    name: 'Brake Pads',
    nameAr: 'بطانات الفرامل',
    description: 'Premium brake pads',
    descriptionAr: 'بطانات فرامل مميزة',
    image: '/images/brake-pads.svg',
    category: 'Brake System',
    categoryAr: 'نظام الفرامل',
    compatibleCars: ['1', '2', '3'],
    price: 120,
    currency: 'AED',
    isAvailable: true,
    countryOfOrigin: 'DE',
  },
]

export default function AdminSparePartsPage() {
  const [parts, setParts] = useState<SparePart[]>(mockSpareParts)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

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
                  السعر
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
                    <div className="text-sm text-gray-900">
                      {part.price ? `${part.price} ${part.currency}` : 'غير محدد'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button className="text-primary-600 hover:text-primary-900 transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 transition-colors">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 font-arabic">
                إضافة قطعة غيار جديدة
              </h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600 font-arabic">
                نموذج إضافة قطعة غيار جديدة سيتم تطويره قريباً
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-arabic"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
