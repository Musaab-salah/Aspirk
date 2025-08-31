'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

// Mock data - in real app this would come from API
const carBrands = [
  { id: '1', name: 'Toyota', nameAr: 'تويوتا' },
  { id: '2', name: 'Hyundai', nameAr: 'هيونداي' },
  { id: '3', name: 'Nissan', nameAr: 'نيسان' },
  { id: '4', name: 'Honda', nameAr: 'هوندا' },
  { id: '5', name: 'Ford', nameAr: 'فورد' },
  { id: '6', name: 'BMW', nameAr: 'بي إم دبليو' },
  { id: '7', name: 'Mercedes', nameAr: 'مرسيدس' },
  { id: '8', name: 'Audi', nameAr: 'أودي' },
]

const carModels = {
  '1': [ // Toyota
    { id: '1', name: 'Corolla', nameAr: 'كورولا', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    { id: '2', name: 'Camry', nameAr: 'كامري', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    { id: '3', name: 'Land Cruiser', nameAr: 'لاند كروزر', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  ],
  '2': [ // Hyundai
    { id: '4', name: 'Accent', nameAr: 'أكسنت', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    { id: '5', name: 'Elantra', nameAr: 'إلنترا', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    { id: '6', name: 'Sonata', nameAr: 'سوناتا', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  ],
  '3': [ // Nissan
    { id: '7', name: 'Altima', nameAr: 'ألتيما', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    { id: '8', name: 'Maxima', nameAr: 'ماكسيما', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    { id: '9', name: 'Patrol', nameAr: 'باترول', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  ],
}

export default function CarSelector() {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [isBrandOpen, setIsBrandOpen] = useState(false)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [isYearOpen, setIsYearOpen] = useState(false)

  const availableModels = selectedBrand ? carModels[selectedBrand as keyof typeof carModels] || [] : []
  const availableYears = selectedModel 
    ? availableModels.find(model => model.id === selectedModel)?.years || []
    : []

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(brandId)
    setSelectedModel('')
    setSelectedYear('')
    setIsBrandOpen(false)
  }

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId)
    setSelectedYear('')
    setIsModelOpen(false)
  }

  const handleYearSelect = (year: string) => {
    setSelectedYear(year)
    setIsYearOpen(false)
  }

  const isComplete = selectedBrand && selectedModel && selectedYear

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Brand Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
            الماركة
          </label>
          <button
            type="button"
            onClick={() => setIsBrandOpen(!isBrandOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-right focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
          >
            <span className={selectedBrand ? 'text-gray-900' : 'text-gray-500'}>
              {selectedBrand 
                ? carBrands.find(brand => brand.id === selectedBrand)?.nameAr 
                : 'اختر الماركة'
              }
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>

          {isBrandOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {carBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandSelect(brand.id)}
                  className="w-full px-4 py-3 text-right hover:bg-gray-100 focus:bg-gray-100 focus:outline-none font-arabic"
                >
                  {brand.nameAr} ({brand.name})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Model Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
            الموديل
          </label>
          <button
            type="button"
            disabled={!selectedBrand}
            onClick={() => setIsModelOpen(!isModelOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic ${
              selectedBrand ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
            }`}
          >
            <span className={selectedModel ? 'text-gray-900' : 'text-gray-500'}>
              {selectedModel 
                ? availableModels.find(model => model.id === selectedModel)?.nameAr 
                : 'اختر الموديل'
              }
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>

          {isModelOpen && selectedBrand && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className="w-full px-4 py-3 text-right hover:bg-gray-100 focus:bg-gray-100 focus:outline-none font-arabic"
                >
                  {model.nameAr} ({model.name})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Year Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
            سنة التصنيع
          </label>
          <button
            type="button"
            disabled={!selectedModel}
            onClick={() => setIsYearOpen(!isYearOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic ${
              selectedModel ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
            }`}
          >
            <span className={selectedYear ? 'text-gray-900' : 'text-gray-500'}>
              {selectedYear || 'اختر السنة'}
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>

          {isYearOpen && selectedModel && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year.toString())}
                  className="w-full px-4 py-3 text-right hover:bg-gray-100 focus:bg-gray-100 focus:outline-none font-arabic"
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-6 text-center">
        {isComplete ? (
          <Link
            href={`/spare-parts?brand=${selectedBrand}&model=${selectedModel}&year=${selectedYear}`}
            className="btn-primary font-arabic"
          >
            عرض قطع الغيار المتوفرة
          </Link>
        ) : (
          <button
            disabled
            className="bg-gray-300 text-gray-500 px-8 py-3 rounded-full font-semibold cursor-not-allowed font-arabic"
          >
            اختر السيارة أولاً
          </button>
        )}
      </div>

      {/* Selected Car Info */}
      {isComplete && (
        <div className="mt-4 p-4 bg-primary-50 rounded-lg">
          <p className="text-primary-800 font-arabic text-center">
            السيارة المختارة: {carBrands.find(b => b.id === selectedBrand)?.nameAr} {' '}
            {availableModels.find(m => m.id === selectedModel)?.nameAr} {' '}
            {selectedYear}
          </p>
        </div>
      )}
    </div>
  )
}
