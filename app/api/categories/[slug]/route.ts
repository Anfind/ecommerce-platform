import { NextRequest, NextResponse } from 'next/server'
import { getCategoryBySlug, getProductsByCategory } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const { slug } = await params
    
    // Get category info
    const category = await getCategoryBySlug(slug)
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }
    
    // Get products in this category
    const options = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
      brands: searchParams.get('brands') ? searchParams.get('brands')!.split(',') : undefined,
      inStockOnly: searchParams.get('inStockOnly') === 'true'
    }
    
    const products = await getProductsByCategory(slug, options)
    
    return NextResponse.json({
      success: true,
      data: {
        category,
        products,
        count: Array.isArray(products) ? products.length : 0
      }
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
