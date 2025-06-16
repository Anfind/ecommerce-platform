import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getUserByEmail, updateLastLogin } from "@/lib/db"
import { generateToken, createSession } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log(`🔐 Attempt login for: ${email}`)

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await getUserByEmail(email)
    if (!user) {
      console.log(`❌ User not found: ${email}`)
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      )
    }

    // Check if user is active
    if (user.status !== 'active') {
      console.log(`❌ User inactive: ${email}, status: ${user.status}`)
      return NextResponse.json(
        { error: "Tài khoản đã bị tạm khóa hoặc chưa được kích hoạt" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      console.log(`❌ Invalid password for: ${email}`)
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Store session in database
    await createSession(user.id, token)

    // Update last login
    await updateLastLogin(user.id)

    // Return user data without password
    const { password_hash, ...userWithoutPassword } = user
    
    console.log(`✅ Login successful for: ${email}`)
    
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token
    })

    // Set HTTP-only cookie for extra security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json(
      { error: "Đã xảy ra lỗi server" },
      { status: 500 }
    )
  }
}