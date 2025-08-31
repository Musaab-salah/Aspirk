import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ['arabic'],
  variable: '--font-noto-sans-arabic',
})

export const metadata: Metadata = {
  title: 'Spare Parts - طلب قطع الغيار من الإمارات',
  description: 'اطلب قطع غيار سيارتك  من اي مكان  بكل سهولة وأمان. خدمة موثوقة وسريعة لجميع أنواع السيارات.',
  keywords: 'قطع غيار, سيارات, الإمارات, طلب قطع غيار, spare parts, UAE, car parts',
  authors: [{ name: 'Spare Parts' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} ${notoSansArabic.variable} font-english`}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1 pt-20 lg:pt-24">
            {children}
          </main>
          <Footer />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </div>
      </body>
    </html>
  )
}
