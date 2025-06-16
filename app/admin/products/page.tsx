"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { MainNav } from "@/components/main-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Clock,
  Ban,
} from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  seller: string;
  sellerId: number;
  status: "pending" | "approved" | "rejected" | "suspended";
  stock: number;
  sold: number;
  rating: number;
  reviews: number;
  revenue: number;
  reportCount: number;
  approvedDate?: string;
  rejectReason?: string;
}

export default function AdminProductsPage() {
  const { user, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      redirect("/login");
    }
  }, [user, isLoading]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!user || user.role !== "admin") return null;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Đã Duyệt</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Chờ Duyệt</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Từ Chối</Badge>;
      case "suspended":
        return <Badge className="bg-gray-500">Tạm Ngưng</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleProductAction = (
    productId: number,
    action: "approve" | "reject" | "suspend" | "delete",
    reason?: string
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              status:
                action === "approve"
                  ? "approved"
                  : action === "reject"
                  ? "rejected"
                  : action === "suspend"
                  ? "suspended"
                  : p.status,
              approvedDate:
                action === "approve"
                  ? new Date().toISOString().split("T")[0]
                  : p.approvedDate,
              rejectReason: action === "reject" ? reason : p.rejectReason,
            }
          : p
      )
    );

    if (action === "delete") {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const pendingCount = products.filter((p) => p.status === "pending").length;
  const approvedCount = products.filter((p) => p.status === "approved").length;
  const rejectedCount = products.filter((p) => p.status === "rejected").length;
  const reportedCount = products.filter((p) => p.reportCount > 0).length;

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Quản Lý Sản Phẩm</h1>
            <p className="text-muted-foreground">
              Kiểm duyệt và quản lý sản phẩm trên nền tảng
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Chờ Duyệt
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingCount}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Đã Duyệt
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {approvedCount}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Từ Chối
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {rejectedCount}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Có Báo Cáo
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {reportedCount}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm, người bán..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  <SelectItem value="Điện Tử">Điện Tử</SelectItem>
                  <SelectItem value="Thời Trang">Thời Trang</SelectItem>
                  <SelectItem value="Nhà Cửa">Nhà Cửa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                  <SelectItem value="suspended">Tạm ngưng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Sản Phẩm</CardTitle>
            <CardDescription>
              Hiển thị {filteredProducts.length} sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản Phẩm</TableHead>
                  <TableHead>Người Bán</TableHead>
                  <TableHead>Danh Mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Thống Kê</TableHead>
                  <TableHead>Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </div>
                          {product.reportCount > 0 && (
                            <Badge variant="destructive" className="mt-1">
                              {product.reportCount} báo cáo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.seller}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {product.sellerId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.category}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.subcategory}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(product.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Kho: {product.stock}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Đã bán: {product.sold}</div>
                        <div>
                          Đánh giá: {product.rating}/5 ({product.reviews})
                        </div>
                        <div className="text-muted-foreground">
                          Doanh thu: {formatCurrency(product.revenue)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Chi Tiết Sản Phẩm</DialogTitle>
                            </DialogHeader>
                            {selectedProduct && (
                              <div className="space-y-6">
                                <div className="flex gap-6">
                                  <Image
                                    src={
                                      selectedProduct.image ||
                                      "/placeholder.svg"
                                    }
                                    alt={selectedProduct.name}
                                    width={200}
                                    height={200}
                                    className="rounded-lg object-cover"
                                  />
                                  <div className="flex-1 space-y-4">
                                    <div>
                                      <h3 className="text-xl font-semibold">
                                        {selectedProduct.name}
                                      </h3>
                                      <p className="text-muted-foreground">
                                        {selectedProduct.description}
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="text-sm text-muted-foreground">
                                          Giá:
                                        </span>
                                        <div className="font-semibold">
                                          {formatCurrency(
                                            selectedProduct.price
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-sm text-muted-foreground">
                                          Danh mục:
                                        </span>
                                        <div>
                                          {selectedProduct.category} /{" "}
                                          {selectedProduct.subcategory}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-sm text-muted-foreground">
                                          Người bán:
                                        </span>
                                        <div>{selectedProduct.seller}</div>
                                      </div>
                                      <div>
                                        <span className="text-sm text-muted-foreground">
                                          Trạng thái:
                                        </span>
                                        <div>
                                          {getStatusBadge(
                                            selectedProduct.status
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">
                                      {selectedProduct.stock}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Tồn kho
                                    </div>
                                  </div>
                                  <div className="text-center p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">
                                      {selectedProduct.sold}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Đã bán
                                    </div>
                                  </div>
                                  <div className="text-center p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">
                                      {selectedProduct.rating}/5
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {selectedProduct.reviews} đánh giá
                                    </div>
                                  </div>
                                </div>

                                {selectedProduct.status === "rejected" &&
                                  selectedProduct.rejectReason && (
                                    <div className="p-4 bg-red-50 rounded-lg">
                                      <h4 className="font-semibold text-red-800 mb-2">
                                        Lý Do Từ Chối
                                      </h4>
                                      <p className="text-sm text-red-700">
                                        {selectedProduct.rejectReason}
                                      </p>
                                    </div>
                                  )}

                                {selectedProduct.reportCount > 0 && (
                                  <div className="p-4 bg-yellow-50 rounded-lg">
                                    <h4 className="font-semibold text-yellow-800 mb-2">
                                      Cảnh Báo
                                    </h4>
                                    <p className="text-sm text-yellow-700">
                                      Sản phẩm này có{" "}
                                      {selectedProduct.reportCount} báo cáo từ
                                      người dùng
                                    </p>
                                  </div>
                                )}

                                <div className="flex justify-end gap-2">
                                  {selectedProduct.status === "pending" && (
                                    <>
                                      <Button
                                        onClick={() =>
                                          handleProductAction(
                                            selectedProduct.id,
                                            "approve"
                                          )
                                        }
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Duyệt
                                      </Button>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="destructive">
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Từ Chối
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>
                                              Từ Chối Sản Phẩm
                                            </DialogTitle>
                                            <DialogDescription>
                                              Vui lòng nhập lý do từ chối sản
                                              phẩm này
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4">
                                            <Textarea
                                              placeholder="Nhập lý do từ chối..."
                                              value={rejectReason}
                                              onChange={(e) =>
                                                setRejectReason(e.target.value)
                                              }
                                            />
                                            <div className="flex justify-end gap-2">
                                              <Button variant="outline">
                                                Hủy
                                              </Button>
                                              <Button
                                                variant="destructive"
                                                onClick={() => {
                                                  handleProductAction(
                                                    selectedProduct.id,
                                                    "reject",
                                                    rejectReason
                                                  );
                                                  setRejectReason("");
                                                }}
                                              >
                                                Từ Chối
                                              </Button>
                                            </div>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </>
                                  )}

                                  {selectedProduct.status === "approved" && (
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        handleProductAction(
                                          selectedProduct.id,
                                          "suspend"
                                        )
                                      }
                                    >
                                      <Ban className="mr-2 h-4 w-4" />
                                      Tạm Ngưng
                                    </Button>
                                  )}

                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      handleProductAction(
                                        selectedProduct.id,
                                        "delete"
                                      )
                                    }
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Xóa
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {product.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleProductAction(product.id, "approve")
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleProductAction(
                                  product.id,
                                  "reject",
                                  "Không đạt tiêu chuẩn"
                                )
                              }
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {product.status === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleProductAction(product.id, "suspend")
                            }
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
