"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { Star, ShoppingCart, Heart, Filter, Grid3X3, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data for category details
const categoryData = {
  "dien-tu": {
    name: "Điện Tử",
    description:
      "Khám phá thế giới công nghệ với các sản phẩm điện tử hàng đầu",
    banner: "/placeholder.svg?height=200&width=1200",
    subcategories: [
      { id: "dien-thoai", name: "Điện Thoại", count: 450 },
      { id: "laptop", name: "Laptop", count: 320 },
      { id: "tai-nghe", name: "Tai Nghe", count: 280 },
      { id: "dong-ho-thong-minh", name: "Đồng Hồ Thông Minh", count: 150 },
      { id: "camera", name: "Camera", count: 50 },
    ],
    brands: ["Apple", "Samsung", "Sony", "LG", "Xiaomi", "Huawei"],
    priceRanges: [
      { label: "Dưới 1 triệu", min: 0, max: 1000000 },
      { label: "1-5 triệu", min: 1000000, max: 5000000 },
      { label: "5-10 triệu", min: 5000000, max: 10000000 },
      { label: "Trên 10 triệu", min: 10000000, max: 50000000 },
    ],
  },
  "thoi-trang": {
    name: "Thời Trang",
    description: "Xu hướng thời trang mới nhất cho mọi phong cách",
    banner: "/placeholder.svg?height=200&width=1200",
    subcategories: [
      { id: "quan-ao-nam", name: "Quần Áo Nam", count: 350 },
      { id: "quan-ao-nu", name: "Quần Áo Nữ", count: 420 },
      { id: "giay-dep", name: "Giày Dép", count: 180 },
      { id: "tui-xach", name: "Túi Xách", count: 90 },
      { id: "phu-kien", name: "Phụ Kiện", count: 150 },
    ],
    brands: ["Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Gucci"],
    priceRanges: [
      { label: "Dưới 500k", min: 0, max: 500000 },
      { label: "500k-1 triệu", min: 500000, max: 1000000 },
      { label: "1-3 triệu", min: 1000000, max: 3000000 },
      { label: "Trên 3 triệu", min: 3000000, max: 10000000 },
    ],
  },
  // Add more categories as needed
};

// Mock products for category with real images
const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    description: "Điện thoại thông minh cao cấp với chip A17 Pro",
    price: 29990000,
    originalPrice: 32990000,
    rating: 4.8,
    reviews: 256,
    image: "/images/iphone-15-pro.jpg",
    brand: "Apple",
    seller: "Apple Store VN",
    inStock: true,
    isNew: true,
    discount: 9,
    subcategory: "dien-thoai",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    description: "Flagship Android với S Pen và camera 200MP",
    price: 26990000,
    rating: 4.7,
    reviews: 189,
    image: "/images/samsung-s24.jpg",
    brand: "Samsung",
    seller: "Samsung Official",
    inStock: true,
    isNew: false,
    discount: 0,
    subcategory: "dien-thoai",
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
    brand: "Apple",
    seller: "Apple Store VN",
    inStock: true,
    isNew: true,
    discount: 10,
    subcategory: "laptop",
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    description: "Tai nghe chống ồn hàng đầu thế giới",
    price: 7990000,
    rating: 4.6,
    reviews: 324,
    image: "/images/sony-headphones.jpg",
    brand: "Sony",
    seller: "Sony Official Store",
    inStock: false,
    isNew: false,
    discount: 0,
    subcategory: "tai-nghe",
  },
  {
    id: 5,
    name: "iPad Pro 12.9 inch M4",
    description: "Máy tính bảng chuyên nghiệp với chip M4",
    price: 25990000,
    rating: 4.8,
    reviews: 98,
    image: "/images/ipad-pro.jpg",
    brand: "Apple",
    seller: "Apple Store VN",
    inStock: true,
    isNew: true,
    discount: 0,
    subcategory: "laptop",
  },
  {
    id: 6,
    name: "Dell XPS 13",
    description: "Laptop cao cấp cho doanh nhân",
    price: 22990000,
    originalPrice: 25990000,
    rating: 4.5,
    reviews: 76,
    image: "/images/dell-xps.jpg",
    brand: "Dell",
    seller: "Dell Official",
    inStock: true,
    isNew: false,
    discount: 12,
    subcategory: "laptop",
  },
  {
    id: 7,
    name: "Apple Watch Series 9",
    description: "Đồng hồ thông minh với tính năng sức khỏe tiên tiến",
    price: 9990000,
    rating: 4.7,
    reviews: 234,
    image: "/images/apple-watch.jpg",
    brand: "Apple",
    seller: "Apple Store VN",
    inStock: true,
    isNew: true,
    discount: 0,
    subcategory: "dong-ho-thong-minh",
  },
  {
    id: 8,
    name: "Canon EOS R5",
    description: "Máy ảnh mirrorless chuyên nghiệp 45MP",
    price: 89990000,
    rating: 4.9,
    reviews: 67,
    image: "/images/canon-camera.jpg",
    brand: "Canon",
    seller: "Canon Official",
    inStock: true,
    isNew: false,
    discount: 0,
    subcategory: "camera",
  },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Add state for API data
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch category and products data
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/categories/${slug}`);
        const result = await response.json();
        console.log("Category fetch result:", result);

        if (result.success) {
          setCategory(result.data.category);
          setProducts(result.data.products || []);
        } else {
          setError(result.error || "Failed to load category");
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Failed to load category data");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryData();
    }
  }, [slug]);

  // Update category data fallback with minimal structure
  const categoryFallback =
    categoryData[slug as keyof typeof categoryData] || categoryData["dien-tu"];

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Helper function to get available brands from real products
  const getAvailableBrands = () => {
    const brands = products
      .map((product: any) => product.brand)
      .filter(Boolean);
    return [...new Set(brands)];
  };

  const filteredProducts = products
    .filter((product: any) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock =
        !showInStockOnly ||
        (product.stock_quantity && product.stock_quantity > 0);
      // Note: subcategory filtering will be handled later when we have subcategory data

      return matchesSearch && matchesBrand && matchesPrice && matchesStock;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating_average || 0) - (a.rating_average || 0);
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "discount":
          const aDiscount = a.original_price
            ? ((a.original_price - a.price) / a.original_price) * 100
            : 0;
          const bDiscount = b.original_price
            ? ((b.original_price - b.price) / b.original_price) * 100
            : 0;
          return bDiscount - aDiscount;
        default:
          return (b.sales_count || 0) - (a.sales_count || 0);
      }
    });

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

      <div className="container px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Thử lại</Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && category && (
          <>
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground">
                Trang Chủ
              </Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-foreground">
                Danh Mục
              </Link>
              <span>/</span>
              <span className="text-foreground">{category.name}</span>
            </nav>

            {/* Category Banner */}
            <div className="relative mb-8 rounded-lg overflow-hidden">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={1200}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
                  <p className="text-lg">{category.description}</p>
                </div>
              </div>
            </div>

            {/* Subcategories - Use fallback data for now since we don't have subcategory API yet */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {/* <Button
                  variant={
                    selectedSubcategory === "all" ? "default" : "outline"
                  }
                  onClick={() => setSelectedSubcategory("all")}
                  className="mb-2"
                >
                  Tất Cả
                </Button> */}
                {/* {categoryFallback.subcategories.map((sub: any) => (
                  <Button
                    key={sub.id}
                    variant={
                      selectedSubcategory === sub.id ? "default" : "outline"
                    }
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className="mb-2"
                  >
                    {sub.name} ({sub.count})
                  </Button>
                ))} */}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div
                className={`lg:w-64 ${
                  showFilters ? "block" : "hidden lg:block"
                }`}
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
                      <div className="mt-2 space-y-1">
                        {categoryFallback.priceRanges.map((range: any) => (
                          <Button
                            key={range.label}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() =>
                              setPriceRange([range.min, range.max])
                            }
                          >
                            {range.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Brands - Use real data */}
                    <div>
                      <Label className="text-sm font-medium">Thương Hiệu</Label>
                      <div className="mt-2 space-y-2">
                        {getAvailableBrands().map((brand: string) => (
                          <div
                            key={brand}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={brand}
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={() => handleBrandToggle(brand)}
                            />
                            <Label htmlFor={brand} className="text-sm">
                              {brand}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

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
                        Chỉ hàng có sẵn
                      </Label>
                    </div>

                    {/* Clear Filters */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedBrands([]);
                        setPriceRange([0, 50000000]);
                        setShowInStockOnly(false);
                        setSearchTerm("");
                      }}
                    >
                      Xóa Tất Cả Bộ Lọc
                    </Button>
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
                      Bộ Lọc
                    </Button>

                    {/* View Mode Toggle */}
                    <div className="flex border rounded-md">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sắp xếp theo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">Phổ biến</SelectItem>
                        <SelectItem value="newest">Mới nhất</SelectItem>
                        <SelectItem value="price-low">
                          Giá: Thấp đến Cao
                        </SelectItem>
                        <SelectItem value="price-high">
                          Giá: Cao đến Thấp
                        </SelectItem>
                        <SelectItem value="rating">
                          Đánh giá cao nhất
                        </SelectItem>
                        <SelectItem value="discount">
                          Giảm giá nhiều nhất
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Results Count */}
                <p className="text-sm text-muted-foreground mb-6">
                  Hiển thị {filteredProducts.length} sản phẩm
                </p>

                {/* Products Grid/List */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredProducts.map((product: any) => (
                    <Card
                      key={product.id}
                      className="group hover:shadow-lg transition-shadow"
                    >
                      <div className={viewMode === "list" ? "flex" : ""}>
                        <CardHeader className="p-0">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <Image
                              src={product.primary_image || "/placeholder.svg"}
                              alt={product.name}
                              width={300}
                              height={300}
                              className={`object-cover group-hover:scale-105 transition-transform ${
                                viewMode === "list"
                                  ? "w-48 h-32"
                                  : "w-full h-48"
                              }`}
                            />
                            <Button
                              size="icon"
                              variant="secondary"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            {product.is_featured === 1 && (
                              <Badge className="absolute top-2 left-2 bg-green-500">
                                Nổi Bật
                              </Badge>
                            )}
                            {product.original_price &&
                              product.original_price > product.price && (
                                <Badge className="absolute bottom-2 left-2 bg-red-500">
                                  -
                                  {Math.round(
                                    ((product.original_price - product.price) /
                                      product.original_price) *
                                      100
                                  )}
                                  %
                                </Badge>
                              )}
                            {product.stock_quantity === 0 && (
                              <Badge className="absolute bottom-2 right-2 bg-gray-500">
                                Hết Hàng
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <div className="flex-1">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-1 mb-2">
                              {renderStars(product.rating_average || 0)}
                              <span className="text-sm text-muted-foreground">
                                ({product.review_count || 0})
                              </span>
                            </div>
                            <h3 className="font-semibold mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {product.description}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                              by {product.seller_name || product.store_name}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">
                                {formatPrice(product.price)}
                              </span>
                              {product.original_price &&
                                product.original_price > product.price && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.original_price)}
                                  </span>
                                )}
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button
                              className="w-full"
                              asChild
                              disabled={product.stock_quantity === 0}
                            >
                              <Link
                                href={`/products/${product.id || product.id}`}
                              >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                {product.stock_quantity > 0
                                  ? "Xem Chi Tiết"
                                  : "Hết Hàng"}
                              </Link>
                            </Button>
                          </CardFooter>
                        </div>
                      </div>
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
                        setSelectedBrands([]);
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
          </>
        )}
      </div>
    </div>
  );
}
