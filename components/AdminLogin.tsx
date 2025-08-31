'use client'

import { useState } from 'react'
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<void>
  isLoading: boolean
  error?: string
}

export default function AdminLogin({ onLogin, isLoading, error }: AdminLoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setFormErrors({})
    
    // Validate form
    const errors: { username?: string; password?: string } = {}
    
    if (!username.trim()) {
      errors.username = 'اسم المستخدم مطلوب'
    }
    
    if (!password.trim()) {
      errors.password = 'كلمة المرور مطلوبة'
    } else if (password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    await onLogin(username, password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-in fade-in duration-1000">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LockClosedIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-arabic mb-2">
              تسجيل دخول المدير
            </h1>
            <p className="text-gray-600 font-arabic">
              أدخل بيانات الدخول للوصول إلى لوحة التحكم
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-danger-50 to-danger-100 border border-danger-200 rounded-xl animate-in fade-in duration-300">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-danger-600 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                  <ExclamationTriangleIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-danger-900 font-arabic">خطأ في تسجيل الدخول</h3>
                  <p className="text-sm text-danger-700 font-arabic">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pr-10 pl-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 font-arabic ${
                    formErrors.username 
                      ? 'border-danger-300 bg-danger-50' 
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                  placeholder="أدخل اسم المستخدم"
                  disabled={isLoading}
                />
              </div>
              {formErrors.username && (
                <p className="mt-2 text-sm text-danger-600 font-arabic flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 ml-1" />
                  {formErrors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pr-10 pl-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 font-arabic ${
                    formErrors.password 
                      ? 'border-danger-300 bg-danger-50' 
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                  placeholder="أدخل كلمة المرور"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-2 text-sm text-danger-600 font-arabic flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 ml-1" />
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-arabic shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <div className="loading-spinner"></div>
                  <span>جاري تسجيل الدخول...</span>
                </div>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 font-arabic">
                للوصول إلى لوحة تحكم المدير
              </p>
              <div className="mt-3 flex items-center justify-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-xs text-gray-400 font-arabic">نظام آمن ومشفر</span>
                <div className="w-2 h-2 bg-success-600 rounded-full"></div>
                <span className="text-xs text-gray-400 font-arabic">حماية متقدمة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-700 font-arabic mb-2">
              بيانات تجريبية
            </h3>
            <div className="space-y-1 text-xs text-gray-600 font-arabic">
              <p>اسم المستخدم: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin</span></p>
              <p>كلمة المرور: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
