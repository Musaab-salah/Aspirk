'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, TruckIcon, ShieldCheckIcon, ClockIcon, StarIcon, ArrowRightIcon, CheckCircleIcon, HomeIcon, WrenchScrewdriverIcon, ClipboardDocumentCheckIcon, PhotoIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import CarSelector from '@/components/CarSelector'
import StepNavigation from '@/components/StepNavigation'
import PhotoUpload from '@/components/PhotoUpload'
import { processImageForChassisNumber } from '@/utils/ocrUtils'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [unifiedSearch, setUnifiedSearch] = useState('')
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [searchMode, setSearchMode] = useState<'text' | 'ocr'>('text')
  const [error, setError] = useState('')

  // Define the workflow steps
  const steps = [
    {
      id: 'home',
      title: 'Home',
      titleAr: 'الرئيسية',
      icon: HomeIcon,
      isCompleted: true,
      isCurrent: true
    },
    {
      id: 'select-car',
      title: 'Select Car',
      titleAr: 'اختيار السيارة',
      icon: TruckIcon,
      isCompleted: false,
      isCurrent: false
    },
    {
      id: 'spare-parts',
      title: 'Spare Parts',
      titleAr: 'قطع الغيار',
      icon: WrenchScrewdriverIcon,
      isCompleted: false,
      isCurrent: false
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic
    console.log('Searching for:', searchQuery)
  }

  const handleImageProcessed = async (imageData: string, extractedText?: string) => {
    setIsProcessingImage(true)
    setError('')
    
    try {
      const result = await processImageForChassisNumber(imageData)
      console.log('OCR Result:', result)
      
      // Always show extracted text for user to edit, even if not perfect
      if (result.extractedText) {
        console.log('Setting extracted text:', result.extractedText)
        setExtractedText(result.extractedText)
        setUnifiedSearch(result.extractedText)
        setSearchMode('ocr')
        setError('')
        
        // Show a helpful message if the chassis number wasn't perfectly detected
        if (!result.chassisNumber) {
          setError('تم استخراج النص من الصورة. يرجى مراجعة النص وتعديله إذا لزم الأمر.')
        }
      } else {
        setError('لم يتم العثور على نص في الصورة. يرجى المحاولة مرة أخرى أو البحث يدوياً.')
        setSearchMode('text')
      }
    } catch (error) {
      console.error('Error processing image:', error)
      setError('حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى.')
      setSearchMode('text')
    } finally {
      setIsProcessingImage(false)
    }
  }

  const handleImageError = (errorMessage: string) => {
    setError(errorMessage)
    setIsProcessingImage(false)
  }

  const handleUnifiedSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if we have search text from either manual input or OCR
    const searchText = unifiedSearch.trim()
    console.log('Search attempt - unifiedSearch:', unifiedSearch)
    console.log('Search attempt - searchText:', searchText)
    console.log('Search attempt - searchMode:', searchMode)
    console.log('Search attempt - extractedText:', extractedText)
    
    if (!searchText) {
      alert('يرجى إدخال نص للبحث أو التقط صورة')
      return
    }
    
    // Show loading state
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement
    const originalText = submitButton.innerHTML
    submitButton.innerHTML = '🔍 جاري البحث...'
    submitButton.disabled = true
    
    // Navigate to spare parts page with search query
    const searchParams = new URLSearchParams()
    searchParams.append('search', searchText)
    
    // You can also add car selection if available
    // if (selectedCar) {
    //   searchParams.append('brand', selectedCar.brand)
    //   searchParams.append('model', selectedCar.model)
    //   searchParams.append('year', selectedCar.year)
    // }
    
    // Small delay to show loading state
    setTimeout(() => {
      window.location.href = `/spare-parts?${searchParams.toString()}`
    }, 500)
  }

  const features = [
    {
      icon: TruckIcon,
      title: 'شحن سريع',
      description: 'شحن سريع وآمن من الإمارات إلى جميع أنحاء المنطقة مع تتبع مباشر للشحنة',
      color: 'primary',
      delay: '300'
    },
    {
      icon: ShieldCheckIcon,
      title: 'جودة مضمونة',
      description: 'جميع قطع الغيار أصلية ومضمونة الجودة مع ضمان استرداد الأموال',
      color: 'success',
      delay: '500'
    },
    {
      icon: ClockIcon,
      title: 'خدمة 24/7',
      description: 'خدمة عملاء متاحة على مدار الساعة لمساعدتك في أي وقت تحتاج إليه',
      color: 'warning',
      delay: '700'
    }
  ]

  const testimonials = [
    {
      name: 'أحمد محمد',
      location: 'دبي',
      rating: 5,
      comment: 'خدمة ممتازة وسريعة. حصلت على قطع الغيار خلال يومين فقط. أنصح الجميع بالتجربة',
      avatar: 'أ',
      color: 'primary'
    },
    {
      name: 'سارة أحمد',
      location: 'أبو ظبي',
      rating: 5,
      comment: 'الأسعار منافسة والجودة عالية. فريق العمل متعاون جداً ويقدم خدمة ممتازة',
      avatar: 'س',
      color: 'success'
    },
    {
      name: 'علي حسن',
      location: 'الشارقة',
      rating: 5,
      comment: 'أفضل موقع لطلب قطع الغيار. التوصيل سريع والأسعار معقولة والجودة ممتازة',
      avatar: 'ع',
      color: 'warning'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'عميل راضي', icon: '😊' },
    { number: '50,000+', label: 'طلب منجز', icon: '📦' },
    { number: '24/7', label: 'دعم فني', icon: '🛠️' },
    { number: '100%', label: 'ضمان الجودة', icon: '✅' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Step Navigation */}
      <StepNavigation currentStep="home" steps={steps} />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-secondary-600/5"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-warning-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container-responsive relative z-10">
          <div className="text-center">
            <div className="mb-8 animate-in fade-in duration-1000">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 rounded-full text-sm font-semibold font-arabic mb-4">
                🚀 الخدمة الأسرع في المنطقة
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-in fade-in duration-1000">
              <span className="block font-arabic text-5xl md:text-7xl lg:text-8xl mb-4 text-gradient-primary">
                سيجما بارت
              </span>
              <span className="block text-3xl md:text-5xl lg:text-6xl text-primary-600">
                SigmaPart - قطع غيار السيارات
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto font-arabic leading-relaxed animate-in fade-in duration-1000 animation-delay-300">
              خدمة موثوقة وسريعة ل
              السيارات من كل مكان. نضمن لك الجودة والأسعار المنافسة مع خدمة عملاء متميزة
            </p>

            {/* Search Bar */}
            

            {/* Quick Car Selector */}
            <div className="mb-16 animate-in fade-in duration-1000 animation-delay-700">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-8 font-arabic">
                اختر سيارتك بسرعة
              </h2>
              <div className="max-w-6xl mx-auto">
                <CarSelector />
              </div>
            </div>

            {/* Unified Search Section */}
            <div className="mb-16 animate-in fade-in duration-1000 animation-delay-800">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-8 font-arabic">
                بحث متقدم
              </h2>
              <div className="max-w-3xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary-600 font-bold text-3xl">🔍</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 font-arabic mb-2">
                      بحث شامل
                    </h3>
                    <p className="text-gray-600 font-arabic">
                      اختر إما الكتابة اليدوية أو التقط صورة لرقم الشاسيه أو القطعة
                    </p>
                  </div>
                  
                  <form onSubmit={handleUnifiedSearch} className="space-y-6">
                    {/* Option 1: Manual Input */}
                    <div className="space-y-3">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-800 font-arabic mb-2">
                          الخيار الأول: الكتابة اليدوية
                        </h4>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={unifiedSearch}
                          onChange={(e) => {
                            setUnifiedSearch(e.target.value)
                            setSearchMode('text')
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleUnifiedSearch(e as any)
                            }
                          }}
                        placeholder="أدخل اسم القطعة أو رقم الشاسيه يدوياً..."
                        className={`w-full px-6 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 font-arabic text-center shadow-lg hover:shadow-xl transition-all duration-300 ${
                          searchMode === 'ocr' && extractedText 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-300 focus:border-primary-500'
                        }`}
                        suppressHydrationWarning
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        {unifiedSearch && (
                          <button
                            type="button"
                            onClick={() => {
                              setUnifiedSearch('')
                              setSearchMode('text')
                              setExtractedText('')
                              setError('')
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            title="مسح البحث"
                          >
                            ✕
                          </button>
                        )}
                        {searchMode === 'ocr' && extractedText && (
                          <div className="absolute left-12 top-1/2 transform -translate-y-1/2">
                            <span className="text-xs text-primary-600 font-arabic">📷</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="flex items-center">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="px-4 text-sm text-gray-500 font-arabic">أو</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                    
                    {/* Option 2: Photo Upload */}
                    <div className="space-y-3">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-800 font-arabic mb-2">
                          الخيار الثاني: التقط صورة
                        </h4>
                      </div>
                      <div className="flex items-center justify-center">
                        <PhotoUpload
                          onImageProcessed={handleImageProcessed}
                          onError={handleImageError}
                          className="w-full max-w-md"
                        />
                        {isProcessingImage && (
                          <div className="flex items-center text-sm text-primary-600 font-arabic mr-3">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 ml-2"></div>
                            معالجة الصورة...
                          </div>
                        )}
                      </div>
                      
                      {/* OCR Tips */}
                      <div className="text-xs text-gray-500 font-arabic bg-gray-50 p-3 rounded-lg text-center">
                        💡 نصيحة: تأكد من أن رقم الشاسيه أو رقم القطعة واضح في الصورة للحصول على أفضل النتائج
                      </div>
                      
                      {/* OCR Result Indicator */}
                      {searchMode === 'ocr' && extractedText && (
                        <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <p className="text-sm text-primary-800 font-arabic mb-2">
                                🔍 تم استخراج النص من الصورة:
                              </p>
                              <div className="bg-white p-3 rounded border border-primary-200">
                                <p className="text-lg font-semibold text-gray-900 font-arabic">
                                  {extractedText}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSearchMode('text')
                                setExtractedText('')
                                setUnifiedSearch('')
                                setError('')
                              }}
                              className="text-xs text-primary-600 hover:text-primary-800 font-arabic mr-2"
                              title="العودة للبحث النصي"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="text-xs text-primary-600 font-arabic">
                            💡 يمكنك تعديل النص في حقل البحث أعلاه أو البحث مباشرة
                          </div>
                        </div>
                      )}
                      
                      {/* Error Message */}
                      {error && (
                        <div className={`p-3 rounded-lg ${
                          error.includes('تم استخراج النص') 
                            ? 'bg-yellow-50 border border-yellow-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <p className={`text-sm font-arabic ${
                            error.includes('تم استخراج النص') 
                              ? 'text-yellow-800' 
                              : 'text-red-800'
                          }`}>
                            {error}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-arabic shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                      >
                        🔍 بحث شامل
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUnifiedSearch('')
                          setSearchMode('text')
                          setExtractedText('')
                          setError('')
                        }}
                        className="px-6 py-4 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-arabic shadow-lg hover:shadow-xl"
                      >
                        مسح الكل
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-arabic">
                        💡 يمكنك الكتابة يدوياً أو التقط صورة - كلا الخيارين يعمل بشكل مستقل
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-in fade-in duration-1000 animation-delay-900">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 font-arabic mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-arabic">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50"></div>
        <div className="container-responsive relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-success-100 to-success-200 text-success-800 rounded-full text-sm font-semibold font-arabic mb-4">
              ✨ لماذا تختار خدمتنا؟
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 font-arabic animate-in fade-in duration-1000">
              مميزاتنا المتفردة
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 font-arabic max-w-3xl mx-auto leading-relaxed">
              نقدم لك أفضل الخدمات مع ضمان الجودة والسرعة في التوصيل
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center group animate-in fade-in duration-1000" style={{ animationDelay: `${feature.delay}ms` }}>
                <div className={`bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                  <feature.icon className={`h-10 w-10 lg:h-12 lg:w-12 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4 font-arabic">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-arabic leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-secondary-600/5"></div>
        <div className="container-responsive relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 rounded-full text-sm font-semibold font-arabic mb-4">
              💬 آراء عملائنا
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 font-arabic">
              ماذا يقول عملاؤنا؟
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 font-arabic max-w-3xl mx-auto">
              اكتشف ما يقوله عملاؤنا عن خدمتنا المتميزة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-in fade-in" style={{ animationDelay: `${(index + 1) * 200}ms` }}>
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${testimonial.color}-100 to-${testimonial.color}-200 rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className={`text-${testimonial.color}-600 font-bold text-xl`}>{testimonial.avatar}</span>
                  </div>
                  <div className="mr-4">
                    <h4 className="font-semibold text-gray-900 font-arabic text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 font-arabic">{testimonial.location}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 font-arabic leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container-responsive relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold font-arabic mb-6">
              🚀 ابدأ الآن
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 font-arabic animate-in fade-in duration-1000">
              ابدأ الآن مع سيجما بارت
            </h2>
            <p className="text-xl lg:text-2xl text-primary-100 mb-12 font-arabic max-w-3xl mx-auto leading-relaxed animate-in fade-in duration-1000 animation-delay-300">
              احصل على أفضل الأسعار والجودة المضمونة مع خدمة عملاء متميزة
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in duration-1000 animation-delay-500">
              <Link
                href="/car-selector"
                className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 font-arabic text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 space-x-reverse group"
              >
                <span>ابدأ الطلب الآن</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/user-dashboard"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 font-arabic text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 space-x-reverse group"
              >
                <span>لوحة تحكم المستخدم</span>
                <CheckCircleIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Access Section */}
      <section className="py-12 bg-gray-100">
        <div className="container-responsive text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">⚙️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 font-arabic">
              للمديرين
            </h3>
            <p className="text-gray-600 mb-6 font-arabic">
              إدارة الطلبات والموافقة عليها
            </p>
            <Link
              href="/admin"
              className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-arabic shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center space-x-2 space-x-reverse group"
            >
              <span>لوحة تحكم المدير</span>
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
