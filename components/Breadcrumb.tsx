'use client'

import { ChevronLeftIcon, HomeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface BreadcrumbItem {
  name: string
  nameAr: string
  href?: string
  isCurrent?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-6">
      <Link href="/" className="flex items-center space-x-1 space-x-reverse hover:text-primary-600 transition-colors">
        <HomeIcon className="h-4 w-4" />
        <span className="font-arabic">الرئيسية</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 space-x-reverse">
          <ChevronLeftIcon className="h-4 w-4 text-gray-400" />
          {item.href && !item.isCurrent ? (
            <Link 
              href={item.href}
              className="hover:text-primary-600 transition-colors font-arabic"
            >
              {item.nameAr}
            </Link>
          ) : (
            <span className={`font-arabic ${item.isCurrent ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
              {item.nameAr}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
