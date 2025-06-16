import { NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Bắt đầu khởi tạo database...')
    
    await initializeDatabase()
    
    return NextResponse.json({
      success: true,
      message: "Database đã được khởi tạo thành công!"
    })
    
  } catch (error) {
    console.error('❌ Lỗi khởi tạo database:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Không thể khởi tạo database",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// Also allow GET for easy testing
export async function GET(request: NextRequest) {
  return POST(request)
}