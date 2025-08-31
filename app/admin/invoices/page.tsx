'use client'

import { DocumentTextIcon } from '@heroicons/react/24/outline'

export default function AdminInvoicesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-arabic">
          إدارة الفواتير
        </h1>
        <p className="text-gray-600 font-arabic">
          إدارة وإنشاء فواتير الطلبات
        </p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 font-arabic">قريباً</h3>
        <p className="mt-1 text-sm text-gray-500 font-arabic">
          صفحة إدارة الفواتير قيد التطوير
        </p>
      </div>
    </div>
  )
}
