export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'الرئيسية', href: '/', icon: '🏠' },
  ]

  const services = [
    { name: 'قطع غيار أصلية', description: 'جميع قطع الغيار أصلية ومضمونة' },
    { name: 'شحن سريع', description: 'شحن سريع وآمن لجميع المناطق' },
    { name: 'دعم فني 24/7', description: 'دعم فني متاح على مدار الساعة' },
    { name: 'ضمان الجودة', description: 'ضمان استرداد الأموال' },
  ]

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'facebook', color: 'hover:bg-blue-600' },
    { name: 'Instagram', href: '#', icon: 'instagram', color: 'hover:bg-pink-600' },
    { name: 'Twitter', href: '#', icon: 'twitter', color: 'hover:bg-blue-400' },
    { name: 'LinkedIn', href: '#', icon: 'linkedin', color: 'hover:bg-blue-700' },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-secondary-600/5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container-responsive py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <span className="text-white font-bold text-2xl">Σ</span>
              </div>
              <div className="mr-4">
                <h3 className="text-2xl font-bold font-arabic group-hover:text-primary-400 transition-colors duration-300">سيجما بارت</h3>
                <p className="text-gray-400 font-arabic group-hover:text-primary-300 transition-colors duration-300">SigmaPart</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 font-arabic leading-relaxed text-lg">
              خدمة موثوقة وسريعة لطلب قطع غيار السيارات من كل مكان. نضمن لك الجودة والأسعار المنافسة مع خدمة عملاء متميزة على مدار الساعة.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 space-x-reverse mb-6">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className={`w-12 h-12 bg-gray-800 ${social.color} rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                  title={social.name}
                >
                  <svg className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon === 'facebook' && (
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    )}
                    {social.icon === 'instagram' && (
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    )}
                    {social.icon === 'twitter' && (
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    )}
                    {social.icon === 'linkedin' && (
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    )}
                  </svg>
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20">
              <h4 className="text-lg font-semibold mb-3 font-arabic">اشترك في النشرة الإخبارية</h4>
              <p className="text-gray-400 mb-4 font-arabic text-sm">احصل على آخر العروض والتحديثات</p>
              <div className="flex space-x-2 space-x-reverse">
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 font-arabic"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-arabic font-semibold hover:scale-105">
                  اشتراك
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 font-arabic flex items-center">
              <span className="w-2 h-8 bg-primary-600 rounded-full ml-3"></span>
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white font-arabic transition-all duration-300 hover:translate-x-1 inline-flex items-center space-x-2 space-x-reverse group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-6 font-arabic flex items-center">
              <span className="w-2 h-8 bg-success-600 rounded-full ml-3"></span>
              خدماتنا
            </h3>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="group">
                  <h4 className="font-semibold text-gray-200 group-hover:text-white transition-colors duration-300 font-arabic">
                    {service.name}
                  </h4>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-arabic">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 font-arabic flex items-center">
              <span className="w-2 h-8 bg-warning-600 rounded-full ml-3"></span>
              معلومات الاتصال
            </h3>
            <div className="space-y-4 text-gray-300 font-arabic">
              <div className="flex items-start space-x-3 space-x-reverse group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">العنوان</p>
                  <p className="text-sm text-gray-400">الإمارات العربية المتحدة</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 space-x-reverse group">
                <div className="w-8 h-8 bg-gradient-to-br from-success-600 to-success-700 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">الهاتف</p>
                  <p className="text-sm text-gray-400">+971 50 123 4567</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 space-x-reverse group">
                <div className="w-8 h-8 bg-gradient-to-br from-warning-600 to-warning-700 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">البريد الإلكتروني</p>
                  <p className="text-sm text-gray-400">info@sigmapart-uae.ae</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 space-x-reverse group">
                <div className="w-8 h-8 bg-gradient-to-br from-danger-600 to-danger-700 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">ساعات العمل</p>
                  <p className="text-sm text-gray-400">24/7 - خدمة متاحة على مدار الساعة</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 space-x-reverse mb-4 md:mb-0">
              <p className="text-gray-400 text-sm font-arabic">
                © {currentYear} سيجما بارت الإمارات. جميع الحقوق محفوظة.
              </p>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-gray-500 text-xs">تم التطوير بـ</span>
                <span className="text-primary-400 font-semibold text-xs">Next.js</span>
              </div>
            </div>
            <div className="flex space-x-6 space-x-reverse">
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm font-arabic transition-colors duration-300 hover:underline">
                سياسة الخصوصية
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white text-sm font-arabic transition-colors duration-300 hover:underline">
                شروط الاستخدام
              </a>
              <a href="/sitemap" className="text-gray-400 hover:text-white text-sm font-arabic transition-colors duration-300 hover:underline">
                خريطة الموقع
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
