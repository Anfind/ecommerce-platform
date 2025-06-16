import { NextRequest, NextResponse } from "next/server";
import { getSellerProducts, pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// DELETE /api/seller/products/[productId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;

  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id FROM products WHERE id = ?`,
      [productId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Sản phẩm không tồn tại." },
        { status: 404 }
      );
    }

    // Xóa sản phẩm
    await pool.execute(`DELETE FROM products WHERE id = ?`, [productId]);

    return NextResponse.json({
      success: true,
      message: "Sản phẩm đã được xóa thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server khi xóa sản phẩm." },
      { status: 500 }
    );
  }
}
