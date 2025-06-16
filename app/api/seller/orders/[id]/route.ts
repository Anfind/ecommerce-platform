import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, note } = await request.json()
    const { id } = await params
    const orderId = id

    // Tạm thời log để debug
    console.log(`Updating order ${orderId} to status ${status}`)
    
    // Trong thực tế, đây sẽ cập nhật database
    // Hiện tại chúng ta sẽ trả về success để tương thích với frontend
    
    const updatedOrder = {
      id: orderId,
      status,
      notes: note,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
