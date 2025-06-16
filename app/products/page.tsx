"use client";

import { use, useEffect, useState } from "react";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Star, ShoppingCart, Heart, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { mapProductData1 } from "@/lib/utils";

const allProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    description: "Điện thoại thông minh cao cấp với chip A17 Pro",
    price: 29990000,
    originalPrice: 32990000,
    rating: 4.8,
    reviews: 256,
    image: "/images/iphone-15-pro.jpg",
    category: "Điện tử",
    seller: "Apple Store VN",
    inStock: true,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    description: "Flagship Android với S Pen và camera 200MP",
    price: 26990000,
    rating: 4.7,
    reviews: 189,
    image: "/images/samsung-s24.jpg",
    category: "Điện tử",
    seller: "Samsung Official",
    inStock: true,
  },
  {
    id: 3,
    name: "MacBook Air M3",
    description: "Laptop siêu mỏng với chip M3 mạnh mẽ",
    price: 28990000,
    originalPrice: 31990000,
    rating: 4.9,
    reviews: 145,
    image: "/images/macbook-air.jpg",
    category: "Điện tử",
    seller: "Apple Store VN",
    inStock: true,
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    description: "Tai nghe chống ồn hàng đầu thế giới",
    price: 7990000,
    rating: 4.6,
    reviews: 324,
    image: "/images/sony-headphones.jpg",
    category: "Điện tử",
    seller: "Sony Official Store",
    inStock: false,
  },
  {
    id: 5,
    name: "Nike Air Max 270",
    description: "Giày thể thao thoải mái cho mọi hoạt động",
    price: 3290000,
    rating: 4.5,
    reviews: 189,
    image: "/images/nike-shoes.jpg",
    category: "Thời trang",
    seller: "Nike Official",
    inStock: true,
  },
  {
    id: 6,
    name: "Máy Pha Cà Phê Delonghi",
    description: "Máy pha cà phê tự động cao cấp",
    price: 8990000,
    rating: 4.4,
    reviews: 156,
    image: "/images/coffee-maker.jpg",
    category: "Nhà cửa & Vườn",
    seller: "KitchenPro",
    inStock: true,
  },
  {
    id: 7,
    name: "Đèn Bàn LED Thông Minh",
    description: "Đèn bàn LED với điều chỉnh độ sáng",
    price: 1290000,
    rating: 4.2,
    reviews: 67,
    image: "/images/desk-lamp.jpg",
    category: "Nhà cửa & Vườn",
    seller: "LightCraft",
    inStock: true,
  },
  {
    id: 8,
    name: "Balo Laptop Cao Cấp",
    description: "Balo laptop chống nước, thiết kế hiện đại",
    price: 1990000,
    rating: 4.7,
    reviews: 203,
    image: "/images/laptop-backpack.jpg",
    category: "Phụ kiện",
    seller: "BagCraft",
    inStock: true,
  },
];

const mapCat = {};

const categoriesAllow = [
  "Tất Cả",
  "Điện Tử",
  "Thời Trang",
  "Nhà Cửa & Vườn",
  "Thể Thao",
  "Đồ Chơi",
  "Sách",
  "Ô Tô & Xe Máy",
  "Làm Đẹp",
];

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadCategories, setLoadCategories] = useState(true);
  console.log(selectedCategory);

  useEffect(() => {
    // Fetch products from API or database

    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch("/api/products"); // Replace with your API endpoint
        const data = await response.json();
        const dataArr = data.data;
        console.log("Fetched products:", dataArr);
        setProducts(dataArr.map((item) => mapProductData1(item)));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    // Fetch products from API or database
    async function fetchCategories() {
      try {
        setLoadCategories(true);
        const response = await fetch("/api/categories"); // Replace with your API endpoint
        const data = await response.json();
        const dataArr = data.data;
        setCategories(dataArr);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoadCategories(false);
      }
    }

    fetchCategories();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Tất Cả" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = !showInStockOnly || product.inStock;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      sellerId: "seller1",
      sellerName: product.seller,
    });
    // You could add a toast notification here
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading || loadCategories) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Bộ Lọc</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <Label className="text-sm font-medium">Danh Mục</Label>
                  <div className="mt-2 space-y-2">
                    {categories.map((category) => {
                      if (categoriesAllow.includes(category.name)) {
                        return (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={category}
                              checked={selectedCategory === category.id}
                              onCheckedChange={() =>
                                setSelectedCategory(category.id)
                              }
                            />
                            <Label htmlFor={category} className="text-sm">
                              {category.name}
                            </Label>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium">
                    Khoảng Giá: {formatPrice(priceRange[0])} -{" "}
                    {formatPrice(priceRange[1])}
                  </Label>
                  <div className="mt-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={50000000}
                      step={100000}
                      className="w-full"
                    />
                  </div>
                </div>{" "}
                {/* Stock Filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={showInStockOnly}
                    onCheckedChange={(checked) =>
                      setShowInStockOnly(checked === true)
                    }
                  />
                  <Label htmlFor="inStock" className="text-sm">
                    Chỉ hiển thị hàng có sẵn
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Nổi bật</SelectItem>
                    <SelectItem value="price-low">Giá: Thấp đến Cao</SelectItem>
                    <SelectItem value="price-high">
                      Giá: Cao đến Thấp
                    </SelectItem>
                    <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                    <SelectItem value="name">Tên A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              Hiển thị {filteredProducts.length} trong số {allProducts.length}{" "}
              sản phẩm
            </p>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      {product.originalPrice && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                          Giảm Giá
                        </Badge>
                      )}
                      {!product.inStock && (
                        <Badge className="absolute bottom-2 left-2 bg-gray-500">
                          Hết Hàng
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.description}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      by {product.seller}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex gap-2 w-full">
                      <Button
                        className="flex-1"
                        asChild
                        disabled={!product.inStock}
                      >
                        <Link href={`/products/${product.id}`}>
                          Xem Chi Tiết
                        </Link>
                      </Button>
                      {product.inStock && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Tất Cả");
                    setPriceRange([0, 50000000]);
                    setShowInStockOnly(false);
                  }}
                >
                  Xóa Bộ Lọc
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
