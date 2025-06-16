"use client";

import { MainNav } from "@/components/main-nav";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, TrendingUp, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    id: "dien-tu",
    name: "Điện Tử",
    description: "Thiết bị điện tử, công nghệ mới nhất",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 1250,
    trending: true,
    subcategories: [
      "Điện Thoại",
      "Laptop",
      "Tai Nghe",
      "Đồng Hồ Thông Minh",
      "Camera",
    ],
    featuredBrands: ["Apple", "Samsung", "Sony", "LG"],
    priceRange: "50,000₫ - 50,000,000₫",
  },
  {
    id: "thoi-trang",
    name: "Thời Trang",
    description: "Quần áo, giày dép, phụ kiện thời trang",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 890,
    trending: false,
    subcategories: [
      "Quần Áo Nam",
      "Quần Áo Nữ",
      "Giày Dép",
      "Túi Xách",
      "Phụ Kiện",
    ],
    featuredBrands: ["Nike", "Adidas", "Zara", "H&M"],
    priceRange: "100,000₫ - 5,000,000₫",
  },
  {
    id: "nha-cua-vuon",
    name: "Nhà Cửa & Vườn",
    description: "Đồ gia dụng, nội thất, dụng cụ làm vườn",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 567,
    trending: true,
    subcategories: [
      "Nội Thất",
      "Đồ Gia Dụng",
      "Dụng Cụ Làm Vườn",
      "Trang Trí",
      "Chiếu Sáng",
    ],
    featuredBrands: ["IKEA", "Sunhouse", "Lock&Lock", "Elmich"],
    priceRange: "20,000₫ - 20,000,000₫",
  },
  {
    id: "the-thao",
    name: "Thể Thao",
    description: "Dụng cụ thể thao, trang phục thể thao",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 423,
    trending: false,
    subcategories: [
      "Gym & Fitness",
      "Bóng Đá",
      "Bóng Rổ",
      "Bơi Lội",
      "Chạy Bộ",
    ],
    featuredBrands: ["Nike", "Adidas", "Puma", "Under Armour"],
    priceRange: "50,000₫ - 10,000,000₫",
  },
  {
    id: "sach",
    name: "Sách",
    description: "Sách văn học, giáo dục, kỹ năng",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 789,
    trending: false,
    subcategories: [
      "Văn Học",
      "Giáo Dục",
      "Kỹ Năng",
      "Thiếu Nhi",
      "Truyện Tranh",
    ],
    featuredBrands: ["NXB Trẻ", "NXB Kim Đồng", "Fahasa", "Alpha Books"],
    priceRange: "15,000₫ - 500,000₫",
  },
  {
    id: "do-choi",
    name: "Đồ Chơi",
    description: "Đồ chơi trẻ em, đồ chơi giáo dục",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 345,
    trending: true,
    subcategories: [
      "Đồ Chơi Trẻ Em",
      "Lego",
      "Búp Bê",
      "Xe Mô Hình",
      "Đồ Chơi Giáo Dục",
    ],
    featuredBrands: ["Lego", "Barbie", "Hot Wheels", "Fisher-Price"],
    priceRange: "30,000₫ - 3,000,000₫",
  },
  {
    id: "lam-dep",
    name: "Làm Đẹp",
    description: "Mỹ phẩm, chăm sóc da, nước hoa",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 612,
    trending: true,
    subcategories: [
      "Chăm Sóc Da",
      "Trang Điểm",
      "Nước Hoa",
      "Chăm Sóc Tóc",
      "Chăm Sóc Cơ Thể",
    ],
    featuredBrands: ["L'Oreal", "Maybelline", "Innisfree", "The Face Shop"],
    priceRange: "25,000₫ - 2,000,000₫",
  },
  {
    id: "o-to-xe-may",
    name: "Ô Tô & Xe Máy",
    description: "Phụ tùng, phụ kiện xe hơi, xe máy",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 234,
    trending: false,
    subcategories: [
      "Phụ Tùng Ô Tô",
      "Phụ Tùng Xe Máy",
      "Dầu Nhớt",
      "Phụ Kiện",
      "Đồ Chơi Xe",
    ],
    featuredBrands: ["Castrol", "Shell", "Mobil", "3M"],
    priceRange: "10,000₫ - 50,000,000₫",
  },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Mua Sắm Theo Danh Mục</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Khám phá hàng nghìn sản phẩm được phân loại theo từng danh mục
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">8</div>
              <p className="text-sm text-muted-foreground">Danh Mục Chính</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">4,110</div>
              <p className="text-sm text-muted-foreground">Tổng Sản Phẩm</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">4</div>
              <p className="text-sm text-muted-foreground">Danh Mục Hot</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">40+</div>
              <p className="text-sm text-muted-foreground">Danh Mục Con</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            return (
              <Link key={category.id} href={`categories/${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {category.trending && (
                        <Badge className="absolute top-3 left-3 bg-red-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary">
                          {category.productCount} sản phẩm
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {category.description}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">
                          Danh mục con:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 3).map((sub) => (
                            <Badge
                              key={sub}
                              variant="outline"
                              className="text-xs"
                            >
                              {sub}
                            </Badge>
                          ))}
                          {category.subcategories.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{category.subcategories.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">
                          Thương hiệu nổi bật:
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category.featuredBrands.slice(0, 2).join(", ")}
                          {category.featuredBrands.length > 2 && "..."}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Khoảng giá:</p>
                        <p className="text-sm text-muted-foreground">
                          {category.priceRange}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Không tìm thấy danh mục
            </h3>
            <p className="text-muted-foreground">
              Không có danh mục nào phù hợp với từ khóa "{searchTerm}"
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              Xóa tìm kiếm
            </Button>
          </div>
        )}

        {/* Popular Categories Section */}
        {/* <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Danh Mục Phổ Biến
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories
              .filter((cat) => cat.trending)
              .map((category, idx) => {
                let link = `/categories/${category.id}`;
                if (category.id !== "dien-tu" && category.id !== "thoi-trang") {
                  link =
                    idx % 2 === 0
                      ? "/categories/dien-tu"
                      : "/categories/thoi-trang";
                }
                return (
                  <Link key={category.id} href={link}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          width={80}
                          height={80}
                          className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                        />
                        <h3 className="font-semibold text-sm">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.productCount} sản phẩm
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </div> */}
      </div>
    </div>
  );
}
