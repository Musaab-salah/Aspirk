'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ShoppingCartIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
  DocumentTextIcon,
  TruckIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'لوحة التحكم', href: '/admin', icon: HomeIcon },
  { name: 'الطلبات', href: '/admin/orders', icon: ShoppingCartIcon },
  { name: 'العملاء', href: '/admin/customers', icon: UsersIcon },
  { name: 'قطع الغيار', href: '/admin/spare-parts', icon: CogIcon },
  { name: 'الموردين', href: '/admin/suppliers', icon: TruckIcon },
  { name: 'التقارير', href: '/admin/reports', icon: ChartBarIcon },
  { name: 'الفاتورات', href: '/admin/invoices', icon: DocumentTextIcon },
  { name: 'الإعدادات', href: '/admin/settings', icon: CogIcon },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminUsername, setAdminUsername] = useState<string>('')
  const pathname = usePathname()

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated')
    const savedUsername = localStorage.getItem('adminUsername')
    if (authStatus === 'true' && savedUsername) {
      setAdminUsername(savedUsername)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminUsername')
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">أ</span>
            </div>
            <h1 className="mr-3 text-lg font-semibold text-gray-900 font-arabic">
              لوحة الإدارة
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="ml-3 h-5 w-5" />
                  <span className="font-arabic">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pr-64">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Notifications */}
              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <div className="flex items-center space-x-2 space-x-reverse text-gray-700 hover:text-gray-900">
                  <UserCircleIcon className="h-8 w-8" />
                  <div className="text-right">
                    <span className="font-arabic text-sm font-medium">{adminUsername || 'المدير'}</span>
                    <button
                      onClick={handleLogout}
                      className="block text-xs text-red-600 hover:text-red-700 font-arabic"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
