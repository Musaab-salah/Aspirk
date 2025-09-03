'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProgressStepper from '@/components/ProgressStepper'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
    agreeToTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get order data from URL params
  const parts = searchParams.get('parts')
  const quantities = searchParams.get('quantities')
  const brand = searchParams.get('brand')
  const model = searchParams.get('model')
  const year = searchParams.get('year')

  // Progress steps
  const steps = [
    {
      id: 'car-selection',
      title: 'Car Selection',
      titleAr: 'اختيار السيارة',
      description: 'Choose your car',
      descriptionAr: 'اختر سيارتك',
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'parts-selection',
      title: 'Parts Selection',
      titleAr: 'اختيار قطع الغيار',
      description: 'Select spare parts',
      descriptionAr: 'اختر قطع الغيار',
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'order-review',
      title: 'Order Review',
      titleAr: 'مراجعة الطلب',
      description: 'Review your order',
      descriptionAr: 'راجع طلبك',
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'login',
      title: 'Login/Signup',
      titleAr: 'تسجيل الدخول',
      description: 'Login or create account',
      descriptionAr: 'سجل دخول أو أنشئ حساب',
      isCompleted: false,
      isCurrent: true
    },
    {
      id: 'quotation',
      title: 'Request Quotation',
      titleAr: 'طلب عرض سعر',
      description: 'Get price quote',
      descriptionAr: 'احصل على عرض السعر',
      isCompleted: false,
      isCurrent: false
    },
    {
      id: 'payment',
      title: 'Payment',
      titleAr: 'الدفع',
      description: 'Complete payment',
      descriptionAr: 'أكمل الدفع',
      isCompleted: false,
      isCurrent: false
    }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (isLogin) {
      // Login validation
      if (!formData.email && !formData.phone) {
        newErrors.email = 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف'
      }
      if (!formData.password) {
        newErrors.password = 'يرجى إدخال كلمة المرور'
      }
    } else {
      // Signup validation
      if (!formData.name.trim()) {
        newErrors.name = 'يرجى إدخال الاسم'
      }
      if (!formData.email && !formData.phone) {
        newErrors.email = 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف'
      }
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح'
      }
      if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
        newErrors.phone = 'يرجى إدخال رقم هاتف صحيح'
      }
      if (!formData.password) {
        newErrors.password = 'يرجى إدخال كلمة المرور'
      } else if (formData.password.length < 6) {
        newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'يرجى تأكيد كلمة المرور'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'كلمة المرور غير متطابقة'
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'يجب الموافقة على الشروط والأحكام'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // In real app, this would make an API call
      console.log('Form submitted:', formData)
      
      // Navigate to quotation page
      const params = new URLSearchParams()
      if (parts) params.append('parts', parts)
      if (quantities) params.append('quantities', quantities)
      if (brand) params.append('brand', brand)
      if (model) params.append('model', model)
      if (year) params.append('year', year)
      
      router.push(`/quotation?${params.toString()}`)
    }
  }

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    // In real app, this would handle OAuth
    console.log(`${provider} login clicked`)
    
    // For demo purposes, navigate directly
    const params = new URLSearchParams()
    if (parts) params.append('parts', parts)
    if (quantities) params.append('quantities', quantities)
    if (brand) params.append('brand', brand)
    if (model) params.append('model', model)
    if (year) params.append('year', year)
    
    router.push(`/quotation?${params.toString()}`)
  }

  const handleBack = () => {
    const params = new URLSearchParams()
    if (parts) params.append('parts', parts)
    if (brand) params.append('brand', brand)
    if (model) params.append('model', model)
    if (year) params.append('year', year)
    
    router.push(`/order-review?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Progress Stepper */}
      <ProgressStepper steps={steps} currentStep="login" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 space-x-reverse text-primary-600 hover:text-primary-700 font-arabic"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>العودة لمراجعة الطلب</span>
            </button>
            
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </h1>
              <p className="text-lg text-gray-600 font-arabic">
                {isLogin 
                  ? 'سجل دخولك للمتابعة مع طلبك' 
                  : 'أنشئ حساب جديد للمتابعة مع طلبك'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login/Signup Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 font-arabic ${
                      errors.name ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="أدخل اسمك الكامل"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 font-arabic">{errors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 font-arabic ${
                    errors.email ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="أدخل بريدك الإلكتروني"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 font-arabic">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  رقم الهاتف (اختياري)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 font-arabic"
                  placeholder="أدخل رقم هاتفك"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 font-arabic ${
                      errors.password ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 font-arabic">{errors.password}</p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 font-arabic ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="أعد إدخال كلمة المرور"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 font-arabic">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {!isLogin && (
                <div className="flex items-start space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-700 font-arabic">
                    أوافق على <a href="#" className="text-primary-600 hover:text-primary-700">الشروط والأحكام</a> و <a href="#" className="text-primary-600 hover:text-primary-700">سياسة الخصوصية</a>
                  </label>
                </div>
              )}

              {errors.agreeToTerms && (
                <p className="text-sm text-red-600 font-arabic">{errors.agreeToTerms}</p>
              )}

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-700 transition-colors font-arabic"
              >
                {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
              </button>
            </form>

            {/* Toggle between Login/Signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 font-arabic">
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-600 hover:text-primary-700 font-semibold mr-1 font-arabic"
                >
                  {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                </button>
              </p>
            </div>
          </div>

          {/* Social Login & Info */}
          <div className="space-y-6">
            {/* Social Login */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 font-arabic text-center">
                تسجيل دخول سريع
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleSocialLogin('google')}
                  className="w-full flex items-center justify-center space-x-3 space-x-reverse px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors font-arabic"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>تسجيل الدخول بحساب Google</span>
                </button>

                <button
                  onClick={() => handleSocialLogin('apple')}
                  className="w-full flex items-center justify-center space-x-3 space-x-reverse px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors font-arabic"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>تسجيل الدخول بحساب Apple</span>
                </button>
              </div>
            </div>

            {/* Order Info */}
            {parts && (
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
                <h3 className="text-lg font-semibold text-primary-800 mb-4 font-arabic text-center">
                  معلومات الطلب
                </h3>
                <div className="space-y-2 text-sm text-primary-700 font-arabic">
                  <p>عدد قطع الغيار: {parts.split(',').length}</p>
                  {brand && model && year && (
                    <p>السيارة: تويوتا كورولا 2016</p>
                  )}
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-arabic text-center">
                مميزات إنشاء الحساب
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 font-arabic">
                <li className="flex items-center space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  <span>تتبع طلباتك بسهولة</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  <span>حفظ بيانات السيارة</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  <span>إشعارات فورية بحالة الطلب</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  <span>عروض خاصة وحسومات</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
