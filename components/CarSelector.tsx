'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, MagnifyingGlassIcon, TruckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

// Mock data - in real app this would come from API
const carBrands = [
  { id: '1', name: 'Toyota', nameAr: 'تويوتا', logo: '🚗' },
  { id: '2', name: 'Hyundai', nameAr: 'هيونداي', logo: '🚙' },
  { id: '3', name: 'Nissan', nameAr: 'نيسان', logo: '🏎️' },
  { id: '4', name: 'Honda', nameAr: 'هوندا', logo: '🚐' },
  { id: '5', name: 'Ford', nameAr: 'فورد', logo: '🚓' },
  { id: '6', name: 'BMW', nameAr: 'بي إم دبليو', logo: '🏁' },
  { id: '7', name: 'Mercedes', nameAr: 'مرسيدس', logo: '🚕' },
  { id: '8', name: 'Audi', nameAr: 'أودي', logo: '🚗' },
]

const carModels = {
  '1': [ // Toyota
    { id: '1', name: 'Corolla', nameAr: 'كورولا', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], image: '🚗' },
    { id: '2', name: 'Camry', nameAr: 'كامري', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], image: '🚙' },
    { id: '3', name: 'Land Cruiser', nameAr: 'لاند كروزر', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], image: '🚐' },
  ],
  '2': [ // Hyundai
    { id: '4', name: 'Accent', nameAr: 'أكسنت', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], image: '🚗' },
    { id: '5', name: 'Elantra', nameAr: 'إلنترا', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], image: '🚙' },
    { id: '6', name: 'Sonata', nameAr: 'سوناتا', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], image: '🏎️' },
  ],
  '3': [ // Nissan
    { id: '7', name: 'Altima', nameAr: 'ألتيما', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], image: '🚗' },
    { id: '8', name: 'Maxima', nameAr: 'ماكسيما', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], image: '🚙' },
    { id: '9', name: 'Patrol', nameAr: 'باترول', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], image: '🚐' },
  ],
}

export default function CarSelector() {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [isBrandOpen, setIsBrandOpen] = useState(false)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [isYearOpen, setIsYearOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const availableModels = selectedBrand ? carModels[selectedBrand as keyof typeof carModels] || [] : []
  const availableYears = selectedModel 
    ? availableModels.find(model => model.id === selectedModel)?.years || []
    : []

  // Filter brands and models based on search
  const filteredBrands = carBrands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.nameAr.includes(searchQuery)
  )

  const filteredModels = availableModels.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.nameAr.includes(searchQuery)
  )

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
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <TruckIcon className="h-10 w-10 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
          اختر سيارتك
        </h2>
        <p className="text-gray-600 font-arabic">
          اختر ماركة وموديل وسنة تصنيع سيارتك للعثور على قطع الغيار المناسبة
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن ماركة أو موديل..."
            className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 font-arabic text-lg"
          />
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Brand Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-3 font-arabic">
            الماركة
          </label>
          <button
            type="button"
            onClick={() => setIsBrandOpen(!isBrandOpen)}
            className="w-full flex items-center justify-between px-4 py-4 border-2 border-gray-300 rounded-xl bg-white text-right focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 font-arabic hover:border-primary-300 transition-colors"
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              {selectedBrand && (
                <span className="text-2xl">
                  {carBrands.find(brand => brand.id === selectedBrand)?.logo}
                </span>
              )}
              <span className={selectedBrand ? 'text-gray-900' : 'text-gray-500'}>
                {selectedBrand 
                  ? carBrands.find(brand => brand.id === selectedBrand)?.nameAr 
                  : 'اختر الماركة'
                }
              </span>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>

          {isBrandOpen && (
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-auto">
              {filteredBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandSelect(brand.id)}
                  className="w-full px-4 py-3 text-right hover:bg-primary-50 focus:bg-primary-50 focus:outline-none font-arabic border-b border-gray-100 last:border-b-0 flex items-center space-x-3 space-x-reverse"
                >
                  <span className="text-2xl">{brand.logo}</span>
                  <span>{brand.nameAr} ({brand.name})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Model Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-3 font-arabic">
            الموديل
          </label>
          <button
            type="button"
            disabled={!selectedBrand}
            onClick={() => setIsModelOpen(!isModelOpen)}
            className={`w-full flex items-center justify-between px-4 py-4 border-2 rounded-xl text-right focus:outline-none focus:ring-4 focus:ring-primary-500/20 font-arabic transition-colors ${
              selectedBrand 
                ? 'border-gray-300 bg-white hover:border-primary-300 focus:border-primary-500' 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              {selectedModel && (
                <span className="text-2xl">
                  {availableModels.find(model => model.id === selectedModel)?.image}
                </span>
              )}
              <span className={selectedModel ? 'text-gray-900' : 'text-gray-500'}>
                {selectedModel 
                  ? availableModels.find(model => model.id === selectedModel)?.nameAr 
                  : 'اختر الموديل'
                }
              </span>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>

          {isModelOpen && selectedBrand && (
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-auto">
              {filteredModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className="w-full px-4 py-3 text-right hover:bg-primary-50 focus:bg-primary-50 focus:outline-none font-arabic border-b border-gray-100 last:border-b-0 flex items-center space-x-3 space-x-reverse"
                >
                  <span className="text-2xl">{model.image}</span>
                  <span>{model.nameAr} ({model.name})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Year Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-3 font-arabic">
            سنة التصنيع
          </label>
          <button
            type="button"
            disabled={!selectedModel}
            onClick={() => setIsYearOpen(!isYearOpen)}
            className={`w-full flex items-center justify-between px-4 py-4 border-2 rounded-xl text-right focus:outline-none focus:ring-4 focus:ring-primary-500/20 font-arabic transition-colors ${
              selectedModel 
                ? 'border-gray-300 bg-white hover:border-primary-300 focus:border-primary-500' 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
            }`}
          >
            <span className={selectedYear ? 'text-gray-900' : 'text-gray-500'}>
              {selectedYear || 'اختر السنة'}
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>

          {isYearOpen && selectedModel && (
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-auto">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year.toString())}
                  className="w-full px-4 py-3 text-right hover:bg-primary-50 focus:bg-primary-50 focus:outline-none font-arabic border-b border-gray-100 last:border-b-0"
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Car Display */}
      {isComplete && (
        <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl border border-primary-200">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 space-x-reverse mb-4">
              <span className="text-4xl">
                {carBrands.find(b => b.id === selectedBrand)?.logo}
              </span>
              <span className="text-2xl">
                {availableModels.find(m => m.id === selectedModel)?.image}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-primary-800 font-arabic mb-2">
              السيارة المختارة
            </h3>
            <p className="text-lg text-primary-700 font-arabic">
              {carBrands.find(b => b.id === selectedBrand)?.nameAr} {' '}
              {availableModels.find(m => m.id === selectedModel)?.nameAr} {' '}
              {selectedYear}
            </p>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="mt-8 text-center">
        {isComplete ? (
          <Link
            href={`/spare-parts?brand=${selectedBrand}&model=${selectedModel}&year=${selectedYear}`}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-lg font-semibold rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-arabic shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            عرض قطع الغيار المتوفرة
            <ChevronDownIcon className="h-5 w-5 mr-2 transform rotate-90" />
          </Link>
        ) : (
          <button
            disabled
            className="px-8 py-4 bg-gray-300 text-gray-500 text-lg font-semibold rounded-2xl cursor-not-allowed font-arabic"
          >
            اختر السيارة أولاً
          </button>
        )}
      </div>
    </div>
  )
}
