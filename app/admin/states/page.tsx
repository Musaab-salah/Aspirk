'use client'

import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { SudaneseCity, SUDANESE_CITIES } from '@/types'

interface SudaneseState {
  id: string
  name: string
  nameAr: string
  cities: SudaneseCity[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export default function AdminStatesPage() {
  const [states, setStates] = useState<SudaneseState[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingState, setEditingState] = useState<SudaneseState | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    isActive: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchStates()
  }, [])

  const fetchStates = async () => {
    try {
      setIsLoading(true)
      // Group cities by state
      const statesMap = new Map<string, SudaneseState>()
      
      SUDANESE_CITIES.forEach(city => {
        if (city.state && city.stateAr) {
          if (!statesMap.has(city.state)) {
            statesMap.set(city.state, {
              id: city.state,
              name: city.state,
              nameAr: city.stateAr,
              cities: [],
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            })
          }
          statesMap.get(city.state)!.cities.push(city)
        }
      })
      
      setStates(Array.from(statesMap.values()))
    } catch (error) {
      console.error('Error fetching states:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddState = () => {
    setEditingState(null)
    setFormData({
      name: '',
      nameAr: '',
      isActive: true
    })
    setIsModalOpen(true)
  }

  const handleEditState = (state: SudaneseState) => {
    setEditingState(state)
    setFormData({
      name: state.name,
      nameAr: state.nameAr,
      isActive: state.isActive
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingState) {
        // Update existing state
        setStates(prev => prev.map(state => 
          state.id === editingState.id 
            ? { ...state, ...formData, updatedAt: new Date() }
            : state
        ))
      } else {
        // Add new state
        const newState: SudaneseState = {
          id: `state-${Date.now()}`,
          ...formData,
          cities: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setStates(prev => [...prev, newState])
      }

      setIsModalOpen(false)
      setEditingState(null)
    } catch (error) {
      console.error('Error saving state:', error)
      alert('حدث خطأ في حفظ البيانات')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteState = (stateId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الولاية؟')) {
      setStates(prev => prev.filter(state => state.id !== stateId))
    }
  }

  const toggleStateStatus = (stateId: string) => {
    setStates(prev => prev.map(state => 
      state.id === stateId 
        ? { ...state, isActive: !state.isActive, updatedAt: new Date() }
        : state
    ))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-arabic">
            إدارة الولايات
          </h1>
          <p className="text-gray-600 font-arabic">
            إدارة الولايات السودانية ومدنها
          </p>
        </div>
        <button
          onClick={handleAddState}
          className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="font-arabic">إضافة ولاية</span>
        </button>
      </div>

      {/* States List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 font-arabic">
            قائمة الولايات ({states.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {states.map((state) => (
            <div key={state.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPinIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 font-arabic">
                      {state.nameAr}
                    </h3>
                    <p className="text-sm text-gray-600 font-arabic">
                      {state.name} • {state.cities.length} مدينة
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => toggleStateStatus(state.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      state.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {state.isActive ? 'نشط' : 'غير نشط'}
                  </button>
                  
                  <button
                    onClick={() => handleEditState(state)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteState(state.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Cities in this state */}
              {state.cities.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {state.cities.slice(0, 5).map((city) => (
                      <span
                        key={city.id}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-arabic"
                      >
                        {city.nameAr}
                      </span>
                    ))}
                    {state.cities.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-arabic">
                        +{state.cities.length - 5} أخرى
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit State Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 font-arabic">
                {editingState ? 'تعديل الولاية' : 'إضافة ولاية جديدة'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                  اسم الولاية (عربي) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameAr}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-arabic"
                  placeholder="أدخل اسم الولاية بالعربية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-arabic">
                  اسم الولاية (إنجليزي) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter state name in English"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="mr-2 text-sm font-medium text-gray-700 font-arabic">
                  الولاية نشطة
                </label>
              </div>

              <div className="flex space-x-4 space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-arabic hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-arabic hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'جاري الحفظ...' : (editingState ? 'تحديث' : 'إضافة')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
