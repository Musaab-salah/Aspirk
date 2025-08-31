'use client'

import { useState } from 'react'
import { CheckIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { SparePart } from '@/types'

interface SparePartCardProps {
  part: SparePart
  isSelected: boolean
  onToggle: () => void
}

export default function SparePartCard({ part, isSelected, onToggle }: SparePartCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 hover:shadow-lg ${
      isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Image */}
      <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        {!imageError && part.image ? (
          <img
            src={part.image}
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

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-primary-600">
              {part.price} {part.currency}
            </span>
            {part.price && (
              <span className="text-sm text-gray-500 font-arabic mr-2">
                (سعر تقريبي)
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onToggle}
          disabled={!part.isAvailable}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors font-arabic ${
            isSelected
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : part.isAvailable
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSelected ? 'إلغاء الاختيار' : part.isAvailable ? 'اختيار القطعة' : 'غير متوفر'}
        </button>
      </div>
    </div>
  )
}
