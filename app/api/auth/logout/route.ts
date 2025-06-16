import { NextRequest, NextResponse } from "next/server"
import { deleteSession } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 Logout request received')
    
    const token = request.cookies.get('auth-token')?.value
    
    if (token) {
      // Delete session from database
      await deleteSession(token)
    }

    const response = NextResponse.json({
      success: true,
      message: "Đăng xuất thành công"
    })

    // Clear the cookie
    response.cookies.delete('auth-token')
    
    console.log('✅ Logout successful')
    
    return response

  } catch (error) {
    console.error("❌ Logout error:", error)
    return NextResponse.json(
      { error: "Đã xảy ra lỗi server" },
      { status: 500 }
    )
  }
}