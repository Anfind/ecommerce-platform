"use client";

import { useAuth } from "@/components/auth-provider";
import { useOrders } from "@/components/order-provider";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Save,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const { orders } = useOrders();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductDetailDialogOpen, setIsProductDetailDialogOpen] =
    useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Fetch data user and product
  useEffect(() => {
    // Fetch users from API or database
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users"); // Replace with your API endpoint
        const data = await response.json();
        console.log("Fetched users:", data);
        setUsers(data.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    if (user && user.role === "admin") {
      fetchUsers();
    }
  }, [user]);
  // get product
  useEffect(() => {
    // Fetch products from API or database
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products"); // Replace with your API endpoint
        const data = await response.json();
        console.log("Fetched products:", data);
        setProducts(data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }

    if (user && user.role === "admin") {
      fetchProducts();
    }
  }, [user]);

  // Calculate real statistics
  const calculateStatistics = () => {
    // Total Users - count from mockUsers + any additional users from auth
    const totalUsers = users.length;

    // Total Products - count from mockProducts
    const totalProducts = products.length;

    // Total Revenue - sum of all paid orders
    const totalRevenue = orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.total, 0);

    // Active Orders - count of orders that are not delivered/cancelled
    const activeOrders = orders.filter((order) =>
      ["pending", "confirmed", "shipped"].includes(order.status)
    ).length;

    return {
      totalUsers,
      totalProducts,
      totalRevenue,
      activeOrders,
    };
  };

  const stats = calculateStatistics();

  // Format currency for Vietnamese Dong
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      const updatedUsers = users.map((user: any) =>
        user.id === (selectedUser as any).id
          ? { ...user, ...editFormData }
          : user
      );
      setUsers(updatedUsers);

      toast({
        title: "Cập nhật thành công",
        description: `Thông tin người dùng "${editFormData.name}" đã được cập nhật.`,
        duration: 3000,
      });

      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Product management functions
  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setIsProductDetailDialogOpen(true);
  };

  const handleApproveProduct = (productId: number) => {
    const updatedProducts = products.map((product: any) =>
      product.id === productId ? { ...product, status: "approved" } : product
    );
    setProducts(updatedProducts);

    const productName = products.find((p) => p.id === productId)?.name;
    toast({
      title: "Phê duyệt thành công",
      description: `Sản phẩm "${productName}" đã được phê duyệt.`,
      duration: 3000,
    });
  };

  const handleRejectProduct = (product: any) => {
    setSelectedProduct(product);
    setIsRejectDialogOpen(true);
  };

  const confirmRejectProduct = () => {
    if (selectedProduct) {
      const updatedProducts = products.map((product: any) =>
        product.id === selectedProduct.id
          ? { ...product, status: "rejected", rejectReason }
          : product
      );
      setProducts(updatedProducts);

      toast({
        title: "Từ chối thành công",
        description: `Sản phẩm "${selectedProduct.name}" đã bị từ chối.`,
        variant: "destructive",
        duration: 3000,
      });

      setIsRejectDialogOpen(false);
      setRejectReason("");
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      redirect("/login");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
      case "resolved":
        return <Badge className="bg-green-500">Hoạt Động</Badge>;
      case "pending":
      case "investigating":
        return <Badge className="bg-yellow-500">Đang Chờ</Badge>;
      case "suspended":
      case "rejected":
      case "open":
        return <Badge className="bg-red-500">Tạm Ngưng</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bảng Điều Khiển Quản Trị</h1>
            <p className="text-muted-foreground">
              Quản lý người dùng, sản phẩm và hoạt động hệ thống
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng Người Dùng
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Người dùng đã đăng ký
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng Sản Phẩm
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalProducts?.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Sản phẩm trên hệ thống
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng Doanh Thu
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Từ các đơn hàng đã thanh toán
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đơn Hàng Đang Hoạt Động
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.activeOrders.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Đơn hàng chưa hoàn thành
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Quản Lý Người Dùng</TabsTrigger>
            <TabsTrigger value="products">Kiểm Duyệt Sản Phẩm</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Quản Lý Người Dùng</CardTitle>
                <CardDescription>
                  Quản lý tài khoản người dùng và quyền hạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vai Trò</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Ngày Tham Gia</TableHead>
                      <TableHead>Hành Động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Chỉnh Sửa
                            </Button>
                            <Button size="sm" variant="destructive">
                              Tạm Ngưng
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Kiểm Duyệt Sản Phẩm</CardTitle>
                <CardDescription>
                  Xem xét và kiểm duyệt danh sách sản phẩm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên Sản Phẩm</TableHead>
                      <TableHead>Người Bán</TableHead>
                      <TableHead>Danh Mục</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Hành Động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.seller}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewProduct(product)}
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => handleApproveProduct(product.id)}
                              disabled={product.status === "approved"}
                              title="Phê duyệt"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectProduct(product)}
                              disabled={product.status === "rejected"}
                              title="Từ chối"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Thông Tin Người Dùng</DialogTitle>
            <DialogDescription>
              Thay đổi thông tin người dùng {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên
              </Label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Vai Trò
              </Label>
              <Select
                value={editFormData.role}
                onValueChange={(value) => handleFormChange("role", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="seller">Người Bán</SelectItem>
                  <SelectItem value="buyer">Người Mua</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Trạng Thái
              </Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) => handleFormChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt Động</SelectItem>
                  <SelectItem value="suspended">Tạm Ngưng</SelectItem>
                  <SelectItem value="pending">Đang Chờ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveUser}>
              <Save className="h-4 w-4 mr-2" />
              Lưu Thay Đổi
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Detail Dialog */}
      <Dialog
        open={isProductDetailDialogOpen}
        onOpenChange={setIsProductDetailDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi Tiết Sản Phẩm</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về sản phẩm {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Tên sản phẩm:</Label>
                <div className="col-span-3">{selectedProduct.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Người bán:</Label>
                <div className="col-span-3">{selectedProduct.seller}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Danh mục:</Label>
                <div className="col-span-3">{selectedProduct.category}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Giá:</Label>
                <div className="col-span-3 font-bold text-green-600">
                  ${selectedProduct.price}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Trạng thái:</Label>
                <div className="col-span-3">
                  {getStatusBadge(selectedProduct.status)}
                </div>
              </div>
              {selectedProduct.rejectReason && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right font-medium">
                    Lý do từ chối:
                  </Label>
                  <div className="col-span-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                    {selectedProduct.rejectReason}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsProductDetailDialogOpen(false)}
            >
              Đóng
            </Button>
            {selectedProduct && selectedProduct.status === "pending" && (
              <>
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => {
                    handleApproveProduct(selectedProduct.id);
                    setIsProductDetailDialogOpen(false);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Phê Duyệt
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsProductDetailDialogOpen(false);
                    handleRejectProduct(selectedProduct);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Từ Chối
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Product Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Từ Chối Sản Phẩm</DialogTitle>
            <DialogDescription>
              Nhập lý do từ chối sản phẩm "{selectedProduct?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rejectReason">Lý do từ chối *</Label>
              <Textarea
                id="rejectReason"
                placeholder="Nhập lý do từ chối sản phẩm này..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectReason("");
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRejectProduct}
              disabled={!rejectReason.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Xác Nhận Từ Chối
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
