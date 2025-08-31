import { NextRequest, NextResponse } from 'next/server'

// Mock admin credentials - in production, these should be stored securely in a database
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    // Check credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      return NextResponse.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: {
          username: username,
          role: 'admin'
        }
      })
    } else {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
