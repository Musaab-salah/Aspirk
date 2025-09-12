import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Configuration
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const UPLOAD_DIR = join(process.cwd(), 'public', 'storage', 'spare_parts')

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

// Generate unique filename
function generateFilename(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${timestamp}_${randomString}.${extension}`
}

// Validate file
function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'حجم الملف كبير جداً. الحد الأقصى 2 ميجابايت'
    }
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'نوع الملف غير مدعوم. الأنواع المسموحة: JPG, JPEG, PNG, WEBP'
    }
  }

  return { isValid: true }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'لم يتم اختيار ملف' },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateFile(file)
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Generate unique filename
    const filename = generateFilename(file.name)
    const filepath = join(UPLOAD_DIR, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return the relative path for storage in database
    const relativePath = `/storage/spare_parts/${filename}`

    return NextResponse.json({
      success: true,
      data: {
        filename,
        path: relativePath,
        size: file.size,
        type: file.type
      },
      message: 'تم رفع الصورة بنجاح'
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء رفع الملف' },
      { status: 500 }
    )
  }
}

// Handle DELETE request to remove uploaded files
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'اسم الملف مطلوب' },
        { status: 400 }
      )
    }

    const filepath = join(UPLOAD_DIR, filename)
    
    // Check if file exists and delete it
    if (existsSync(filepath)) {
      const { unlink } = await import('fs/promises')
      await unlink(filepath)
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف الملف بنجاح'
    })

  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حذف الملف' },
      { status: 500 }
    )
  }
}
