'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, TruckIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { SudaneseCity, SUDANESE_CITIES } from '@/types'

interface ShippingDeliveryModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (shippingMethod: string, deliveryState: string) => void
  selectedParts: any[]
  totalPrice: number
}

interface SudaneseState {
  id: string
  name: string
  nameAr: string
  cities: SudaneseCity[]
}

export default function ShippingDeliveryModal({
  isOpen,
  onClose,
  onConfirm,
  selectedParts,
  totalPrice
}: ShippingDeliveryModalProps) {
  const [shippingMethod, setShippingMethod] = useState('')
  const [deliveryState, setDeliveryState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [states, setStates] = useState<SudaneseState[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Group cities by state
      const statesMap = new Map<string, SudaneseState>()
      
      SUDANESE_CITIES.forEach(city => {
        if (city.state && city.stateAr) {
          if (!statesMap.has(city.state)) {
            statesMap.set(city.state, {
              id: city.state,
              name: city.state,
              nameAr: city.stateAr,
              cities: []
            })
          }
          statesMap.get(city.state)!.cities.push(city)
        }
      })
      
      setStates(Array.from(statesMap.values()))
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!shippingMethod || !deliveryState) {
      return
    }

    setIsLoading(true)
    
    try {
      // Find the selected city
      const selectedState = states.find(state => state.id === deliveryState)
      const city = selectedState?.cities.find(c => c.id === selectedCity)
      
      if (city) {
        onConfirm(shippingMethod, city.id)
      } else {
        // If no specific city selected, use the first city of the state
        const firstCity = selectedState?.cities[0]
        if (firstCity) {
          onConfirm(shippingMethod, firstCity.id)
        }
      }
    } catch (error) {
      console.error('Error submitting shipping details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getShippingMethodText = (method: string) => {
    switch (method) {
      case 'land':
        return { en: 'Land', ar: 'بري' }
      case 'sea':
        return { en: 'Sea', ar: 'بحري' }
      default:
        return { en: '', ar: '' }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TruckIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-arabic">
                اختيار طريقة الشحن والتوصيل
              </h2>
              <p className="text-sm text-gray-600 font-arabic">
                اختر طريقة الشحن والولاية للتوصيل
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 font-arabic mb-3">
              ملخص الطلب
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 font-arabic">عدد القطع المختارة:</span>
                <span className="font-medium">{selectedParts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-arabic">المبلغ الإجمالي:</span>
                <span className="font-bold text-blue-600">{totalPrice} SDG</span>
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 font-arabic">
              طريقة الشحن *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShippingMethod('land')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  shippingMethod === 'land'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <TruckIcon className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <div className="font-medium font-arabic">بري</div>
                    <div className="text-sm text-gray-500">Land</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShippingMethod('sea')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  shippingMethod === 'sea'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <div className="font-medium font-arabic">بحري</div>
                    <div className="text-sm text-gray-500">Sea</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Delivery State */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 font-arabic">
              الولاية *
            </label>
            <select
              value={deliveryState}
              onChange={(e) => {
                setDeliveryState(e.target.value)
                setSelectedCity('')
              }}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-arabic"
              required
            >
              <option value="">اختر الولاية</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* City Selection (Optional) */}
          {deliveryState && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 font-arabic">
                المدينة (اختياري)
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-arabic"
              >
                <option value="">اختر المدينة</option>
                {states
                  .find(state => state.id === deliveryState)
                  ?.cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.nameAr}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Shipping Cost Estimate */}
          {shippingMethod && deliveryState && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 font-arabic mb-2">
                تقدير تكلفة الشحن
              </h4>
              <p className="text-sm text-blue-700 font-arabic">
                سيتم حساب تكلفة الشحن بناءً على الطريقة والولاية المختارة
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 space-x-reverse pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-arabic hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!shippingMethod || !deliveryState || isLoading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-arabic hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'جاري المعالجة...' : 'تأكيد الطلب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
