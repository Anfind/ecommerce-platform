"use client"

import { useAuth } from "@/components/auth-provider"
import { MainNav } from "@/components/main-nav"
import { AddProductDialog } from "@/components/seller/add-product-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Package,
  DollarSign,
  ShoppingCart,
  Plus,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Search,
  MapPin,
  Phone,
  TrendingUp,
  Loader2,
} from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export default function SellerDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [actionNote, setActionNote] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "seller")) {
      redirect("/login")
    }
  }, [user, authLoading])

  useEffect(() => {
    if (user?.role === "seller") {
      fetchOrders()
      fetchProducts()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/seller/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      toast.error("Lỗi khi tải đơn hàng")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/seller/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      toast.error("Lỗi khi tải sản phẩm")
    }
  }

  const handleOrderAction = async (orderId: string, action: string, note?: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/seller/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: action,
          note
        })
      })

      if (response.ok) {
        toast.success("Cập nhật đơn hàng thành công")
        fetchOrders()
        setSelectedOrder(null)
        setActionNote("")
      } else {
        throw new Error("Failed to update order")
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật đơn hàng")
    } finally {
      setIsUpdating(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container px-4 py-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Đang tải...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "seller") {
    return null
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Chờ Xử Lý", className: "bg-yellow-500", icon: Clock },
      confirmed: { label: "Đã Xác Nhận", className: "bg-blue-500", icon: CheckCircle },
      processing: { label: "Đang Xử Lý", className: "bg-indigo-500", icon: Package },
      shipped: { label: "Đang Giao", className: "bg-purple-500", icon: Truck },
      delivered: { label: "Đã Giao", className: "bg-green-500", icon: CheckCircle },
      cancelled: { label: "Đã Hủy", className: "bg-red-500", icon: XCircle }
    }
    
    const config = statusMap[status as keyof typeof statusMap]
    if (!config) return <Badge variant="outline">{status}</Badge>
    
    const IconComponent = config.icon
    return (
      <Badge className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Chờ Thanh Toán", className: "bg-yellow-500" },
      paid: { label: "Đã Thanh Toán", className: "bg-green-500" },
      failed: { label: "Thất Bại", className: "bg-red-500" },
      refunded: { label: "Đã Hoàn Tiền", className: "bg-gray-500" }
    }
    
    const config = statusMap[status as keyof typeof statusMap]
    if (!config) return <Badge variant="outline">{status}</Badge>
    
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const stats = {
    totalRevenue: orders
      .filter(order => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.total, 0),
    newOrders: orders.filter(order => order.status === "pending").length,
    shippingOrders: orders.filter(order => order.status === "shipped").length,
    totalOrders: orders.length
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Người Bán</h1>
            <p className="text-muted-foreground">Quản lý đơn hàng và sản phẩm của bạn</p>
            {user.store_name && <p className="text-sm text-muted-foreground mt-1">Cửa hàng: {user.store_name}</p>}
          </div>
          <AddProductDialog onProductAdded={fetchProducts} />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Từ {stats.totalOrders} đơn hàng</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đơn Hàng Mới</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newOrders}</div>
              <p className="text-xs text-muted-foreground">Cần xử lý</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang Giao Hàng</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.shippingOrders}</div>
              <p className="text-xs text-muted-foreground">Đơn hàng</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Đơn Hàng</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Tất cả</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Đơn Hàng</TabsTrigger>
            <TabsTrigger value="products">Sản Phẩm Của Tôi</TabsTrigger>
            <TabsTrigger value="analytics">Phân Tích</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Quản Lý Đơn Hàng</CardTitle>
                <CardDescription>Xem và quản lý tất cả đơn hàng của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã Đơn Hàng</TableHead>
                      <TableHead>Khách Hàng</TableHead>
                      <TableHead>Sản Phẩm</TableHead>
                      <TableHead>Tổng Tiền</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Ngày Đặt</TableHead>
                      <TableHead>Hành Động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
                        <TableCell>{order.buyerName || "N/A"}</TableCell>
                        <TableCell>
                          {order.items.map((item: any) => item.name).join(", ")}
                        </TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleOrderAction(order.id, "confirmed")}
                                disabled={isUpdating}
                              >
                                Xác Nhận
                              </Button>
                            )}
                            {order.status === "confirmed" && (
                              <Button
                                size="sm"
                                onClick={() => handleOrderAction(order.id, "shipped")}
                                disabled={isUpdating}
                              >
                                Giao Hàng
                              </Button>
                            )}
                            {order.status === "shipped" && (
                              <Button
                                size="sm"
                                onClick={() => handleOrderAction(order.id, "delivered")}
                                disabled={isUpdating}
                              >
                                Đã Giao
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
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Quản Lý Sản Phẩm</CardTitle>
                <CardDescription>Xem và quản lý tất cả sản phẩm của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên Sản Phẩm</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Tồn Kho</TableHead>
                      <TableHead>Đã Bán</TableHead>
                      <TableHead>Doanh Thu</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Hành Động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product._count?.orderItems || 0}</TableCell>
                        <TableCell>
                          {formatCurrency((product._count?.orderItems || 0) * product.price)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                            {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
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

          <TabsContent value="analytics">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tổng Doanh Thu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalRevenue)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Đơn Hàng Thành Công</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter(o => o.status === "delivered").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Đơn Hàng Đang Xử Lý</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter(o => ["pending", "confirmed", "shipped"].includes(o.status)).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tỷ Lệ Hủy Đơn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.length > 0 
                      ? `${Math.round((orders.filter(o => o.status === "cancelled").length / orders.length) * 100)}%`
                      : "0%"
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Order Detail Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi Tiết Đơn Hàng #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <p><strong>Trạng thái:</strong> {getStatusBadge(selectedOrder.status)}</p>
                    <p><strong>Khách hàng:</strong> {selectedOrder.buyerName}</p>
                    <p><strong>Email:</strong> {selectedOrder.buyerEmail}</p>
                  </div>
                  <div>
                    <p><strong>Tổng tiền:</strong> {formatCurrency(selectedOrder.total)}</p>
                    <p><strong>Ngày đặt:</strong> {formatDateTime(selectedOrder.createdAt)}</p>
                  </div>
                </div>

                {selectedOrder.shippingAddress && (
                  <div>
                    <h4 className="font-semibold mb-2">Địa chỉ giao hàng:</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>{selectedOrder.shippingAddress.fullName}</p>
                      <p>{selectedOrder.shippingAddress.phone}</p>
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>
                        {selectedOrder.shippingAddress.ward}, {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Sản phẩm:</h4>
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                      </div>
                      <p>{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {selectedOrder.status === "pending" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                      <Textarea
                        id="note"
                        value={actionNote}
                        onChange={(e) => setActionNote(e.target.value)}
                        placeholder="Thêm ghi chú cho đơn hàng..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleOrderAction(selectedOrder.id, "confirmed", actionNote)}
                        disabled={isUpdating}
                      >
                        {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Xác Nhận Đơn Hàng
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleOrderAction(selectedOrder.id, "cancelled", actionNote || "Đơn hàng bị từ chối")}
                        disabled={isUpdating}
                      >
                        {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Từ Chối
                      </Button>
                    </div>
                  </div>
                )}

                {selectedOrder.status === "confirmed" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="shipping-note">Thông tin vận chuyển</Label>
                      <Textarea
                        id="shipping-note"
                        value={actionNote}
                        onChange={(e) => setActionNote(e.target.value)}
                        placeholder="Thêm thông tin vận chuyển..."
                      />
                    </div>
                    <Button
                      onClick={() => handleOrderAction(selectedOrder.id, "shipped", actionNote)}
                      disabled={isUpdating}
                    >
                      {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Giao Cho Vận Chuyển
                    </Button>
                  </div>
                )}

                {selectedOrder.status === "shipped" && (
                  <Button
                    onClick={() => handleOrderAction(selectedOrder.id, "delivered")}
                    disabled={isUpdating}
                  >
                    {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Xác Nhận Đã Giao
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
