'use client'

import UserRequestForm from '@/components/UserRequestForm'

export default function NewRequestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-arabic">
              إنشاء طلب جديد
            </h1>
            <p className="text-gray-600 font-arabic">
              قم بإنشاء طلب جديد لقطع الغيار مع تحديد معلومات الشحن
            </p>
          </div>

          <UserRequestForm />
        </div>
      </div>
    </div>
  )
}
