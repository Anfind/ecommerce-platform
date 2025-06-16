"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Star, ShoppingCart, Heart, Filter, Grid3X3, List, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for subcategory details
const subcategoryData = {
  "dien-thoai": {
    name: "Điện Thoại",
    description: "Điện thoại thông minh từ các thương hiệu hàng đầu",
    parentCategory: "dien-tu",
    parentName: "Điện Tử",
    brands: ["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo", "Huawei"],
    features: ["5G", "Camera kép", "Sạc nhanh", "Chống nước", "Face ID", "Vân tay"],
    priceRanges: [
      { label: "Dưới 5 triệu", min: 0, max: 5000000 },
      { label: "5-10 triệu", min: 5000000, max: 10000000 },
      { label: "10-20 triệu", min: 10000000, max: 20000000 },
      { label: "Trên 20 triệu", min: 20000000, max: 50000000 },
    ],
  },
  laptop: {
    name: "Laptop",
    description: "Máy tính xách tay cho mọi nhu cầu",
    parentCategory: "dien-tu",
    parentName: "Điện Tử",
    brands: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer"],
    features: ["SSD", "Màn hình 4K", "Card đồ họa rời", "Bàn phím có đèn", "Cảm ứng", "Gaming"],
    priceRanges: [
      { label: "Dưới 15 triệu", min: 0, max: 15000000 },
      { label: "15-25 triệu", min: 15000000, max: 25000000 },
      { label: "25-40 triệu", min: 25000000, max: 40000000 },
      { label: "Trên 40 triệu", min: 40000000, max: 100000000 },
    ],
  },
  "tai-nghe": {
    name: "Tai Nghe",
    description: "Tai nghe chất lượng cao cho âm thanh tuyệt vời",
    parentCategory: "dien-tu",
    parentName: "Điện Tử",
    brands: ["Sony", "Bose", "Apple", "Sennheiser", "JBL", "Audio-Technica"],
    features: ["Chống ồn", "Bluetooth", "Không dây", "Micro tích hợp", "Hi-Res Audio", "Gaming"],
    priceRanges: [
      { label: "Dưới 1 triệu", min: 0, max: 1000000 },
      { label: "1-3 triệu", min: 1000000, max: 3000000 },
      { label: "3-8 triệu", min: 3000000, max: 8000000 },
      { label: "Trên 8 triệu", min: 8000000, max: 20000000 },
    ],
  },
}

// Mock products for subcategory
const subcategoryProducts = {
  "dien-thoai": [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      description: "Điện thoại thông minh cao cấp với chip A17 Pro",
      price: 29990000,
      originalPrice: 32990000,
      rating: 4.8,
      reviews: 256,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Apple",
      seller: "Apple Store VN",
      inStock: true,
      isNew: true,
      discount: 9,
      features: ["5G", "Camera kép", "Face ID", "Chống nước"],
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      description: "Flagship Android với S Pen và camera 200MP",
      price: 26990000,
      rating: 4.7,
      reviews: 189,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Samsung",
      seller: "Samsung Official",
      inStock: true,
      isNew: false,
      discount: 0,
      features: ["5G", "S Pen", "Camera kép", "Chống nước"],
    },
    {
      id: 9,
      name: "Xiaomi 14 Ultra",
      description: "Camera Leica, hiệu năng mạnh mẽ",
      price: 24990000,
      rating: 4.6,
      reviews: 145,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Xiaomi",
      seller: "Xiaomi Official",
      inStock: true,
      isNew: true,
      discount: 0,
      features: ["5G", "Camera Leica", "Sạc nhanh", "Vân tay"],
    },
  ],
  laptop: [
    {
      id: 3,
      name: "MacBook Air M3",
      description: "Laptop siêu mỏng với chip M3 mạnh mẽ",
      price: 28990000,
      originalPrice: 31990000,
      rating: 4.9,
      reviews: 145,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Apple",
      seller: "Apple Store VN",
      inStock: true,
      isNew: true,
      discount: 10,
      features: ["SSD", "Màn hình Retina", "Bàn phím có đèn"],
    },
    {
      id: 5,
      name: "iPad Pro 12.9 inch M4",
      description: "Máy tính bảng chuyên nghiệp với chip M4",
      price: 25990000,
      rating: 4.8,
      reviews: 98,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Apple",
      seller: "Apple Store VN",
      inStock: true,
      isNew: true,
      discount: 0,
      features: ["SSD", "Màn hình 4K", "Cảm ứng"],
    },
    {
      id: 6,
      name: "Dell XPS 13",
      description: "Laptop cao cấp cho doanh nhân",
      price: 22990000,
      originalPrice: 25990000,
      rating: 4.5,
      reviews: 76,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Dell",
      seller: "Dell Official",
      inStock: true,
      isNew: false,
      discount: 12,
      features: ["SSD", "Màn hình 4K", "Bàn phím có đèn"],
    },
  ],
  "tai-nghe": [
    {
      id: 4,
      name: "Sony WH-1000XM5",
      description: "Tai nghe chống ồn hàng đầu thế giới",
      price: 7990000,
      rating: 4.6,
      reviews: 324,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Sony",
      seller: "Sony Official Store",
      inStock: false,
      isNew: false,
      discount: 0,
      features: ["Chống ồn", "Bluetooth", "Không dây", "Hi-Res Audio"],
    },
    {
      id: 10,
      name: "AirPods Pro 2",
      description: "Tai nghe không dây với chống ồn chủ động",
      price: 6990000,
      rating: 4.7,
      reviews: 289,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Apple",
      seller: "Apple Store VN",
      inStock: true,
      isNew: true,
      discount: 0,
      features: ["Chống ồn", "Bluetooth", "Không dây", "Micro tích hợp"],
    },
  ],
}

export default function SubcategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const subcategorySlug = params.subcategory as string

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("popular")
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Get subcategory data
  const subcategory = subcategoryData[subcategorySlug as keyof typeof subcategoryData]
  const products = subcategoryProducts[subcategorySlug as keyof typeof subcategoryProducts] || []

  if (!subcategory) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Danh mục không tồn tại</h1>
          <Button asChild>
            <Link href="/categories">Quay lại danh mục</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]))
  }

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
      const matchesFeature =
        selectedFeatures.length === 0 || selectedFeatures.some((feature) => product.features?.includes(feature))
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesStock = !showInStockOnly || product.inStock

      return matchesSearch && matchesBrand && matchesFeature && matchesPrice && matchesStock
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.isNew ? 1 : -1
        case "discount":
          return (b.discount || 0) - (a.discount || 0)
        default:
          return b.rating - a.rating
      }
    })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
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
          <Link href="/categories" className="hover:text-foreground">
            Danh Mục
          </Link>
          <span>/</span>
          <Link href={`/categories/${subcategory.parentCategory}`} className="hover:text-foreground">
            {subcategory.parentName}
          </Link>
          <span>/</span>
          <span className="text-foreground">{subcategory.name}</span>
        </nav>

        {/* Back Button & Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/categories/${subcategory.parentCategory}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại {subcategory.parentName}
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{subcategory.name}</h1>
            <p className="text-muted-foreground">{subcategory.description}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Bộ Lọc</h3>
                  <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setShowFilters(false)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium">
                    Khoảng Giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
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
                    {subcategory.priceRanges.map((range) => (
                      <Button
                        key={range.label}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setPriceRange([range.min, range.max])}
                      >
                        {range.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <Label className="text-sm font-medium">Thương Hiệu</Label>
                  <div className="mt-2 space-y-2">
                    {subcategory.brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
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

                {/* Features */}
                <div>
                  <Label className="text-sm font-medium">Tính Năng</Label>
                  <div className="mt-2 space-y-2">
                    {subcategory.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                        />
                        <Label htmlFor={feature} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="inStock" checked={showInStockOnly} onCheckedChange={setShowInStockOnly} />
                  <Label htmlFor="inStock" className="text-sm">
                    Chỉ hàng có sẵn
                  </Label>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedBrands([])
                    setSelectedFeatures([])
                    setPriceRange([0, 50000000])
                    setShowInStockOnly(false)
                    setSearchTerm("")
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
                  placeholder={`Tìm kiếm ${subcategory.name.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(true)}>
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
                    <SelectItem value="price-low">Giá: Thấp đến Cao</SelectItem>
                    <SelectItem value="price-high">Giá: Cao đến Thấp</SelectItem>
                    <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                    <SelectItem value="discount">Giảm giá nhiều nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">Hiển thị {filteredProducts.length} sản phẩm</p>

            {/* Products Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className={viewMode === "list" ? "flex" : ""}>
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className={`object-cover group-hover:scale-105 transition-transform ${
                            viewMode === "list" ? "w-48 h-32" : "w-full h-48"
                          }`}
                        />
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        {product.isNew && <Badge className="absolute top-2 left-2 bg-green-500">Mới</Badge>}
                        {product.discount > 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-red-500">-{product.discount}%</Badge>
                        )}
                        {!product.inStock && <Badge className="absolute bottom-2 right-2 bg-gray-500">Hết Hàng</Badge>}
                      </div>
                    </CardHeader>
                    <div className="flex-1">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(product.rating)}
                          <span className="text-sm text-muted-foreground">({product.reviews})</span>
                        </div>
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                        <p className="text-xs text-muted-foreground mb-2">by {product.seller}</p>

                        {/* Features */}
                        {product.features && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.features.slice(0, 3).map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" asChild disabled={!product.inStock}>
                          <Link href={`/products/${product.id}`}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {product.inStock ? "Xem Chi Tiết" : "Hết Hàng"}
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
                <p className="text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedBrands([])
                    setSelectedFeatures([])
                    setPriceRange([0, 50000000])
                    setShowInStockOnly(false)
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
  )
}
