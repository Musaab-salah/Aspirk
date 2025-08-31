'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon, UserIcon, ShoppingCartIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: '🏠' },
    { name: 'اختيار السيارة', href: '/car-selector', icon: '🚗' },
    { name: 'قطع الغيار', href: '/spare-parts', icon: '🔧' },
    { name: 'طلباتي', href: '/my-orders', icon: '📋' },
    { name: 'طلب جديد', href: '/new-request', icon: '➕' },
    { name: 'اتصل بنا', href: '/contact', icon: '📞' },
  ]

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen && !(event.target as Element).closest('.user-menu')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50' 
        : 'bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200/30'
    }`}>
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <span className="text-white font-bold text-xl lg:text-2xl">س</span>
              </div>
              <div className="mr-3 lg:mr-4">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 font-arabic group-hover:text-primary-600 transition-colors duration-300">
                  قطع الغيار
                </h1>
                <p className="text-sm lg:text-base text-gray-500 font-arabic group-hover:text-primary-500 transition-colors duration-300">
                  Spare Parts
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 relative group font-arabic flex items-center space-x-2 space-x-reverse"
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span>{item.name}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث..."
                className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md font-arabic text-sm"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>

            {/* Language Switcher */}
            <button className="text-gray-700 hover:text-primary-600 font-medium font-arabic transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-primary-50">
              English
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-all duration-300 hover:scale-105 group">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg group-hover:bg-primary-700 transition-all duration-300 font-bold">
                0
              </span>
            </Link>

            {/* User Menu */}
            <div className="relative user-menu">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 space-x-reverse text-gray-700 hover:text-primary-600 transition-all duration-300 hover:scale-105 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary-100 group-hover:to-primary-200 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <UserIcon className="h-5 w-5" />
                </div>
                <span className="font-medium font-arabic">حسابي</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl py-3 z-50 border border-gray-100 animate-in slide-in-from-top-2 duration-200 glass">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500 font-arabic">مرحباً بك</p>
                    <p className="font-semibold text-gray-900 font-arabic">زائر</p>
                  </div>
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-arabic transition-all duration-200 flex items-center space-x-2 space-x-reverse"
                  >
                    <span>🔐</span>
                    <span>تسجيل الدخول</span>
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-arabic transition-all duration-200 flex items-center space-x-2 space-x-reverse"
                  >
                    <span>👤</span>
                    <span>إنشاء حساب</span>
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link
                    href="/admin"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-arabic transition-all duration-200 flex items-center space-x-2 space-x-reverse"
                  >
                    <span>⚙️</span>
                    <span>لوحة التحكم</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-all duration-300 p-2 rounded-xl hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mobile-menu">
            <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 border-t border-gray-200 bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-xl">
              {/* Mobile Search */}
              <div className="px-4 py-3">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث في الموقع..."
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm font-arabic"
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>

              {/* Mobile Navigation Links */}
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-arabic transition-all duration-300 animate-in slide-in-from-right-2 flex items-center space-x-3 space-x-reverse"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Mobile User Actions */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-arabic transition-all duration-300 flex items-center space-x-3 space-x-reverse"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">🔐</span>
                  <span>تسجيل الدخول</span>
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-arabic transition-all duration-300 flex items-center space-x-3 space-x-reverse"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">👤</span>
                  <span>إنشاء حساب</span>
                </Link>
                <Link
                  href="/admin"
                  className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-arabic transition-all duration-300 flex items-center space-x-3 space-x-reverse"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">⚙️</span>
                  <span>لوحة التحكم</span>
                </Link>
              </div>

              {/* Mobile Language Switcher */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button className="w-full px-4 py-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-arabic transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse">
                  <span>🌐</span>
                  <span>English</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
