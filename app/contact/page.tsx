'use client'

import { useState } from 'react'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In real app, this would be an API call
      console.log('Submitting contact form:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-arabic">
            اتصل بنا
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-arabic">
            نحن هنا لمساعدتك في جميع استفساراتك حول قطع الغيار والطلبات
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-arabic">
              معلومات الاتصال
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <PhoneIcon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 font-arabic">الهاتف</h3>
                  <p className="text-gray-600 font-arabic">+971 50 123 4567</p>
                  <p className="text-gray-600 font-arabic">+971 4 123 4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                    <EnvelopeIcon className="h-5 w-5 text-success-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 font-arabic">البريد الإلكتروني</h3>
                  <p className="text-gray-600 font-arabic">info@spareparts-uae.ae</p>
                  <p className="text-gray-600 font-arabic">support@spareparts-uae.ae</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                    <MapPinIcon className="h-5 w-5 text-warning-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 font-arabic">العنوان</h3>
                  <p className="text-gray-600 font-arabic">
                    شارع الشيخ زايد، برج الإمارات<br />
                    السودان
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-danger-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 font-arabic">ساعات العمل</h3>
                  <p className="text-gray-600 font-arabic">الأحد - الخميس: 8:00 ص - 6:00 م</p>
                  <p className="text-gray-600 font-arabic">الجمعة - السبت: 9:00 ص - 4:00 م</p>
                  <p className="text-gray-600 font-arabic">خدمة العملاء: 24/7</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-3 font-arabic">
                تواصل معنا عبر واتساب
              </h3>
              <p className="text-green-700 mb-4 font-arabic">
                للحصول على رد سريع، يمكنك التواصل معنا مباشرة عبر واتساب
              </p>
              <a
                href="https://wa.me/971501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-arabic"
              >
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                تواصل عبر واتساب
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-arabic">
              أرسل لنا رسالة
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="form-input font-arabic"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="form-input font-arabic"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="form-input font-arabic"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  الموضوع *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="form-select font-arabic"
                >
                  <option value="">اختر الموضوع</option>
                  <option value="general">استفسار عام</option>
                  <option value="order">استفسار عن طلب</option>
                  <option value="parts">استفسار عن قطع الغيار</option>
                  <option value="shipping">استفسار عن الشحن</option>
                  <option value="payment">استفسار عن الدفع</option>
                  <option value="complaint">شكوى</option>
                  <option value="suggestion">اقتراح</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">
                  الرسالة *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={6}
                  className="form-input font-arabic"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors font-arabic ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center font-arabic">
            الأسئلة الشائعة
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-arabic">
                كم تستغرق مدة الشحن؟
              </h3>
              <p className="text-gray-600 font-arabic">
                عادة ما تستغرق مدة الشحن من 3-7 أيام عمل داخل الإمارات، وقد تصل إلى 10-14 يوم للدول المجاورة.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-arabic">
                هل قطع الغيار أصلية؟
              </h3>
              <p className="text-gray-600 font-arabic">
                نعم، جميع قطع الغيار التي نقدمها أصلية ومضمونة الجودة من الشركات المصنعة المعتمدة.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-arabic">
                كيف يمكنني تتبع طلبي؟
              </h3>
              <p className="text-gray-600 font-arabic">
                يمكنك تتبع طلبك من خلال حسابك الشخصي أو التواصل معنا عبر الهاتف أو البريد الإلكتروني.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-arabic">
                ما هي طرق الدفع المتاحة؟
              </h3>
              <p className="text-gray-600 font-arabic">
                نقبل جميع البطاقات الائتمانية، التحويل البنكي، والدفع عند الاستلام في بعض المناطق.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
