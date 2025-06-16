import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getUserByEmail, createUser } from "@/lib/db"
import { generateToken, createSession } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = 'buyer', storeName } = await request.json()
    
    console.log(`📝 Attempt register for: ${email}, role: ${role}`)

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tên, email và mật khẩu là bắt buộc" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      )
    }

    if (role === 'seller' && !storeName) {
      return NextResponse.json(
        { error: "Tên cửa hàng là bắt buộc cho người bán" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      console.log(`❌ User already exists: ${email}`)
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const result = await createUser({
      name,
      email,
      password_hash: passwordHash,
      role: role as 'admin' | 'seller' | 'buyer',
      store_name: role === 'seller' ? storeName : undefined
    })

    // Get the created user
    const newUser = await getUserByEmail(email)
    if (!newUser) {
      throw new Error("Failed to retrieve created user")
    }

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    })

    // Store session in database
    await createSession(newUser.id, token)

    // Return user data without password
    const { password_hash, ...userWithoutPassword } = newUser
    
    console.log(`✅ Registration successful for: ${email}`)

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error("❌ Registration error:", error)
    return NextResponse.json(
      { error: "Đã xảy ra lỗi server" },
      { status: 500 }
    )
  }
}