"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  CreditCard,
  Star,
  MessageSquare,
  RotateCcw,
  AlertTriangle,
  ArrowLeft,
  Download,
  Share2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (user && params.id) {
      // Load order from localStorage
      const savedOrders = localStorage.getItem(`orders_${user.id}`)
      if (savedOrders) {
        const orders = JSON.parse(savedOrders)
        const foundOrder = orders.find((o: any) => o.id === params.id)
        setOrder(foundOrder)
      }
      setLoading(false)
    }
  }, [user, isLoading, params.id, router])

  if (isLoading || loading) return <div>Loading...</div>
  if (!user) return null
  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container px-4 py-16">
          <div className="text-center">
            <Package className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Không tìm thấy đơn hàng</h1>
            <p className="text-muted-foreground mb-8">Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập.</p>
            <Button asChild>
              <Link href="/orders">Quay Lại Đơn Hàng</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

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

  const handleCancelOrder = () => {
    // Update order status
    const updatedOrder = { ...order, status: "cancelled", cancelledAt: new Date().toISOString() }
    setOrder(updatedOrder)

    // Update localStorage
    const savedOrders = localStorage.getItem(`orders_${user.id}`)
    if (savedOrders) {
      const orders = JSON.parse(savedOrders)
      const updatedOrders = orders.map((o: any) => (o.id === order.id ? updatedOrder : o))
      localStorage.setItem(`orders_${user.id}`, JSON.stringify(updatedOrders))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay Lại
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Đơn hàng #{order.id}</h1>
            <p className="text-muted-foreground">Đặt ngày {formatDateTime(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Chia Sẻ
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Tải Hóa Đơn
            </Button>
          </div>
        </div>

        {/* Order Status Alert */}
        <Alert className="mb-8">
          <Package className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium">Trạng thái đơn hàng: </span>
              {getStatusBadge(order.status)} {getPaymentBadge(order.paymentStatus)}
            </div>
            <div className="text-sm text-muted-foreground">Cập nhật lần cuối: {formatDateTime(order.createdAt)}</div>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Theo Dõi Đơn Hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Đơn hàng được tạo</div>
                      <div className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</div>
                      <div className="text-sm text-muted-foreground">Đơn hàng đã được tiếp nhận và đang chờ xử lý</div>
                    </div>
                  </div>

                  {order.status !== "pending" && order.status !== "cancelled" && (
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Đơn hàng được xác nhận</div>
                        <div className="text-sm text-muted-foreground">Người bán đã xác nhận và đang chuẩn bị hàng</div>
                      </div>
                    </div>
                  )}

                  {["shipped", "delivered"].includes(order.status) && (
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Đơn hàng đang được giao</div>
                        <div className="text-sm text-muted-foreground">Mã vận đơn: GHN{order.id.slice(-6)}</div>
                        <div className="text-sm text-muted-foreground">Đơn vị vận chuyển: Giao Hàng Nhanh</div>
                      </div>
                    </div>
                  )}

                  {order.status === "delivered" && (
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Đơn hàng đã được giao</div>
                        <div className="text-sm text-muted-foreground">
                          Cảm ơn bạn đã mua hàng! Hãy đánh giá sản phẩm để giúp người mua khác.
                        </div>
                      </div>
                    </div>
                  )}

                  {order.status === "cancelled" && (
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Đơn hàng đã bị hủy</div>
                        <div className="text-sm text-muted-foreground">
                          {order.cancelledAt && formatDateTime(order.cancelledAt)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Nếu bạn đã thanh toán, số tiền sẽ được hoàn lại trong 3-5 ngày làm việc.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {order.status === "shipped" && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800 mb-2">Thông Tin Vận Chuyển</div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>Mã vận đơn: GHN{order.id.slice(-6)}</div>
                      <div>Đơn vị vận chuyển: Giao Hàng Nhanh</div>
                      <div>Dự kiến giao: 1-2 ngày làm việc</div>
                      <div>Hotline: 1900 1234</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>Sản Phẩm Đã Đặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">Người bán: {item.seller}</div>
                        <div className="text-sm text-muted-foreground">Số lượng: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                        <div className="text-sm text-muted-foreground">{formatCurrency(item.price)}/sản phẩm</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {order.status === "delivered" && (
                          <>
                            <Button size="sm" variant="outline">
                              <Star className="h-4 w-4 mr-2" />
                              Đánh Giá
                            </Button>
                            <Button size="sm" variant="outline">
                              Mua Lại
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa Chỉ Giao Hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">{order.shippingAddress.fullName}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {order.shippingAddress.phone}
                  </div>
                  <div className="text-sm text-muted-foreground">{order.shippingAddress.address}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{formatCurrency(order.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế VAT:</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Phương thức thanh toán</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"}
                  </div>
                  {getPaymentBadge(order.paymentStatus)}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Hành Động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.status === "pending" && (
                  <Button variant="destructive" className="w-full" onClick={handleCancelOrder}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Hủy Đơn Hàng
                  </Button>
                )}

                {order.status === "delivered" && (
                  <>
                    <Button variant="outline" className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      Đánh Giá Sản Phẩm
                    </Button>
                    <Button variant="outline" className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Yêu Cầu Trả Hàng
                    </Button>
                  </>
                )}

                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Liên Hệ Người Bán
                </Button>

                <Button variant="outline" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Báo Cáo Vấn Đề
                </Button>

                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Tải Hóa Đơn
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Cần Hỗ Trợ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium">Hotline hỗ trợ</div>
                    <div className="text-muted-foreground">1900 1234 (24/7)</div>
                  </div>
                  <div>
                    <div className="font-medium">Email hỗ trợ</div>
                    <div className="text-muted-foreground">support@ecommerce.com</div>
                  </div>
                  <div>
                    <div className="font-medium">Chat trực tuyến</div>
                    <div className="text-muted-foreground">8:00 - 22:00 hàng ngày</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
