import { NextRequest, NextResponse } from "next/server";
import { getSellerProducts, pool } from "@/lib/db";
import jwt from "jsonwebtoken";
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

// Helper to get seller ID from JWT token
async function getSellerIdFromToken(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // For now, use a hardcoded seller ID (you can implement proper auth later)
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId") || null;

    if (!sellerId) {
      // Get seller from token in production
      // For demo, use the seller from our sample data
      const [sellers] = await pool.execute(
        'SELECT id FROM users WHERE role = "seller" LIMIT 1'
      );
      if (!Array.isArray(sellers) || sellers.length === 0) {
        return NextResponse.json({ error: "No seller found" }, { status: 404 });
      }
      const defaultSellerId = (sellers[0] as any).id;

      const options = {
        limit: searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : undefined,
        offset: searchParams.get("offset")
          ? parseInt(searchParams.get("offset")!)
          : undefined,
        status: searchParams.get("status") || undefined,
      };

      const products = await getSellerProducts(defaultSellerId, options);

      // Transform to match the expected format
      const transformedProducts = (products as any[]).map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock_quantity,
        categoryId: product.category_id,
        category: { name: product.category_name },
        image: product.primary_image || "/placeholder.svg",
        sellerId: product.seller_id,
        _count: {
          orderItems: product.sales_count || 0,
        },
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      }));

      return NextResponse.json(transformedProducts);
    }

    const options = {
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset")!)
        : undefined,
      status: searchParams.get("status") || undefined,
    };

    const products = await getSellerProducts(sellerId, options);

    // Transform to match the expected format
    const transformedProducts = (products as any[]).map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock_quantity,
      categoryId: product.category_id,
      category: { name: product.category_name },
      image: product.primary_image || "/placeholder.svg",
      sellerId: product.seller_id,
      _count: {
        orderItems: product.sales_count || 0,
      },
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("API POST /api/seller/products called");
  try {
    const data = await request.json();
    console.log("Received data:", data);

    // Validate required fields
    if (!data.name || !data.price || data.stock === undefined) {
      console.log("Validation failed - missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: name, price, stock" },
        { status: 400 }
      );
    }

    // For demo purposes, use the first seller ID
    const [sellers] = await pool.execute(
      'SELECT id FROM users WHERE role = "seller" LIMIT 1'
    );
    if (!Array.isArray(sellers) || sellers.length === 0) {
      return NextResponse.json({ error: "No seller found" }, { status: 404 });
    }
    const sellerId = (sellers[0] as any).id;

    // Get category ID from category name
    const [categories] = await pool.execute(
      "SELECT id FROM categories WHERE name = ? LIMIT 1",
      [data.category || "Điện Tử"]
    );
    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    const categoryId = (categories[0] as any).id;

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Generate a UUID for the new product
    const crypto = require("crypto");
    const productId = crypto.randomUUID();

    // Insert new product with explicit UUID
    const [result] = await pool.execute(
      `
      INSERT INTO products (id, name, slug, description, price, stock_quantity, category_id, seller_id, brand, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        productId,
        data.name,
        `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
        data.description || "",
        data.price,
        data.stock,
        categoryId,
        sellerId,
        data.brand || "Unknown",
        "approved", // Changed to approved for immediate visibility
      ]
    );

    console.log("Insert result:", result);

    // Add product image if provided
    if (data.image) {
      await pool.execute(
        `
        INSERT INTO product_images (product_id, image_url, is_primary) 
        VALUES (?, ?, ?)
      `,
        [productId, data.image, true]
      );
    }

    // Return the created product in expected format
    const newProduct = {
      id: productId,
      name: data.name,
      description: data.description || "",
      price: data.price,
      stock: data.stock,
      categoryId: categoryId,
      category: { name: data.category || "Điện Tử" },
      image: data.image || "/placeholder.svg",
      sellerId: sellerId,
      _count: {
        orderItems: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Created new product:", newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
