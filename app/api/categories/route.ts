import { NextRequest, NextResponse } from 'next/server'
import { getAllCategories, getCategoryTree } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tree = searchParams.get('tree') === 'true'
    
    let categories
    if (tree) {
      categories = await getCategoryTree()
    } else {
      categories = await getAllCategories()
    }
    
    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
