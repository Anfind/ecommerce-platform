"use client";

import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  Plus,
  Minus,
  Store,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { mapProductData } from "@/lib/utils";

const mapId = {
  "iphone-15-pro": 1,
  "samsung-galaxy-s24-ultra": 2,
  "macbook-air-m3": 3,
  "sony-wh-1000xm5": 4,
  "apple-watch-series-9": 5,
  "samsung-galaxy-watch6": 6,
  "sony-xperia-1v": 7,
};

// Mock data for product details with real images
const mockProducts = {
  1: {
    id: 1,
    name: "iPhone 15 Pro Max",
    description:
      "Điện thoại thông minh cao cấp với chip A17 Pro, camera 48MP và thiết kế titan sang trọng. Trải nghiệm công nghệ đỉnh cao từ Apple.",
    longDescription:
      "iPhone 15 Pro Max mang đến trải nghiệm smartphone đỉnh cao với chip A17 Pro được sản xuất trên tiến trình 3nm tiên tiến nhất. Camera chính 48MP với khả năng zoom quang học 5x, quay video 4K ProRes và chế độ Action Mode cải tiến. Thiết kế khung titan cực kỳ bền bỉ và nhẹ, màn hình Super Retina XDR 6.7 inch với Dynamic Island. Hỗ trợ sạc nhanh USB-C và MagSafe.",
    price: 29990000,
    originalPrice: 32990000,
    rating: 4.8,
    reviewCount: 256,
    images: [
      "/images/iphone-15-pro.jpg",
      "/images/iphone-15-pro.jpg",
      "/images/iphone-15-pro.jpg",
      "/images/iphone-15-pro.jpg",
    ],
    category: "Electronics",
    brand: "Apple",
    sku: "IP15PM-256GB",
    inStock: true,
    stockCount: 25,
    seller: {
      id: "seller1",
      name: "Apple Store VN",
      rating: 4.9,
      totalSales: 2500,
      responseTime: "< 1 hour",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    specifications: {
      "Màn hình": "6.7 inch Super Retina XDR",
      Chip: "A17 Pro",
      Camera: "48MP + 12MP + 12MP",
      "Bộ nhớ": "256GB",
      Pin: "4441 mAh",
      "Hệ điều hành": "iOS 17",
      "Kết nối": "5G, WiFi 6E, Bluetooth 5.3",
      "Bảo hành": "12 tháng",
    },
    features: [
      "Chip A17 Pro 3nm",
      "Camera 48MP với zoom 5x",
      "Khung titan cao cấp",
      "Dynamic Island",
      "USB-C",
      "MagSafe",
    ],
    shipping: {
      free: true,
      estimatedDays: "1-2 ngày làm việc",
      returnPolicy: "Đổi trả trong 30 ngày",
    },
  },
  2: {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    description:
      "Flagship Android với S Pen tích hợp, camera 200MP và AI thông minh. Hiệu năng mạnh mẽ cho mọi tác vụ.",
    longDescription:
      "Galaxy S24 Ultra là đỉnh cao của công nghệ Samsung với camera chính 200MP, zoom quang học 10x và AI photography tiên tiến. S Pen tích hợp với độ trễ cực thấp, màn hình Dynamic AMOLED 2X 6.8 inch với độ sáng 2600 nits. Chip Snapdragon 8 Gen 3 for Galaxy được tối ưu riêng, RAM 12GB và bộ nhớ 256GB. Pin 5000mAh với sạc nhanh 45W.",
    price: 26990000,
    rating: 4.7,
    reviewCount: 189,
    images: [
      "/images/samsung-s24.jpg",
      "/images/samsung-s24.jpg",
      "/images/samsung-s24.jpg",
      "/images/samsung-s24.jpg",
    ],
    category: "Electronics",
    brand: "Samsung",
    sku: "SM-S928B",
    inStock: true,
    stockCount: 18,
    seller: {
      id: "seller2",
      name: "Samsung Official Store",
      rating: 4.8,
      totalSales: 1800,
      responseTime: "< 2 hours",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    specifications: {
      "Màn hình": "6.8 inch Dynamic AMOLED 2X",
      Chip: "Snapdragon 8 Gen 3",
      Camera: "200MP + 50MP + 12MP + 10MP",
      RAM: "12GB",
      "Bộ nhớ": "256GB",
      Pin: "5000 mAh",
      "Hệ điều hành": "Android 14, One UI 6.1",
      "Bảo hành": "12 tháng",
    },
    features: [
      "Camera 200MP với AI",
      "S Pen tích hợp",
      "Zoom quang học 10x",
      "Snapdragon 8 Gen 3",
      "Sạc nhanh 45W",
      "Chống nước IP68",
    ],
    shipping: {
      free: true,
      estimatedDays: "1-2 ngày làm việc",
      returnPolicy: "Đổi trả trong 30 ngày",
    },
  },
  // Add more products as needed
};

const mockReviews = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2024-03-15",
    title: "Sản phẩm tuyệt vời!",
    comment:
      "Chất lượng vượt mong đợi. Camera rất sắc nét, pin trâu và hiệu năng mượt mà. Đóng gói cẩn thận, giao hàng nhanh.",
    helpful: 12,
    verified: true,
  },
  {
    id: 2,
    user: "Trần Thị B",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "2024-03-10",
    title: "Đáng tiền",
    comment:
      "Sản phẩm chất lượng, đúng như mô tả. Dịch vụ khách hàng tốt. Chỉ có điều giá hơi cao một chút.",
    helpful: 8,
    verified: true,
  },
];

// const relatedProducts = [
//   {
//     id: 3,
//     name: "MacBook Air M3",
//     price: 28990000,
//     rating: 4.9,
//     image: "/images/macbook-air.jpg",
//   },
//   {
//     id: 4,
//     name: "Sony WH-1000XM5",
//     price: 7990000,
//     rating: 4.6,
//     image: "/images/sony-headphones.jpg",
//   },
//   {
//     id: 7,
//     name: "Apple Watch Series 9",
//     price: 9990000,
//     rating: 4.7,
//     image: "/images/apple-watch.jpg",
//   },
// ];

export default function ProductDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // const productId = Number.parseInt(params.id as string);
  // const product =
  //   mockProducts[mapId[params.id] as keyof typeof mockProducts] ||
  //   mockProducts[1];

  // console.log("Params:", params.id);

  // fetch product same slug
  useEffect(() => {
    const fetchProductBySlug = async () => {
      try {
        setLoadingRelated(true);
        setError(null);
        console.log("category_id: ", product.slug);
        const response = await fetch(`/api/categories/${product.slug}`);
        const result = await response.json();
        console.log("product slug: ", result);

        const related = result.data.products.map((item: any) => {
          if (item.id !== product.id) {
            return {
              id: item.id,
              name: item.name,
              price: item.price,
              rating: item.rating_average,
              image: item.primary_image || "/placeholder.svg",
            };
          }
          return null;
        });

        // Filter out null values
        const filteredRelated = related.filter((item) => item !== null);

        console.log("Related Products:", filteredRelated);
        setRelatedProducts(filteredRelated);
        // if (!result || !result.data) {
        //   throw new Error("Product not found");
        // }
        // const mappedProduct = mapProductData(result.data);
        // console.log("Mapped Product:", mappedProduct);
        // setProduct(mappedProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoadingRelated(false);
      }
    };

    if (product.slug) {
      fetchProductBySlug();
    }
  }, [product.slug]);

  // // Fetch category and products data
  useEffect(() => {
    const fetchProductById = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = params.id;
        const response = await fetch(`/api/products/by-id/${id}`);
        const result = await response.json();
        console.log(result.data);
        // if (!result || !result.id) {
        //   throw new Error("Product not found");
        // }
        const mappedProduct = mapProductData(result.data);
        console.log("Mapped Product:", mappedProduct);
        setProduct(mappedProduct);
      } catch (err) {
        console.error("Error fetching product by id:", err);
        setError("Failed to load product by id");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProductById();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      sellerId: product.seller.id,
      sellerName: product.seller.name,
    });
    console.log(`Added ${quantity} of product ${product.id} to cart`);
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      sellerId: product.seller.id,
      sellerName: product.seller.name,
    });
    window.location.href = "/checkout";
  };

  const submitReview = () => {
    console.log("Review submitted:", newReview);
    setShowReviewForm(false);
    setNewReview({ rating: 5, title: "", comment: "" });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClass =
      size === "sm" ? "h-3 w-3" : size === "lg" ? "h-6 w-6" : "h-4 w-4";
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClass} ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading || !product) {
    return <div className="text-center py-8">Đang tải sản phẩm...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Trang Chủ
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            Sản Phẩm
          </Link>
          <span>/</span>
          <Link
            href={`/categories/${product.slug?.toLowerCase()}`}
            className="hover:text-foreground"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? "border-primary" : "border-muted"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {/* <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{product.brand}</Badge>
                {product.inStock ? (
                  <Badge className="bg-green-500">Còn Hàng</Badge>
                ) : (
                  <Badge variant="destructive">Hết Hàng</Badge>
                )} */}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} đánh giá)
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge className="bg-red-500">
                    Tiết Kiệm{" "}
                    {formatPrice(product.originalPrice - product.price)}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={product.seller.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {product.seller.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      <span className="font-semibold">
                        {product.seller.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {renderStars(product.seller.rating, "sm")}
                        <span>{product.seller.rating}</span>
                      </div>
                      <span>{product.seller.totalSales} lượt bán</span>
                      <span>Phản hồi trong {product.seller.responseTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Number.parseInt(e.target.value) || 1)
                      )
                    }
                    className="w-20 text-center border-0"
                    min="1"
                    max={product.stockCount}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setQuantity(Math.min(product.stockCount, quantity + 1))
                    }
                    disabled={quantity >= product.stockCount}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stockCount} có sẵn
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Thêm Vào Giỏ
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Mua Ngay
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">
                        {product.shipping.free
                          ? "Miễn Phí Vận Chuyển"
                          : "Có Phí Vận Chuyển"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Giao hàng dự kiến: {product.shipping.estimatedDays}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Đổi Trả Dễ Dàng</p>
                      <p className="text-sm text-muted-foreground">
                        {product.shipping.returnPolicy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Bảo Vệ Người Mua</p>
                      <p className="text-sm text-muted-foreground">
                        Hoàn tiền đầy đủ nếu sản phẩm không đúng mô tả
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Mô Tả</TabsTrigger>
            <TabsTrigger value="specifications">Thông Số Kỹ Thuật</TabsTrigger>
            <TabsTrigger value="reviews">
              Đánh Giá ({product.reviewCount})
            </TabsTrigger>
            <TabsTrigger value="shipping">Vận Chuyển & Đổi Trả</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mô Tả Sản Phẩm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  {product.longDescription
                    ? String(product.longDescription)
                    : ""}
                </p>
                <div>
                  <h4 className="font-semibold mb-2">Tính Năng Chính:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="text-muted-foreground">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông Số Kỹ Thuật</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications ?? {}).map(
                    ([key, value]) => (
                      <div
                        key={String(key)}
                        className="flex justify-between py-2 border-b"
                      >
                        <span className="font-medium">{String(key)}:</span>
                        <span className="text-muted-foreground">
                          {String(value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {/* Review Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Đánh Giá Khách Hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">
                        {product.rating}
                      </div>
                      {renderStars(product.rating, "lg")}
                      <p className="text-muted-foreground mt-2">
                        Dựa trên {product.reviewCount} đánh giá
                      </p>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm w-8">{stars}★</span>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  stars === 5
                                    ? 60
                                    : stars === 4
                                    ? 25
                                    : stars === 3
                                    ? 10
                                    : stars === 2
                                    ? 3
                                    : 2
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {stars === 5
                              ? 77
                              : stars === 4
                              ? 32
                              : stars === 3
                              ? 13
                              : stars === 2
                              ? 4
                              : 2}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Write Review */}
              {user && (user.role === "buyer" || user.role === "seller") && (
                <Card>
                  <CardHeader>
                    <CardTitle>Viết Đánh Giá</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!showReviewForm ? (
                      <Button onClick={() => setShowReviewForm(true)}>
                        Viết Đánh Giá
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Xếp Hạng
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() =>
                                  setNewReview({ ...newReview, rating: star })
                                }
                                className="p-1"
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    star <= newReview.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Tiêu Đề Đánh Giá
                          </label>
                          <Input
                            value={newReview.title}
                            onChange={(e) =>
                              setNewReview({
                                ...newReview,
                                title: e.target.value,
                              })
                            }
                            placeholder="Tóm tắt đánh giá của bạn"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Đánh Giá Của Bạn
                          </label>
                          <Textarea
                            value={newReview.comment}
                            onChange={(e) =>
                              setNewReview({
                                ...newReview,
                                comment: e.target.value,
                              })
                            }
                            placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này"
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={submitReview}>Gửi Đánh Giá</Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowReviewForm(false)}
                          >
                            Hủy
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage
                            src={review.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {review.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.user}</span>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs">
                                Mua Hàng Đã Xác Minh
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="font-medium">{review.title}</span>
                          </div>
                          <p className="text-muted-foreground mb-3">
                            {review.comment}
                          </p>
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Hữu Ích ({review.helpful})
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              Không hữu ích
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vận Chuyển & Đổi Trả</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Thông Tin Vận Chuyển</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Miễn phí vận chuyển cho đơn hàng trên 1 triệu VNĐ</li>
                    <li>• Giao hàng tiêu chuẩn: 1-2 ngày làm việc</li>
                    <li>• Giao hàng nhanh: Trong ngày (phí thêm)</li>
                    <li>• Hỗ trợ giao hàng toàn quốc</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Chính Sách Đổi Trả</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Đổi trả trong vòng 30 ngày</li>
                    <li>• Sản phẩm phải còn nguyên vẹn, chưa sử dụng</li>
                    <li>• Miễn phí đổi trả cho sản phẩm lỗi</li>
                    <li>• Hoàn tiền trong 5-7 ngày làm việc</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Bảo Hành</h4>
                  <p className="text-muted-foreground">
                    Sản phẩm được bảo hành chính hãng 12 tháng, bao gồm lỗi phần
                    cứng và sản xuất.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Sản Phẩm Liên Quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <Image
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(relatedProduct.rating, "sm")}
                    <span className="text-sm text-muted-foreground">
                      {relatedProduct.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">
                      {formatPrice(relatedProduct.price)}
                    </span>
                    <Button size="sm" asChild>
                      <Link href={`/products/${relatedProduct.id}`}>Xem</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
