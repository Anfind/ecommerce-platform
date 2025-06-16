import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const options = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') as any || undefined,
      priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
      inStockOnly: searchParams.get('inStockOnly') === 'true',
      featured: searchParams.get('featured') === 'true'
    }
    
    const products = await getAllProducts(options)
    
    return NextResponse.json({
      success: true,
      data: products,
      count: Array.isArray(products) ? products.length : 0
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
