import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import jwt from "jsonwebtoken"

// Get seller's orders from database
export async function GET(request: NextRequest) {
  try {
    // Verify seller authentication
    const token = request.headers.get("authorization")?.replace("Bearer ", "") || 
                  request.cookies.get("auth_token")?.value;
                  
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const sellerId = decoded.userId

    // Get orders for this seller from database
    const [orders] = await pool.execute(`
      SELECT 
        o.*,
        sa.full_name as shipping_full_name,
        sa.phone as shipping_phone,
        sa.email as shipping_email,
        sa.address as shipping_address,
        sa.ward as shipping_ward,
        sa.district as shipping_district,
        sa.city as shipping_city,
        sa.zip_code as shipping_zip_code
      FROM orders o
      LEFT JOIN shipping_addresses sa ON o.id = sa.order_id
      WHERE o.seller_id = ?
      ORDER BY o.created_at DESC
    `, [sellerId])

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      (orders as any[]).map(async (order) => {
        const [items] = await pool.execute(`
          SELECT oi.*, p.slug as product_slug
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `, [order.id])

        return {
          ...order,
          items,
          shippingAddress: {
            fullName: order.shipping_full_name,
            phone: order.shipping_phone,
            email: order.shipping_email,
            address: order.shipping_address,
            ward: order.shipping_ward,
            district: order.shipping_district,
            city: order.shipping_city,
            zipCode: order.shipping_zip_code
          }
        }
      })
    )

    return NextResponse.json(ordersWithItems)
  } catch (error) {
    console.error("Error fetching seller orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update order status
export async function PATCH(request: NextRequest) {
  try {
    // Verify seller authentication
    const token = request.headers.get("authorization")?.replace("Bearer ", "") || 
                  request.cookies.get("auth_token")?.value;
                  
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const sellerId = decoded.userId

    const { orderId, status, notes } = await request.json()

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Verify seller owns this order
    const [orderCheck] = await pool.execute(
      'SELECT seller_id FROM orders WHERE id = ?',
      [orderId]
    )

    if (!Array.isArray(orderCheck) || orderCheck.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if ((orderCheck[0] as any).seller_id !== sellerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Prepare update fields based on status
    let updateFields = ['status = ?', 'updated_at = CURRENT_TIMESTAMP']
    let updateValues = [status]

    switch (status) {
      case 'confirmed':
        updateFields.push('confirmed_at = CURRENT_TIMESTAMP')
        break
      case 'shipped':
        updateFields.push('shipped_at = CURRENT_TIMESTAMP')
        // Generate tracking number if not exists
        const trackingNumber = `VN${Date.now()}`
        updateFields.push('tracking_number = ?')
        updateValues.push(trackingNumber)
        break
      case 'delivered':
        updateFields.push('delivered_at = CURRENT_TIMESTAMP')
        break
      case 'cancelled':
        updateFields.push('cancelled_at = CURRENT_TIMESTAMP')
        if (notes) {
          updateFields.push('cancel_reason = ?')
          updateValues.push(notes)
        }
        break
    }

    updateValues.push(orderId)

    // Update order status
    await pool.execute(
      `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )

    return NextResponse.json({ 
      success: true, 
      message: "Order updated successfully",
      orderId,
      status 
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
