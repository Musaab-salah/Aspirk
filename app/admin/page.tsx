'use client'

import { useState, useEffect } from 'react'
import {
  ShoppingCartIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  CogIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BellIcon,
  EyeIcon,
  PlusIcon,
  ChartBarIcon,
  CalendarIcon,
  GlobeAltIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { DashboardStats, Order, COUNTRIES } from '@/types'
import AdminLogin from '@/components/AdminLogin'

// Mock data - in real app this would come from API
const mockStats: DashboardStats = {
  totalOrders: 156,
  pendingOrders: 23,
  approvedOrders: 89,
  rejectedOrders: 12,
  shippedOrders: 28,
  deliveredOrders: 4,
  totalRevenue: 45600,
  monthlyRevenue: 8900,
  topBrands: [
    { brand: 'تويوتا', count: 45 },
    { brand: 'هيونداي', count: 32 },
    { brand: 'نيسان', count: 28 },
  ],
  topCategories: [
    { category: 'قطع المحرك', count: 67 },
    { category: 'نظام الفرامل', count: 43 },
    { category: 'الأنظمة الكهربائية', count: 38 },
  ],
}

const mockRecentOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerId: '1',
    carId: '1',
    status: 'pending',
    totalAmount: 450,
    shippingCost: 50,
    currency: 'AED',
    shippingMethod: 'air',
    destinationCountry: 'EG',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    customer: {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+971501234567',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    car: {
      id: '1',
      brandId: '1',
      modelId: '1',
      year: 2016,
      brand: { id: '1', name: 'Toyota', nameAr: 'تويوتا' },
      model: { id: '1', brandId: '1', name: 'Corolla', nameAr: 'كورولا', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    },
    items: [],
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerId: '2',
    carId: '2',
    status: 'approved',
    totalAmount: 320,
    shippingCost: 40,
    currency: 'AED',
    shippingMethod: 'land',
    destinationCountry: 'NG',
    createdAt: new Date('2024-01-14T15:45:00'),
    updatedAt: new Date('2024-01-14T16:20:00'),
    customer: {
      id: '2',
      name: 'سارة أحمد',
      email: 'sara@example.com',
      phone: '+971507654321',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    car: {
      id: '2',
      brandId: '2',
      modelId: '4',
      year: 2018,
      brand: { id: '2', name: 'Hyundai', nameAr: 'هيونداي' },
      model: { id: '4', brandId: '2', name: 'Accent', nameAr: 'أكسنت', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    },
    items: [],
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerId: '3',
    carId: '3',
    status: 'shipped',
    totalAmount: 280,
    shippingCost: 150,
    currency: 'AED',
    shippingMethod: 'air',
    destinationCountry: 'KE',
    createdAt: new Date('2024-01-13T09:15:00'),
    updatedAt: new Date('2024-01-14T11:30:00'),
    customer: {
      id: '3',
      name: 'محمد علي',
      email: 'mohamed@example.com',
      phone: '+971509876543',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    car: {
      id: '3',
      brandId: '3',
      modelId: '7',
      year: 2019,
      brand: { id: '3', name: 'Nissan', nameAr: 'نيسان' },
      model: { id: '7', brandId: '3', name: 'Altima', nameAr: 'ألتيما', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    },
    items: [],
  },
]

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [adminUsername, setAdminUsername] = useState<string>('')
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [recentOrders, setRecentOrders] = useState<Order[]>(mockRecentOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated')
    const savedUsername = localStorage.getItem('adminUsername')
    if (authStatus === 'true' && savedUsername) {
      setIsAuthenticated(true)
      setAdminUsername(savedUsername)
    }
  }, [])

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.account-menu-container')) {
        setIsAccountMenuOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false)
      }
    }

    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isAccountMenuOpen])

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true)
    setError(undefined)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsAuthenticated(true)
        setAdminUsername(username)
        localStorage.setItem('adminAuthenticated', 'true')
        localStorage.setItem('adminUsername', username)
      } else {
        setError(data.error || 'فشل في تسجيل الدخول')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('خطأ في الاتصال بالخادم')
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminUsername('')
    setIsAccountMenuOpen(false)
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminUsername')
  }

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen)
  }

  const handleAccountAction = (action: string) => {
    switch (action) {
      case 'profile':
        // Navigate to profile page or open profile modal
        console.log('Navigate to profile page')
        break
      case 'settings':
        // Navigate to settings page or open settings modal
        console.log('Navigate to settings page')
        break
      case 'security':
        // Navigate to security page or open security modal
        console.log('Navigate to security page')
        break
      case 'help':
        // Navigate to help page or open help modal
        console.log('Navigate to help page')
        break
      case 'logout':
        handleLogout()
        break
      default:
        break
    }
    setIsAccountMenuOpen(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-warning-600" />
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-success-600" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-danger-600" />
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-primary-600" />
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-success-600" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في انتظار المراجعة'
      case 'approved':
        return 'تمت الموافقة'
      case 'rejected':
        return 'مرفوض'
      case 'shipped':
        return 'تم الشحن'
      case 'delivered':
        return 'تم التسليم'
      default:
        return 'غير محدد'
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending'
      case 'approved':
        return 'status-approved'
      case 'rejected':
        return 'status-rejected'
      case 'shipped':
        return 'status-shipped'
      case 'delivered':
        return 'status-delivered'
      default:
        return 'status-pending'
    }
  }

  const filteredOrders = recentOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLogin={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    )
  }

  // Show dashboard if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm font-english">أ</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 font-arabic tracking-wide">
                لوحة التحكم الإدارية
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-all duration-300 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-danger-600 to-danger-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse font-english">
                  3
                </span>
              </button>
              
              {/* Account Menu */}
              <div className="relative account-menu-container">
                <button
                  onClick={toggleAccountMenu}
                  className="flex items-center space-x-3 space-x-reverse p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 group"
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm font-english">{adminUsername.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-700 font-arabic font-medium text-sm block">
                      {adminUsername}
                    </span>
                    <span className="text-gray-500 font-arabic text-xs block">
                      مدير النظام
                    </span>
                  </div>
                  <ChevronDownIcon 
                    className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                      isAccountMenuOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Account Dropdown Menu */}
                {isAccountMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-base font-english">{adminUsername.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-arabic font-semibold text-sm">
                            {adminUsername}
                          </p>
                          <p className="text-gray-500 font-arabic text-xs">
                            {adminUsername}@admin.com
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => handleAccountAction('profile')}
                        className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-right hover:bg-gray-50 transition-colors duration-200 group"
                      >
                        <UserCircleIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" />
                        <span className="text-gray-700 font-arabic text-sm group-hover:text-gray-900 transition-colors duration-200">
                          الملف الشخصي
                        </span>
                      </button>

                      <button
                        onClick={() => handleAccountAction('settings')}
                        className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-right hover:bg-gray-50 transition-colors duration-200 group"
                      >
                        <Cog6ToothIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" />
                        <span className="text-gray-700 font-arabic text-sm group-hover:text-gray-900 transition-colors duration-200">
                          الإعدادات
                        </span>
                      </button>

                      <button
                        onClick={() => handleAccountAction('security')}
                        className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-right hover:bg-gray-50 transition-colors duration-200 group"
                      >
                        <ShieldCheckIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" />
                        <span className="text-gray-700 font-arabic text-sm group-hover:text-gray-900 transition-colors duration-200">
                          الأمان
                        </span>
                      </button>

                      <button
                        onClick={() => handleAccountAction('help')}
                        className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-right hover:bg-gray-50 transition-colors duration-200 group"
                      >
                        <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" />
                        <span className="text-gray-700 font-arabic text-sm group-hover:text-gray-900 transition-colors duration-200">
                          المساعدة
                        </span>
                      </button>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={() => handleAccountAction('logout')}
                        className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-right hover:bg-red-50 transition-colors duration-200 group"
                      >
                        <XCircleIcon className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors duration-200" />
                        <span className="text-gray-700 font-arabic text-sm group-hover:text-red-600 transition-colors duration-200">
                          تسجيل الخروج
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold font-arabic mb-3 animate-in fade-in duration-1000 leading-tight">
                مرحباً بك، {adminUsername} 👋
              </h2>
              <p className="text-primary-100 font-arabic text-lg animate-in fade-in duration-1000 animation-delay-300 leading-relaxed">
                نظرة شاملة على أداء النظام والإحصائيات المحدثة
              </p>
            </div>
            <div className="mt-4 lg:mt-0 animate-in fade-in duration-1000 animation-delay-500">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-sm font-arabic text-primary-100">آخر تحديث</p>
                <p className="font-bold font-english">{new Date().toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group animate-in fade-in duration-1000">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic mb-2 leading-relaxed">إجمالي الطلبات</p>
                <p className="text-3xl font-bold text-gray-900 font-english">{stats.totalOrders.toLocaleString()}</p>
                <div className="flex items-center mt-3">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-success-600 ml-2" />
                  <span className="text-success-700 text-sm font-arabic font-medium">+12%</span>
                  <span className="text-gray-500 text-sm font-arabic mr-2">مقارنة بالشهر السابق</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <ShoppingCartIcon className="h-8 w-8 text-primary-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group animate-in fade-in duration-1000 animation-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic mb-2 leading-relaxed">طلبات بانتظار المراجعة</p>
                <p className="text-3xl font-bold text-gray-900 font-english">{stats.pendingOrders}</p>
                <div className="flex items-center mt-3">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-warning-600 ml-2" />
                  <span className="text-warning-700 text-sm font-arabic font-medium">-5%</span>
                  <span className="text-gray-500 text-sm font-arabic mr-2">مقارنة بالأمس</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-warning-100 to-warning-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <ClockIcon className="h-8 w-8 text-warning-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group animate-in fade-in duration-1000 animation-delay-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic mb-2 leading-relaxed">العملاء النشطين</p>
                <p className="text-3xl font-bold text-gray-900 font-english">89</p>
                <div className="flex items-center mt-3">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-success-600 ml-2" />
                  <span className="text-success-700 text-sm font-arabic font-medium">+8%</span>
                  <span className="text-gray-500 text-sm font-arabic mr-2">مقارنة بالأسبوع السابق</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-success-100 to-success-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <UsersIcon className="h-8 w-8 text-success-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group animate-in fade-in duration-1000 animation-delay-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic mb-2 leading-relaxed">الإيرادات الشهرية</p>
                <p className="text-3xl font-bold text-gray-900 font-english">{stats.monthlyRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-3">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-success-600 ml-2" />
                  <span className="text-success-700 text-sm font-arabic font-medium">+15%</span>
                  <span className="text-gray-500 text-sm font-arabic mr-2">درهم إماراتي</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <CurrencyDollarIcon className="h-8 w-8 text-green-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 animate-in fade-in duration-1000 animation-delay-800">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-900 font-arabic tracking-wide">
                    الطلبات الحديثة
                  </h2>
                </div>
                
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="البحث في الطلبات..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-4 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic transition-all duration-300 text-sm"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-arabic transition-all duration-300 text-sm"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="pending">في انتظار المراجعة</option>
                    <option value="approved">تمت الموافقة</option>
                    <option value="rejected">مرفوض</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التسليم</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredOrders.map((order, index) => (
                  <div key={order.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 border border-gray-200 animate-in fade-in duration-1000" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 font-arabic text-base">
                            {order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-600 font-arabic mt-1">
                            {order.customer.name}
                          </p>
                          <p className="text-xs text-gray-500 font-arabic mt-1">
                            {order.car.brand.nameAr} {order.car.model.nameAr} {order.car.year}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg font-english">
                          {order.totalAmount.toLocaleString()} {order.currency}
                        </p>
                        <div className="flex flex-col items-end space-y-2 mt-2">
                          <span className={`inline-block px-3 py-1.5 text-xs rounded-full font-arabic font-medium ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <div className="text-xs text-gray-500 font-arabic">
                            <span className="ml-2">
                              {order.shippingMethod === 'air' ? 'شحن جوي' : 'شحن بري'}
                            </span>
                            <span>
                              {COUNTRIES.find(c => c.code === order.destinationCountry)?.nameAr}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-2 space-x-reverse mt-4 pt-4 border-t border-gray-200">
                      <button
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        title="عرض التفاصيل"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button
                            className="p-2 text-success-600 hover:text-success-700 hover:bg-success-50 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2"
                            title="موافقة"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
                            title="رفض"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {order.status === 'approved' && (
                        <button
                          className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                          title="شحن"
                        >
                          <TruckIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <a 
                  href="/admin/orders" 
                  className="text-primary-600 hover:text-primary-700 font-medium font-arabic transition-all duration-300 hover:underline inline-flex items-center space-x-2 space-x-reverse group text-sm"
                >
                  <span>عرض جميع الطلبات</span>
                  <PlusIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-6">
            {/* Top Brands */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-in fade-in duration-1000 animation-delay-1000">
              <div className="flex items-center mb-4">
                <div className="w-2 h-8 bg-primary-600 rounded-full ml-3"></div>
                <h3 className="text-lg font-semibold text-gray-900 font-arabic tracking-wide">
                  الماركات الأكثر طلباً
                </h3>
              </div>
              <div className="space-y-3">
                {stats.topBrands.map((brand, index) => (
                  <div key={brand.brand} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 animate-in fade-in duration-1000" style={{ animationDelay: `${(index + 1) * 200}ms` }}>
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold ml-3 font-english">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 font-arabic font-medium text-sm">
                        {brand.brand}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-primary-600 bg-primary-100 px-3 py-1 rounded-full font-arabic">
                      {brand.count} طلب
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-in fade-in duration-1000 animation-delay-1200">
              <div className="flex items-center mb-4">
                <div className="w-2 h-8 bg-success-600 rounded-full ml-3"></div>
                <h3 className="text-lg font-semibold text-gray-900 font-arabic tracking-wide">
                  فئات قطع الغيار الأكثر طلباً
                </h3>
              </div>
              <div className="space-y-3">
                {stats.topCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 animate-in fade-in duration-1000" style={{ animationDelay: `${(index + 1) * 200}ms` }}>
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center text-xs font-bold ml-3 font-english">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 font-arabic font-medium text-sm">
                        {category.category}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-success-600 bg-success-100 px-3 py-1 rounded-full font-arabic">
                      {category.count} قطعة
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white animate-in fade-in duration-1000 animation-delay-1400">
              <h3 className="text-lg font-semibold font-arabic mb-4 flex items-center tracking-wide">
                <ChartBarIcon className="h-5 w-5 ml-2" />
                إحصائيات سريعة
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-arabic text-sm">الطلبات اليوم</span>
                  <span className="font-bold font-english">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-arabic text-sm">الإيرادات اليوم</span>
                  <span className="font-bold font-english">3,450 AED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-arabic text-sm">العملاء الجدد</span>
                  <span className="font-bold font-english">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-in fade-in duration-1000 animation-delay-1600">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-arabic flex items-center tracking-wide">
            <CogIcon className="h-6 w-6 ml-3" />
            الإجراءات السريعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="p-6 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-primary-300 transition-all duration-300 text-right group hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl group-hover:scale-110 transition-transform duration-300 ml-4">
                  <ShoppingCartIcon className="h-8 w-8 text-primary-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 font-arabic text-lg leading-tight">مراجعة الطلبات الجديدة</p>
                  <p className="text-sm text-gray-600 font-arabic mt-1 leading-relaxed">{stats.pendingOrders} طلب بانتظار المراجعة</p>
                </div>
              </div>
            </button>

            <button className="p-6 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-success-300 transition-all duration-300 text-right group hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-success-100 to-success-200 rounded-xl group-hover:scale-110 transition-transform duration-300 ml-4">
                  <UsersIcon className="h-8 w-8 text-success-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 font-arabic text-lg leading-tight">إدارة العملاء</p>
                  <p className="text-sm text-gray-600 font-arabic mt-1 leading-relaxed">عرض وتعديل بيانات العملاء</p>
                </div>
              </div>
            </button>

            <button className="p-6 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-warning-300 transition-all duration-300 text-right group hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-warning-500 focus:ring-offset-2">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-warning-100 to-warning-200 rounded-xl group-hover:scale-110 transition-transform duration-300 ml-4">
                  <GlobeAltIcon className="h-8 w-8 text-warning-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 font-arabic text-lg leading-tight">إدارة قطع الغيار</p>
                  <p className="text-sm text-gray-600 font-arabic mt-1 leading-relaxed">إضافة وتعديل قطع الغيار</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

