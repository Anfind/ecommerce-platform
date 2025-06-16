import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapProductData1(input: any) {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    price: Number(input.price),
    rating: Number(input.rating_average),
    reviews: input.rating_count,
    image: input.primary_image,
    category: input.category_id,
    seller: input.store_name || input.seller_name,
    inStock: input.stock_quantity > 0,
  };
}

export function mapProductData(rawProduct: any) {
  if (!rawProduct) {
    return;
  }

  return {
    id: rawProduct.id,
    name: rawProduct.name,
    description: rawProduct.description,
    longDescription: rawProduct.long_description,
    price: Number(rawProduct.price),
    originalPrice: Number(rawProduct.original_price),
    rating: parseFloat(rawProduct.rating_average),
    reviewCount: rawProduct.rating_count,
    images: rawProduct.images.map((img: any) => img.image_url),
    category: rawProduct.category.name || "Unknown",
    category_id: rawProduct.category.id || "unknown-category-id",
    slug: rawProduct.category.slug || "unknown-category",
    brand: rawProduct.brand,
    sku: rawProduct.sku,
    inStock: rawProduct.stock_quantity > 0,
    stockCount: rawProduct.stock_quantity,
    seller: {
      id: rawProduct.seller.id,
      name: rawProduct.seller.name,
      rating: 4.8, // giả định hoặc có thể bổ sung thêm từ API khác
      totalSales: rawProduct.sales_count,
      responseTime: "< 1 hour", // hardcoded nếu không có dữ liệu
      avatar: "/placeholder.svg?height=50&width=50", // default avatar
    },
    specifications: {}, // sẽ cập nhật tiếp ở dưới nếu có attributes
    features: [], // có thể tự generate nếu cần
    shipping: {
      free: true, // mặc định miễn phí
      estimatedDays: "2-4 ngày làm việc", // bạn có thể điều chỉnh
      returnPolicy: "Đổi trả trong 7 ngày",
    },
  };
}
