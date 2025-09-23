'use client'

import { useState, useRef } from 'react'
import { CameraIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface PhotoUploadProps {
  onImageProcessed: (imageData: string, extractedText?: string) => void
  onError?: (error: string) => void
  className?: string
}

export default function PhotoUpload({ 
  onImageProcessed, 
  onError, 
  className = '' 
}: PhotoUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setPreviewImage(imageData)
        setIsOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        onError?.('الكاميرا غير مدعومة في هذا المتصفح.')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          onError?.('تم رفض الوصول إلى الكاميرا. يرجى السماح بالوصول إلى الكاميرا في إعدادات المتصفح.')
        } else if (error.name === 'NotFoundError') {
          onError?.('لم يتم العثور على كاميرا. يرجى التأكد من وجود كاميرا متصلة.')
        } else {
          onError?.('لا يمكن الوصول إلى الكاميرا. يرجى التحقق من الصلاحيات.')
        }
      } else {
        onError?.('حدث خطأ غير متوقع أثناء الوصول إلى الكاميرا.')
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        const imageData = canvas.toDataURL('image/jpeg')
        setPreviewImage(imageData)
        stopCamera()
        setIsOpen(true)
      }
    }
  }

  const processImage = async () => {
    if (!previewImage) return

    setIsProcessing(true)
    try {
      // Import Tesseract dynamically to avoid SSR issues
      const Tesseract = (await import('tesseract.js')).default
      
      const { data: { text } } = await Tesseract.recognize(previewImage, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
          }
        }
      })

      // Clean up the extracted text
      const cleanedText = text.replace(/\s+/g, ' ').trim()
      
      onImageProcessed(previewImage, cleanedText)
      setIsOpen(false)
      setPreviewImage(null)
    } catch (error) {
      console.error('OCR Error:', error)
      onError?.('حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsProcessing(false)
    }
  }

  const closeModal = () => {
    setIsOpen(false)
    setPreviewImage(null)
    stopCamera()
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      {/* Upload Button */}
      <button
        onClick={() => {
          console.log('PhotoUpload button clicked!')
          setIsOpen(true)
        }}
        className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${className}`}
        title="رفع صورة أو التقاط صورة"
        style={{ display: 'block', visibility: 'visible' }}
      >
        <PhotoIcon className="h-4 w-4 ml-2" />
        <span className="font-arabic">📷 صورة</span>
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-sm sm:w-96 shadow-lg rounded-md bg-white m-4 sm:m-0 max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 font-arabic">
                  رفع صورة أو التقاط صورة
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {!previewImage && !showCamera && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-600 font-arabic mb-4">
                      اختر طريقة رفع الصورة
                    </p>
                    <div className="flex space-x-4 space-x-reverse">
                      <button
                        onClick={openFileDialog}
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-arabic"
                      >
                        <PhotoIcon className="h-5 w-5 ml-2" />
                        رفع ملف
                      </button>
                      <button
                        onClick={startCamera}
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-arabic"
                      >
                        <CameraIcon className="h-5 w-5 ml-2" />
                        كاميرا
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showCamera && (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-48 sm:h-64 object-cover rounded-lg"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {/* Camera overlay for better mobile experience */}
                    <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none">
                      <div className="absolute top-2 left-2 right-2 h-8 bg-black bg-opacity-50 rounded flex items-center justify-center">
                        <span className="text-white text-sm font-arabic">وجه الكاميرا نحو رقم الشاسيه</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                    <button
                      onClick={capturePhoto}
                      className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 font-arabic text-base"
                    >
                      📸 التقاط صورة
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 font-arabic text-base"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {previewImage && (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 sm:h-64 object-cover rounded-lg"
                    />
                    {/* Preview overlay */}
                    <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none">
                      <div className="absolute bottom-2 left-2 right-2 h-8 bg-black bg-opacity-50 rounded flex items-center justify-center">
                        <span className="text-white text-sm font-arabic">معاينة الصورة</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                    <button
                      onClick={processImage}
                      disabled={isProcessing}
                      className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-arabic text-base"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          جاري المعالجة...
                        </div>
                      ) : (
                        '🔍 معالجة الصورة'
                      )}
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 font-arabic text-base"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
