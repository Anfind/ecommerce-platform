"use client";

import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  Award,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const featuredProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 29990000,
    originalPrice: 32990000,
    rating: 4.8,
    reviews: 256,
    image: "/images/iphone-15-pro.jpg",
    discount: 9,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: 26990000,
    rating: 4.7,
    reviews: 189,
    image: "/images/samsung-s24.jpg",
  },
  {
    id: 3,
    name: "MacBook Air M3",
    price: 28990000,
    originalPrice: 31990000,
    rating: 4.9,
    reviews: 145,
    image: "/images/macbook-air.jpg",
    discount: 10,
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    price: 7990000,
    rating: 4.6,
    reviews: 324,
    image: "/images/sony-headphones.jpg",
  },
];

const categories = [
  {
    name: "Điện Tử",
    slug: "dien-tu",
    image: "/images/iphone-15-pro.jpg",
    count: "1,200+ sản phẩm",
  },
  {
    name: "Thời Trang",
    slug: "thoi-trang",
    image: "/images/nike-shoes.jpg",
    count: "800+ sản phẩm",
  },
  {
    name: "Nhà Cửa & Bếp",
    slug: "nha-cua-bep",
    image: "/images/coffee-maker.jpg",
    count: "600+ sản phẩm",
  },
  {
    name: "Phụ Kiện",
    slug: "phu-kien",
    image: "/images/laptop-backpack.jpg",
    count: "400+ sản phẩm",
  },
];

export default function HomePage() {
  const [featuredProduct, setFeaturedProduct] = useState([]);

  // Call API to fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products/featured");
        // if (!response.ok) {
        //   throw new Error("Failed to fetch featured products");
        // }
        const data = await response.json();
        console.log("Featured products data:", data);
        setFeaturedProduct(data.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Khám Phá Thế Giới
                <br />
                <span className="text-yellow-300">Mua Sắm Trực Tuyến</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Hàng triệu sản phẩm chất lượng cao từ các thương hiệu uy tín.
                Giao hàng nhanh, đổi trả dễ dàng.
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Link href="/products">Mua Sắm Ngay</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <Link href="/categories">Khám Phá Danh Mục</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/iphone-15-pro.jpg"
                alt="Featured Product"
                width={500}
                height={500}
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-black p-4 rounded-lg">
                <p className="font-bold">Giảm giá đến 30%</p>
                <p className="text-sm">Cho đơn hàng đầu tiên</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold mb-2">1M+</h3>
              <p className="text-muted-foreground">Khách hàng tin tưởng</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold mb-2">50K+</h3>
              <p className="text-muted-foreground">Sản phẩm đa dạng</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold mb-2">99%</h3>
              <p className="text-muted-foreground">Khách hàng hài lòng</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold mb-2">5★</h3>
              <p className="text-muted-foreground">Đánh giá trung bình</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sản Phẩm Nổi Bật</h2>
            <p className="text-muted-foreground text-lg">
              Những sản phẩm được yêu thích nhất
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProduct.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.primary_image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                    {product.discount && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(product.rating_average)}
                    <span className="text-sm text-muted-foreground">
                      ({product.views_count})
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/products/${product.id}`}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Xem Chi Tiết
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Danh Mục Sản Phẩm</h2>
            <p className="text-muted-foreground text-lg">
              Khám phá các danh mục đa dạng
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category.slug}
                className="group hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Link href={`/categories/${category.slug}`}>
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bắt Đầu Mua Sắm Ngay Hôm Nay
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Đăng ký ngay để nhận ưu đãi độc quyền và cập nhật sản phẩm mới nhất
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-green-50"
            >
              <Link href="/register">Đăng Ký Ngay</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600"
            >
              <Link href="/products">Xem Sản Phẩm</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
