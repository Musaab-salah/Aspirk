'use client'

import { useState } from 'react'
import { CheckIcon, PhotoIcon, TagIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { SparePart, SparePartSelection, calculateSDGPrice } from '@/types'
import { formatUserPrice } from '@/utils/priceUtils'

interface SparePartCardProps {
  part: SparePart
  isSelected: boolean
  onToggle: () => void
  selectedPart?: SparePartSelection
  onQuantityChange?: (partId: string, quantity: number) => void
  onTypeChange?: (partId: string, type: 'original' | 'commercial') => void
  exchangeRate?: number // AED to SDG exchange rate
}

export default function SparePartCard({ 
  part, 
  isSelected, 
  onToggle, 
  selectedPart, 
  onQuantityChange, 
  onTypeChange,
  exchangeRate = 30 // Default exchange rate if not provided
}: SparePartCardProps) {
  const [imageError, setImageError] = useState(false)
  
  const currentType = selectedPart?.type || 'commercial'
  const currentQuantity = selectedPart?.quantity || 1
  const currentPrices = part.prices[currentType]

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 hover:shadow-lg ${
      isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Image */}
      <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        {!imageError && part.image ? (
          <img
            src={part.image.startsWith('/storage/') ? part.image : part.image}
            alt={part.nameAr}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PhotoIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Selection Checkbox */}
        <button
          onClick={onToggle}
          className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected 
              ? 'bg-primary-500 border-primary-500 text-white' 
              : 'bg-white border-gray-300 hover:border-primary-400'
          }`}
        >
          {isSelected && <CheckIcon className="h-4 w-4" />}
        </button>

        {/* Availability Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
          part.isAvailable 
            ? 'bg-success-100 text-success-800' 
            : 'bg-danger-100 text-danger-800'
        }`}>
          {part.isAvailable ? 'متوفر' : 'غير متوفر'}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-gray-800 bg-opacity-75 text-white rounded-full text-xs font-medium">
          {part.categoryAr}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Part Number - Prominently displayed */}
        <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <TagIcon className="h-4 w-4 text-primary-600" />
              <span className="text-xs font-medium text-gray-600 font-arabic">رقم الجزء:</span>
            </div>
            <span className="text-sm font-mono font-bold text-primary-700 bg-white px-2 py-1 rounded border border-primary-200">
              {part.partNumber}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 font-arabic">
          {part.nameAr}
        </h3>
        <p className="text-sm text-gray-500 mb-2 font-arabic">
          {part.name}
        </p>

        {/* Description */}
        {part.descriptionAr && (
          <p className="text-sm text-gray-600 mb-3 font-arabic line-clamp-2">
            {part.descriptionAr}
          </p>
        )}

        {/* SDG Pricing Only */}
        <div className="mb-3">
          <div className="text-sm font-medium text-gray-700 mb-2 font-arabic">
            السعر ({currentType === 'original' ? 'أصلي' : 'تجاري'}):
          </div>
          <div className="bg-success-50 p-3 rounded-lg text-center border border-success-200">
            <div className="text-2xl font-bold text-success-700 font-english">
              {formatUserPrice(currentPrices.aed, exchangeRate)}
            </div>
            <div className="text-xs text-success-600 font-arabic mt-1">
              جنيه سوداني
            </div>
          </div>
        </div>

        {/* Selection Controls */}
        {isSelected ? (
          <div className="space-y-3">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                نوع القطعة:
              </label>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => onTypeChange?.(part.id, 'original')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    currentType === 'original'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  أصلي
                </button>
                <button
                  onClick={() => onTypeChange?.(part.id, 'commercial')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    currentType === 'commercial'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  تجاري
                </button>
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                الكمية:
              </label>
              <div className="flex items-center justify-center space-x-3 space-x-reverse">
                <button
                  onClick={() => onQuantityChange?.(part.id, currentQuantity - 1)}
                  disabled={currentQuantity <= 1}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">
                  {currentQuantity}
                </span>
                <button
                  onClick={() => onQuantityChange?.(part.id, currentQuantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={onToggle}
              className="w-full py-2 px-4 rounded-lg font-medium transition-colors font-arabic bg-danger-100 text-danger-700 hover:bg-danger-200"
            >
              إلغاء الاختيار
            </button>
          </div>
        ) : (
          <button
            onClick={onToggle}
            disabled={!part.isAvailable}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors font-arabic ${
              part.isAvailable
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {part.isAvailable ? 'اختيار القطعة' : 'غير متوفر'}
          </button>
        )}
      </div>
    </div>
  )
}
