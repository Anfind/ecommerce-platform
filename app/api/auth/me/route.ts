import { NextRequest, NextResponse } from "next/server"
import { verifyToken, validateSession } from "@/lib/jwt"
import { getUserById } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log('👤 Getting current user info')
    
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: "Token không tồn tại" },
        { status: 401 }
      )
    }

    // Verify JWT token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: "Token không hợp lệ" },
        { status: 401 }
      )
    }

    // Validate session in database
    const isValidSession = await validateSession(token)
    if (!isValidSession) {
      return NextResponse.json(
        { error: "Session đã hết hạn" },
        { status: 401 }
      )
    }

    // Get current user data from database
    const user = await getUserById(payload.userId)
    if (!user) {
      return NextResponse.json(
        { error: "Người dùng không tồn tại" },
        { status: 404 }
      )
    }

    // Check if user is still active
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: "Tài khoản đã bị tạm khóa" },
        { status: 401 }
      )
    }

    // Return user data without password
    const { password_hash, ...userWithoutPassword } = user
    
    console.log(`✅ User info retrieved for: ${user.email}`)
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error("❌ Me endpoint error:", error)
    return NextResponse.json(
      { error: "Đã xảy ra lỗi server" },
      { status: 500 }
    )
  }
}