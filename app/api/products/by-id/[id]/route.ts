import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log(`Received request for product ID: ${id}`);

  try {
    // Lấy thông tin sản phẩm chính
    const [productRows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM products WHERE id = ?`,
      [id]
    );

    if (productRows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const product = productRows[0];

    // Lấy ảnh sản phẩm
    const [imagesRows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM product_images WHERE product_id = ?`,
      [id]
    );

    // Lấy đánh giá sản phẩm
    const [reviewsRows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM product_reviews WHERE product_id = ?`,
      [id]
    );

    // Lấy thuộc tính sản phẩm
    const [attributesRows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM product_attributes WHERE product_id = ?`,
      [id]
    );

    const [sellerRows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name, email, store_name FROM users WHERE id = ? AND role = 'seller'`,
      [product.seller_id]
    );

    const seller = sellerRows.length > 0 ? sellerRows[0] : null;
    const [categoryRows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name, slug FROM categories WHERE id = ?`,
      [product.category_id]
    );

    const category = categoryRows.length > 0 ? categoryRows[0] : null;

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images: imagesRows,
        reviews: reviewsRows,
        attributes: attributesRows,
        seller,
        category,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo ID:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
