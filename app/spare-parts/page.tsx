'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, FunnelIcon, PhotoIcon, HomeIcon, TruckIcon, WrenchScrewdriverIcon, ClipboardDocumentCheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SparePartCard from '@/components/SparePartCard'
import StepNavigation from '@/components/StepNavigation'
import Breadcrumb from '@/components/Breadcrumb'
import { SparePart, SparePartCategory, SparePartSelection, COUNTRIES, ExchangeRateConfig, calculateSDGPrice } from '@/types'

// Mock data - in real app this would come from API
const sparePartsCategories: SparePartCategory[] = [
  { id: '1', name: 'Engine Parts', nameAr: 'قطع المحرك', icon: '🔧' },
  { id: '2', name: 'Brake System', nameAr: 'نظام الفرامل', icon: '🛑' },
  { id: '3', name: 'Suspension', nameAr: 'نظام التعليق', icon: '🚗' },
  { id: '4', name: 'Electrical', nameAr: 'الأنظمة الكهربائية', icon: '⚡' },
  { id: '5', name: 'Body Parts', nameAr: 'قطع الهيكل', icon: '🚙' },
  { id: '6', name: 'Interior', nameAr: 'التجهيزات الداخلية', icon: '💺' },
]

// Spare parts will be fetched from API

export default function SparePartsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [parts, setParts] = useState<SparePart[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [selectedParts, setSelectedParts] = useState<SparePartSelection[]>([])
  const [countryFilter, setCountryFilter] = useState('')
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const brand = searchParams.get('brand')
  const model = searchParams.get('model')
  const year = searchParams.get('year')
  const searchParam = searchParams.get('search')

  // Set search query from URL parameter
  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [searchParam])

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
        // Filter to only show available parts
        const availableParts = data.data.filter((part: SparePart) => part.isAvailable)
        setParts(availableParts)
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

  // Define the workflow steps
  const steps = [
    {
      id: 'home',
      title: 'Home',
      titleAr: 'الرئيسية',
      icon: HomeIcon,
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'select-car',
      title: 'Select Car',
      titleAr: 'اختيار السيارة',
      icon: TruckIcon,
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'spare-parts',
      title: 'Spare Parts',
      titleAr: 'قطع الغيار',
      icon: WrenchScrewdriverIcon,
      isCompleted: false,
      isCurrent: true
    },
    {
      id: 'confirm-order',
      title: 'Confirm Order',
      titleAr: 'تأكيد الطلب',
      icon: ClipboardDocumentCheckIcon,
      isCompleted: false,
      isCurrent: false
    }
  ]

  // Filter spare parts based on criteria
  const filteredParts = parts.filter(part => {
    const matchesCategory = !selectedCategory || part.category === selectedCategory
    const matchesSearch = !searchQuery || 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.nameAr.includes(searchQuery) ||
      part.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.descriptionAr?.includes(searchQuery) ||
      part.partNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = (!priceRange.min || (part.prices.commercial.sdg && part.prices.commercial.sdg >= parseInt(priceRange.min))) &&
                        (!priceRange.max || (part.prices.commercial.sdg && part.prices.commercial.sdg <= parseInt(priceRange.max)))
    const matchesAvailability = !showAvailableOnly || part.isAvailable
    const matchesCountry = !countryFilter || part.countryOfOrigin === countryFilter

    return matchesCategory && matchesSearch && matchesPrice && matchesAvailability && matchesCountry
  })

  const handlePartToggle = (part: SparePart) => {
    setSelectedParts(prev => {
      const existingIndex = prev.findIndex(p => p.partId === part.id)
      if (existingIndex >= 0) {
        // Remove if already selected
        return prev.filter(p => p.partId !== part.id)
      } else {
        // Add with default values
        return [...prev, {
          partId: part.id,
          quantity: 1,
          type: 'commercial' as const,
          part: part
        }]
      }
    })
  }

  const handleQuantityChange = (partId: string, quantity: number) => {
    setSelectedParts(prev => 
      prev.map(p => 
        p.partId === partId 
          ? { ...p, quantity: Math.max(1, quantity) }
          : p
      )
    )
  }

  const handleTypeChange = (partId: string, type: 'original' | 'commercial') => {
    setSelectedParts(prev => 
      prev.map(p => 
        p.partId === partId 
          ? { ...p, type }
          : p
      )
    )
  }

  const handleRequestQuote = () => {
    if (selectedParts.length === 0) {
      alert('يرجى اختيار قطع الغيار المطلوبة قبل المتابعة')
      return
    }
    // Navigate to shipping page with selected parts data
    const partsParam = selectedParts.map(p => p.partId).join(',')
    const quantitiesParam = selectedParts.map(p => p.quantity).join(',')
    const typesParam = selectedParts.map(p => p.type).join(',')
    router.push(`/shipping?parts=${partsParam}&quantities=${quantitiesParam}&types=${typesParam}&brand=${brand}&model=${model}&year=${year}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Step Navigation */}
      <StepNavigation currentStep="spare-parts" steps={steps} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { name: 'Select Car', nameAr: 'اختيار السيارة', href: '/' },
            { name: 'Spare Parts', nameAr: 'قطع الغيار', isCurrent: true }
          ]} 
        />
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
            قطع الغيار المتوفرة
          </h1>
          {brand && model && year && (
            <p className="text-lg text-gray-600 font-arabic">
              السيارة المختارة: تويوتا كورولا 2016
            </p>
          )}
          {searchQuery && (
            <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-primary-800 font-arabic">
                🔍 نتائج البحث عن: <span className="font-semibold">{searchQuery}</span>
                <span className="mr-2 text-sm text-primary-600">
                  ({filteredParts.length} نتيجة)
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-arabic">
                الفلاتر
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  البحث
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن قطع الغيار..."
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                    suppressHydrationWarning
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="مسح البحث"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  الفئة
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                >
                  <option value="">جميع الفئات</option>
                  {sparePartsCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  بلد المنشأ
                </label>
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                >
                  <option value="">جميع البلدان</option>
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  نطاق السعر (درهم)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="من"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                    suppressHydrationWarning
                  />
                  <input
                    type="number"
                    placeholder="إلى"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    suppressHydrationWarning
                  />
                  <span className="mr-2 text-sm text-gray-700 font-arabic">
                    المتوفر فقط
                  </span>
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSearchQuery('')
                  setPriceRange({ min: '', max: '' })
                  setShowAvailableOnly(false)
                  setCountryFilter('')
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-arabic"
              >
                مسح الفلاتر
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600 font-arabic">
                  {filteredParts.length} قطعة غيار متوفرة
                </p>
                {searchQuery && (
                  <p className="text-sm text-primary-600 font-arabic mt-1">
                    🔍 نتائج البحث عن: {searchQuery}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-sm text-gray-600 font-arabic">
                  المختار: {selectedParts.length}
                </span>
                {selectedParts.length > 0 && (
                  <button
                    onClick={handleRequestQuote}
                    className="btn-primary font-arabic"
                  >
                    طلب عرض سعر
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredParts.map(part => (
                <SparePartCard
                  key={part.id}
                  part={part}
                  isSelected={selectedParts.some(p => p.partId === part.id)}
                  onToggle={() => handlePartToggle(part)}
                  selectedPart={selectedParts.find(p => p.partId === part.id)}
                  onQuantityChange={handleQuantityChange}
                  onTypeChange={handleTypeChange}
                  exchangeRate={exchangeRate?.aedToSdg}
                />
                ))}
              </div>
            )}

            {filteredParts.length === 0 && (
              <div className="text-center py-12">
                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">
                  {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد قطع غيار'}
                </h3>
                <p className="text-gray-600 font-arabic mb-4">
                  {searchQuery 
                    ? `لم نتمكن من العثور على نتائج لـ "${searchQuery}". جرب البحث بكلمات مختلفة أو استخدم رقم القطعة.`
                    : 'جرب تغيير الفلاتر أو البحث بكلمات مختلفة'
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-arabic"
                  >
                    مسح البحث
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA - Request Quote Button */}
      {selectedParts.length > 0 && (
        <div className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 font-arabic">
                جاهز لطلب عرض السعر؟
              </h3>
              <p className="text-gray-600 mb-6 font-arabic">
                تم اختيار {selectedParts.length} قطعة غيار. اضغط على الزر أدناه للمتابعة
              </p>
              <button
                onClick={handleRequestQuote}
                className="btn-primary text-lg px-8 py-4 font-arabic shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                طلب عرض سعر
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
