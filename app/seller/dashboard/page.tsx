"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { MainNav } from "@/components/main-nav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertTriangle,
  Star,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
}

interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  createdAt: string;
  items: OrderItem[];
  orderNotes: string;
  paymentMethod: string;
  paymentStatus: string;
  sellerId: string;
  sellerName: string;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  shippingFee: number;
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

export default function SellerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State management
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });
  const [productOrder, setProductOrder] = useState<Order[]>([]);

  useEffect(() => {
    const order = localStorage.getItem("all_orders");
    if (true) {
      setProductOrder([
        {
          id: "ORD-1730123456789-abc123def",
          buyerId: "2",
          buyerName: "John Buyer",
          buyerEmail: "buyer@example.com",
          createdAt: "2025-05-31T11:25:24.759Z",
          items: [
            {
              id: "1",
              name: "Áo tứ thân",
              image: "/images/sony-headphones.jpg",
              price: 10000000,
              quantity: 1,
              sellerId: "3",
              sellerName: "Tech Store VN",
            },
          ],
          orderNotes: "",
          paymentMethod: "cod", // cash on delivery
          paymentStatus: "pending",
          sellerId: "3",
          sellerName: "Tech Store VN",
          shippingAddress: {
            fullName: "John Buyer",
            address: "123 Nguyễn Văn Cừ",
            ward: "Phường 4",
            district: "Quận 5",
            city: "TP.HCM",
            zipCode: "70000",
            phone: "0123456789",
            email: "buyer@example.com",
          },
          shippingMethod: "standard",
          shippingFee: 30000,
          subtotal: 2990000,
          tax: 0,
          total: 10000000,
          status: "confirmed",
        },
        {
          id: "ORD-1730123456789-aef456ghi",
          buyerId: "2",
          buyerName: "John Buyer",
          buyerEmail: "buyer@example.com",
          createdAt: "2025-06-02T13:07:34.759Z",
          items: [
            {
              id: "1",
              name: "Áo tứ thân",
              image: "/images/sony-headphones.jpg",
              price: 10000000,
              quantity: 2,
              sellerId: "3",
              sellerName: "Tech Store VN",
            },
          ],
          orderNotes: "",
          paymentMethod: "cod", // cash on delivery
          paymentStatus: "pending",
          sellerId: "3",
          sellerName: "Tech Store VN",
          shippingAddress: {
            fullName: "John Buyer",
            address: "123 Nguyễn Văn Cừ",
            ward: "Phường 4",
            district: "Quận 5",
            city: "TP.HCM",
            zipCode: "70000",
            phone: "0123456789",
            email: "buyer@example.com",
          },
          shippingMethod: "standard",
          shippingFee: 30000,
          subtotal: 2990000,
          tax: 0,
          total: 20000000,
          status: "pending",
        },
      ]);
    }
  }, []);

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["orders", "products", "analytics"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "seller")) {
      redirect("/login");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user?.role === "seller") {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchOrders(), fetchProducts(), fetchAnalytics()]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Lỗi khi tải dữ liệu dashboard");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchOrders = async () => {
    try {
      // Get auth token
      const token = localStorage.getItem("auth_token");
      
      const response = await fetch("/api/seller/orders", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setProductOrder(data); // Cập nhật cả productOrder để tương thích
      } else {
        console.error("Failed to fetch orders:", response.status);
        // Fallback to localStorage if API fails
        const savedOrders = localStorage.getItem("all_orders");
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          setProductOrder(parsedOrders);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Fallback to localStorage
      const savedOrders = localStorage.getItem("all_orders");
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        setProductOrder(parsedOrders);
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/seller/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  console.log("Products:", products);

  const fetchAnalytics = async () => {
    try {
      // Calculate analytics from orders and products
      const totalRevenue = orders.reduce(
        (sum, order) =>
          order.status === "delivered" ? sum + order.total : sum,
        0
      );
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.status === "pending").length;
      const lowStockProducts = products.filter((p) => p.stock < 10).length;

      setAnalytics({
        totalRevenue,
        totalOrders,
        pendingOrders,
        lowStockProducts,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        completionRate:
          totalOrders > 0
            ? (orders.filter((o) => o.status === "delivered").length /
                totalOrders) *
              100
            : 0,
      });
    } catch (error) {
      console.error("Error calculating analytics:", error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "seller") {
    return null;
  }
  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };
  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Chờ Xử Lý", className: "bg-yellow-500", icon: Clock },
      confirmed: {
        label: "Đã Xác Nhận",
        className: "bg-blue-500",
        icon: CheckCircle,
      },
      shipped: { label: "Đang Giao", className: "bg-purple-500", icon: Truck },
      delivered: {
        label: "Đã Giao",
        className: "bg-green-500",
        icon: CheckCircle,
      },
      cancelled: { label: "Đã Hủy", className: "bg-red-500", icon: XCircle },
    };

    const config =
      statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} text-white`}>
        {" "}
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };
  // Xử lý thao tác đơn hàng
  const handleOrderAction = async (orderId: string, newStatus: string) => {
    try {
      // Get auth token
      const token = localStorage.getItem("auth_token");
      
      // Call API to update order status
      const response = await fetch("/api/seller/orders", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });

      if (response.ok) {
        // Update local state
        setProductOrder(prev => 
          prev.map((order: Order) => 
            order.id === orderId 
              ? { ...order, status: newStatus as any }
              : order
          )
        );
        
        // Update orders state too
        setOrders(prev => 
          prev.map((order: any) => 
            order.id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        
        // Show success message
        const statusMessages = {
          confirmed: "Đã xác nhận đơn hàng thành công!",
          shipped: "Đã giao hàng cho đơn vị vận chuyển!",
          delivered: "Đã hoàn thành đơn hàng!",
          cancelled: "Đã hủy đơn hàng!"
        };
        
        toast.success(statusMessages[newStatus as keyof typeof statusMessages] || "Cập nhật thành công!");
      } else {
        const error = await response.json();
        toast.error(`Lỗi: ${error.error || 'Không thể cập nhật đơn hàng'}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật đơn hàng!");
    }
  };
  const handleAddProduct = async () => {
    console.log("handleAddProduct called");
    console.log("newProduct data:", newProduct);

    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
      };
      console.log("Sending payload:", payload);

      const response = await fetch("/api/seller/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        toast.success("Thêm sản phẩm thành công!");
        setIsAddProductOpen(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "",
          image: "",
        });
        fetchProducts();
      } else {
        const errorData = await response.text();
        console.error("Response error:", errorData);
        toast.error(
          `Lỗi khi thêm sản phẩm: ${response.status} ${response.statusText}`
        );
      }
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error(`Lỗi khi thêm sản phẩm: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Xóa sản phẩm thành công!");
        fetchProducts();
      } else {
        const errorData = await response.text();
        console.error("Response error:", errorData);
        toast.error(
          `Lỗi khi xóa sản phẩm: ${response.status} ${response.statusText}`
        );
      }
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(`Lỗi khi xóa sản phẩm: ${error.message}`);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without page reload
    const params = new URLSearchParams(searchParams.toString());
    if (value === "orders") {
      params.delete("tab"); // Default tab, no need to show in URL
    } else {
      params.set("tab", value);
    }

    const newUrl = params.toString()
      ? `/seller/dashboard?${params.toString()}`
      : "/seller/dashboard";
    router.push(newUrl, { scroll: false });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  console.log("Filtered Orders:", filteredOrders);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Người Bán</h1>
            <p className="text-muted-foreground">
              Quản lý đơn hàng và sản phẩm của bạn
            </p>
            {user.store_name && (
              <p className="text-sm text-muted-foreground mt-1">
                Cửa hàng: {user.store_name}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadDashboardData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Sản Phẩm
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Tên sản phẩm</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        placeholder="Nhập tên sản phẩm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Danh mục</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) =>
                          setNewProduct({ ...newProduct, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>{" "}
                        <SelectContent>
                          <SelectItem value="Điện Tử">Điện Tử</SelectItem>
                          <SelectItem value="Thời Trang">Thời Trang</SelectItem>
                          <SelectItem value="Nhà Cửa & Vườn">
                            Nhà Cửa & Vườn
                          </SelectItem>
                          <SelectItem value="Thể Thao">Thể Thao</SelectItem>
                          <SelectItem value="Sách">Sách</SelectItem>
                          <SelectItem value="Đồ Chơi">Đồ Chơi</SelectItem>
                          <SelectItem value="Làm Đẹp">Làm Đẹp</SelectItem>
                          <SelectItem value="Ô Tô & Xe Máy">
                            Ô Tô & Xe Máy
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      placeholder="Nhập mô tả sản phẩm"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Giá (VND)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: e.target.value,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Số lượng</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            stock: e.target.value,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image">URL hình ảnh</Label>
                    <Input
                      id="image"
                      value={newProduct.image}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddProductOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleAddProduct}>Thêm Sản Phẩm</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>{" "}
        {/* Management Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Đơn Hàng
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Sản Phẩm
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Phân Tích
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quản Lý Đơn Hàng</CardTitle>
                    <CardDescription>
                      Xem và xử lý đơn hàng của khách hàng
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm đơn hàng, khách hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Lọc theo trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                      <SelectItem value="shipped">Đang giao</SelectItem>
                      <SelectItem value="delivered">Đã giao</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Orders Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã Đơn</TableHead>
                      <TableHead>Khách Hàng</TableHead>
                      <TableHead>Sản Phẩm</TableHead>
                      <TableHead>Tổng Tiền</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Ngày Đặt</TableHead>
                      <TableHead>Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productOrder.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              Chưa có đơn hàng nào
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      productOrder.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            #{order.id.slice(-8)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {order.buyerName || "N/A"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {order.buyerEmail}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-48">
                              {order.items
                                ?.slice(0, 2)
                                .map((item: any, idx: number) => (
                                  <div key={idx} className="text-sm">
                                    {item.name} (x{item.quantity})
                                  </div>
                                ))}
                              {order.items?.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{order.items.length - 2} sản phẩm khác
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(order.total)}
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-sm">
                            {formatDateTime(order.createdAt)}
                          </TableCell>                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {/* Thao tác theo trạng thái */}
                              {order.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={() => handleOrderAction(order.id, "confirmed")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Xác nhận
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleOrderAction(order.id, "cancelled")}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Huỷ
                                  </Button>
                                </div>
                              )}
                              
                              {order.status === "confirmed" && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleOrderAction(order.id, "shipped")}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  <Truck className="h-4 w-4 mr-1" />
                                  Giao hàng
                                </Button>
                              )}
                              
                              {order.status === "shipped" && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleOrderAction(order.id, "delivered")}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Package className="h-4 w-4 mr-1" />
                                  Hoàn thành
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quản Lý Sản Phẩm</CardTitle>
                    <CardDescription>
                      Xem và quản lý tất cả sản phẩm của bạn
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsAddProductOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Sản Phẩm
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản Phẩm</TableHead>
                      <TableHead>Danh Mục</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Tồn Kho</TableHead>
                      <TableHead>Đã Bán</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Package className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              Chưa có sản phẩm nào
                            </p>
                            <Button onClick={() => setIsAddProductOpen(true)}>
                              Thêm sản phẩm đầu tiên
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="rounded object-cover"
                              />
                              <div>
                                <div className="font-medium">
                                  {product.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {product.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {product.category?.name || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(product.price)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.stock > 10
                                  ? "default"
                                  : product.stock > 0
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {product.stock}{" "}
                              {product.stock === 1 ? "món" : "món"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product._count?.orderItems || 0}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.stock > 0 ? "default" : "destructive"
                              }
                            >
                              {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleDeleteProduct(product.id)}
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-6">
              {/* Detailed Analytics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Doanh Thu Tháng Này
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(analytics.totalRevenue || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12.5% so với tháng trước
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Tỷ Lệ Chuyển Đổi
                    </CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.completionRate?.toFixed(1) || 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Đơn hàng hoàn thành
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Khách Hàng Mới
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        orders.filter((o) => {
                          const date = new Date(o.createdAt);
                          const now = new Date();
                          return date.getMonth() === now.getMonth();
                        }).length
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Trong tháng này
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Đánh Giá Trung Bình
                    </CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.8</div>
                    <p className="text-xs text-muted-foreground">
                      Từ {orders.length} đánh giá
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Hiệu Suất Bán Hàng</CardTitle>
                  <CardDescription>
                    Thống kê chi tiết về hoạt động bán hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground">
                          Sản phẩm bán chạy
                        </div>
                        <div className="text-2xl font-bold">
                          {products.reduce(
                            (max, p) =>
                              (p._count?.orderItems || 0) >
                              (max._count?.orderItems || 0)
                                ? p
                                : max,
                            products[0] || {}
                          )?.name || "N/A"}
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground">
                          Thời gian xử lý TB
                        </div>
                        <div className="text-2xl font-bold">2.3 giờ</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground">
                          Tỷ lệ hủy đơn
                        </div>
                        <div className="text-2xl font-bold">
                          {orders.length > 0
                            ? `${(
                                (orders.filter((o) => o.status === "cancelled")
                                  .length /
                                  orders.length) *
                                100
                              ).toFixed(1)}%`
                            : "0%"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        {/* Order Detail Dialog */}
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Chi Tiết Đơn Hàng #{selectedOrder?.id?.slice(-8)}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Thông Tin Khách Hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">Tên: </span>
                        {selectedOrder.buyerName}
                      </div>
                      <div>
                        <span className="font-medium">Email: </span>
                        {selectedOrder.buyerEmail}
                      </div>
                      <div>
                        <span className="font-medium">Trạng thái: </span>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <div>
                        <span className="font-medium">Ngày đặt: </span>
                        {formatDateTime(selectedOrder.createdAt)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Thông Tin Giao Hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedOrder.shippingAddress ? (
                        <>
                          <div>
                            <span className="font-medium">Người nhận: </span>
                            {selectedOrder.shippingAddress.fullName}
                          </div>
                          <div>
                            <span className="font-medium">SĐT: </span>
                            {selectedOrder.shippingAddress.phone}
                          </div>
                          <div>
                            <span className="font-medium">Địa chỉ: </span>
                            <div className="text-sm">
                              {selectedOrder.shippingAddress.address}
                              <br />
                              {selectedOrder.shippingAddress.ward},{" "}
                              {selectedOrder.shippingAddress.district}
                              <br />
                              {selectedOrder.shippingAddress.city}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-muted-foreground">
                          Chưa có thông tin giao hàng
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sản Phẩm Đặt Hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 border rounded-lg"
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Số lượng: {item.quantity} ×{" "}
                              {formatCurrency(item.price)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span>{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
