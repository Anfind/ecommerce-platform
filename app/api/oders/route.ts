import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db"; // đường dẫn đến kết nối MySQL của bạn

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      buyer_id,
      seller_id,
      product_name,
      product_code,
      total_price,
      status = "pending", // optional: mặc định là pending
    } = body;

    if (
      !buyer_id ||
      !seller_id ||
      !product_name ||
      !product_code ||
      !total_price
    ) {
      return NextResponse.json(
        { success: false, error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `INSERT INTO orders ( buyer_id, seller_id, product_name, product_code, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [buyer_id, seller_id, product_name, product_code, total_price, status]
    );

    return NextResponse.json({
      success: true,
      message: "Đơn hàng đã được tạo",
      order: result,
    });
  } catch (error) {
    console.error("❌ Lỗi tạo đơn hàng:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi máy chủ" },
      { status: 500 }
    );
  }
}
