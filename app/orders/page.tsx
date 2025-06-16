"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useOrders } from "@/components/order-provider"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Search,
  MapPin,
  Phone,
  CreditCard,
  RotateCcw,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const { getOrdersByBuyer, refreshOrders } = useOrders()
  const [orders, setOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    console.log("OrdersPage effect - isLoading:", isLoading, "user:", user)
    
    if (!isLoading && !user) {
      redirect("/login")
      return
    }
    
    if (user && !isLoading) {
      console.log("Loading orders for user:", user.id)
      refreshOrders()
      const userOrders = getOrdersByBuyer(user.id)
      console.log("Found orders:", userOrders.length)
      setOrders(userOrders)
      setPageLoading(false)
    }

    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log("Loading timeout reached")
      setPageLoading(false)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [user, isLoading])

  if (isLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Đang tải đơn hàng...</p>
          </div>
        </div>
      </div>
    )
  }
  if (!user) return null

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Chờ Xử Lý", className: "bg-yellow-500", icon: Clock },
      confirmed: { label: "Đã Xác Nhận", className: "bg-blue-500", icon: CheckCircle },
      processing: { label: "Đang Xử Lý", className: "bg-indigo-500", icon: Package },
      shipped: { label: "Đang Giao", className: "bg-purple-500", icon: Truck },
      delivered: { label: "Đã Giao", className: "bg-green-500", icon: CheckCircle },
      cancelled: { label: "Đã Hủy", className: "bg-red-500", icon: XCircle },
      returned: { label: "Đã Trả", className: "bg-gray-500", icon: RotateCcw },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-500",
      icon: Package,
    }
    const IconComponent = config.icon
    return (
      <Badge className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Chờ Thanh Toán", className: "bg-yellow-500" },
      paid: { label: "Đã Thanh Toán", className: "bg-green-500" },
      failed: { label: "Thất Bại", className: "bg-red-500" },
      refunded: { label: "Đã Hoàn Tiền", className: "bg-gray-500" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-500",
    }
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

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container px-4 py-16">
          <div className="text-center">
            <Package className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Chưa có đơn hàng nào</h1>
            <p className="text-muted-foreground mb-8">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
            <Button asChild>
              <Link href="/products">Khám Phá Sản Phẩm</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Đơn Hàng Của Tôi</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng Đơn Hàng</p>
                  <p className="text-2xl font-bold">{orderStats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chờ Xử Lý</p>
                  <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Đang Giao</p>
                  <p className="text-2xl font-bold text-purple-600">{orderStats.shipped}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Đã Giao</p>
                  <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
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
                    placeholder="Tìm kiếm đơn hàng, sản phẩm, người bán..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
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
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Đơn hàng #{order.id}</CardTitle>
                    <CardDescription>
                      Đặt ngày {formatDateTime(order.createdAt)} • Người bán: {order.sellerName}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.paymentStatus)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Products */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg?height=60&width=60"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">Số lượng: {item.quantity}</div>
                          <div className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center p-3 border rounded-lg bg-muted">
                        <span className="text-sm text-muted-foreground">+{order.items.length - 3} sản phẩm khác</span>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">{order.items.length} sản phẩm</div>
                      <div className="text-sm text-muted-foreground">
                        Phương thức: {order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}
                      </div>
                      {order.trackingNumber && (
                        <div className="text-sm text-muted-foreground">Mã vận đơn: {order.trackingNumber}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(order.total)}</div>
                        <div className="text-sm text-muted-foreground">Tổng cộng</div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Chi Tiết
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Chi Tiết Đơn Hàng #{selectedOrder?.id}</DialogTitle>
                              <DialogDescription>
                                Đặt ngày {selectedOrder && formatDateTime(selectedOrder.createdAt)}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Order Status */}
                                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                  <div>
                                    <div className="font-medium">Trạng thái đơn hàng</div>
                                    <div className="text-sm text-muted-foreground">
                                      Người bán: {selectedOrder.sellerName}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    {getStatusBadge(selectedOrder.status)}
                                    {getPaymentBadge(selectedOrder.paymentStatus)}
                                  </div>
                                </div>

                                {/* Products */}
                                <div>
                                  <h4 className="font-medium mb-4">Sản Phẩm Đã Đặt</h4>
                                  <div className="space-y-3">
                                    {selectedOrder.items.map((item: any) => (
                                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                        <Image
                                          src={item.image || "/placeholder.svg?height=80&width=80"}
                                          alt={item.name}
                                          width={80}
                                          height={80}
                                          className="rounded object-cover"
                                        />
                                        <div className="flex-1">
                                          <div className="font-medium">{item.name}</div>
                                          <div className="text-sm text-muted-foreground">Số lượng: {item.quantity}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-medium">
                                            {formatCurrency(item.price * item.quantity)}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {formatCurrency(item.price)}/sản phẩm
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                  <h4 className="font-medium mb-4 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Địa Chỉ Giao Hàng
                                  </h4>
                                  <div className="p-4 border rounded-lg">
                                    <div className="font-medium">{selectedOrder.shippingAddress.fullName}</div>
                                    <div className="text-sm text-muted-foreground">
                                      <Phone className="inline h-3 w-3 mr-1" />
                                      {selectedOrder.shippingAddress.phone}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.ward},{" "}
                                      {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
                                    </div>
                                  </div>
                                </div>

                                {/* Payment Summary */}
                                <div>
                                  <h4 className="font-medium mb-4 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Tóm Tắt Thanh Toán
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span>Tạm tính:</span>
                                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Phí vận chuyển:</span>
                                      <span>{formatCurrency(selectedOrder.shippingFee)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Thuế VAT:</span>
                                      <span>{formatCurrency(selectedOrder.tax)}</span>
                                    </div>
                                    <div className="border-t pt-2">
                                      <div className="flex justify-between font-bold text-lg">
                                        <span>Tổng cộng:</span>
                                        <span>{formatCurrency(selectedOrder.total)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Order Notes */}
                                {selectedOrder.orderNotes && (
                                  <div>
                                    <h4 className="font-medium mb-2">Ghi Chú Đơn Hàng</h4>
                                    <div className="p-4 bg-muted rounded-lg text-sm">{selectedOrder.orderNotes}</div>
                                  </div>
                                )}

                                {/* Seller Notes */}
                                {selectedOrder.sellerNotes && (
                                  <div>
                                    <h4 className="font-medium mb-2">Ghi Chú Từ Người Bán</h4>
                                    <div className="p-4 bg-blue-50 rounded-lg text-sm">{selectedOrder.sellerNotes}</div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            Mua Lại
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy đơn hàng</h3>
              <p className="text-muted-foreground">Không có đơn hàng nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
