"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingCart,
  Search,
  Eye,
  Truck,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package,
  MapPin,
  Phone,
  FileText,
  Download,
  RefreshCw,
  MessageSquare,
  Edit,
  TrendingUp,
  Users,
} from "lucide-react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { useEffect } from "react"

const mockOrders = [
  {
    id: "ORD-2024-001",
    customerName: "Nguyễn Văn An",
    customerEmail: "an.nguyen@example.com",
    customerPhone: "0901234567",
    customerAvatar: "/placeholder.svg?height=40&width=40",
    sellerName: "Apple Store VN",
    sellerId: 2,
    sellerAvatar: "/placeholder.svg?height=40&width=40",
    products: [
      {
        id: 1,
        name: "iPhone 15 Pro Max 256GB",
        image: "/placeholder.svg?height=60&width=60",
        quantity: 1,
        price: 29990000,
        sku: "IP15PM-256-TI",
      },
    ],
    subtotal: 29990000,
    shippingFee: 0,
    tax: 2999000,
    discount: 1000000,
    total: 31989000,
    status: "pending",
    paymentStatus: "paid",
    paymentMethod: "credit_card",
    paymentId: "PAY-123456789",
    shippingAddress: {
      fullName: "Nguyễn Văn An",
      phone: "0901234567",
      address: "123 Nguyễn Huệ",
      ward: "Phường Bến Nghé",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
      zipCode: "70000",
    },
    orderDate: "2024-03-20T10:30:00Z",
    confirmedDate: null,
    shippedDate: null,
    deliveredDate: null,
    estimatedDelivery: "2024-03-25",
    trackingNumber: null,
    shippingProvider: null,
    notes: "Giao hàng trong giờ hành chính",
    adminNotes: "",
    priority: "normal",
    source: "web",
    commission: 2999000,
    refundAmount: 0,
    refundReason: "",
  },
  {
    id: "ORD-2024-002",
    customerName: "Trần Thị Bình",
    customerEmail: "binh.tran@example.com",
    customerPhone: "0912345678",
    customerAvatar: "/placeholder.svg?height=40&width=40",
    sellerName: "Samsung Official Store",
    sellerId: 3,
    sellerAvatar: "/placeholder.svg?height=40&width=40",
    products: [
      {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        image: "/placeholder.svg?height=60&width=60",
        quantity: 1,
        price: 26990000,
        sku: "SGS24U-512-BK",
      },
      {
        id: 3,
        name: "Galaxy Buds Pro 2",
        image: "/placeholder.svg?height=60&width=60",
        quantity: 1,
        price: 4990000,
        sku: "GBP2-WH",
      },
    ],
    subtotal: 31980000,
    shippingFee: 50000,
    tax: 3198000,
    discount: 500000,
    total: 34728000,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    paymentId: "TXN-987654321",
    shippingAddress: {
      fullName: "Trần Thị Bình",
      phone: "0912345678",
      address: "456 Lê Lợi",
      ward: "Phường 8",
      district: "Quận 3",
      city: "TP. Hồ Chí Minh",
      zipCode: "70000",
    },
    orderDate: "2024-03-18T14:20:00Z",
    confirmedDate: "2024-03-18T15:00:00Z",
    shippedDate: "2024-03-19T09:00:00Z",
    deliveredDate: null,
    estimatedDelivery: "2024-03-23",
    trackingNumber: "VN123456789",
    shippingProvider: "Giao Hàng Nhanh",
    notes: "Giao hàng buổi chiều",
    adminNotes: "Đơn hàng ưu tiên",
    priority: "high",
    source: "mobile",
    commission: 3198000,
    refundAmount: 0,
    refundReason: "",
  },
  {
    id: "ORD-2024-003",
    customerName: "Lê Văn Cường",
    customerEmail: "cuong.le@example.com",
    customerPhone: "0923456789",
    customerAvatar: "/placeholder.svg?height=40&width=40",
    sellerName: "TechStore Pro",
    sellerId: 4,
    sellerAvatar: "/placeholder.svg?height=40&width=40",
    products: [
      {
        id: 4,
        name: "MacBook Air M3 13 inch",
        image: "/placeholder.svg?height=60&width=60",
        quantity: 1,
        price: 28990000,
        sku: "MBA-M3-13-SG",
      },
    ],
    subtotal: 28990000,
    shippingFee: 0,
    tax: 2899000,
    discount: 0,
    total: 31889000,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "cod",
    paymentId: "COD-456789123",
    shippingAddress: {
      fullName: "Lê Văn Cường",
      phone: "0923456789",
      address: "789 Võ Văn Tần",
      ward: "Phường 6",
      district: "Quận 3",
      city: "TP. Hồ Chí Minh",
      zipCode: "70000",
    },
    orderDate: "2024-03-15T11:45:00Z",
    confirmedDate: "2024-03-15T12:00:00Z",
    shippedDate: "2024-03-16T08:30:00Z",
    deliveredDate: "2024-03-18T16:20:00Z",
    estimatedDelivery: "2024-03-20",
    trackingNumber: "VN987654321",
    shippingProvider: "Viettel Post",
    notes: "",
    adminNotes: "Giao hàng thành công",
    priority: "normal",
    source: "web",
    commission: 2899000,
    refundAmount: 0,
    refundReason: "",
  },
  {
    id: "ORD-2024-004",
    customerName: "Phạm Thị Dung",
    customerEmail: "dung.pham@example.com",
    customerPhone: "0934567890",
    customerAvatar: "/placeholder.svg?height=40&width=40",
    sellerName: "Fashion Hub VN",
    sellerId: 5,
    sellerAvatar: "/placeholder.svg?height=40&width=40",
    products: [
      {
        id: 5,
        name: "Áo sơ mi nam cao cấp",
        image: "/placeholder.svg?height=60&width=60",
        quantity: 2,
        price: 299000,
        sku: "SM-NAM-001",
      },
      {
        id: 6,
        name: "Quần jeans slim fit",
        image: "/placeholder.svg?height=60&width=60",
        quantity: 1,
        price: 599000,
        sku: "QJ-SLIM-002",
      },
    ],
    subtotal: 1197000,
    shippingFee: 30000,
    tax: 119700,
    discount: 100000,
    total: 1246700,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "credit_card",
    paymentId: "PAY-789123456",
    shippingAddress: {
      fullName: "Phạm Thị Dung",
      phone: "0934567890",
      address: "321 Hai Bà Trưng",
      ward: "Phường Đa Kao",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
      zipCode: "70000",
    },
    orderDate: "2024-03-17T09:15:00Z",
    confirmedDate: "2024-03-17T10:00:00Z",
    shippedDate: null,
    deliveredDate: null,
    estimatedDelivery: null,
    trackingNumber: null,
    shippingProvider: null,
    notes: "",
    adminNotes: "Khách hàng hủy do thay đổi ý định",
    priority: "normal",
    source: "mobile",
    commission: 0,
    refundAmount: 1246700,
    refundReason: "Khách hàng thay đổi ý định",
    cancelledDate: "2024-03-17T16:30:00Z",
    cancelledBy: "customer",
  },
  {
    id: "ORD-2024-005",
    customerName: "Hoàng Văn Em",
    customerEmail: "em.hoang@example.com",
    customerPhone: "0945678901",
    customerAvatar: "/placeholder.svg?height=40&width=40",
    sellerName: "Electronics Hub",
    sellerId: 6,
    sellerAvatar: "/placeholder.svg?height=40&width=40",
    products: [
      {
        id: 7,
        name: "Sony WH-1000XM5 Wireless",
        image: "/placeholder.svg?height=60&width=60",
        quantity: 1,
        price: 7990000,
        sku: "SONY-WH1000XM5",
      },
    ],
    subtotal: 7990000,
    shippingFee: 25000,
    tax: 799000,
    discount: 200000,
    total: 8614000,
    status: "dispute",
    paymentStatus: "paid",
    paymentMethod: "e_wallet",
    paymentId: "WALLET-123789456",
    shippingAddress: {
      fullName: "Hoàng Văn Em",
      phone: "0945678901",
      address: "654 Nguyễn Thị Minh Khai",
      ward: "Phường 5",
      district: "Quận 3",
      city: "TP. Hồ Chí Minh",
      zipCode: "70000",
    },
    orderDate: "2024-03-16T13:20:00Z",
    confirmedDate: "2024-03-16T14:00:00Z",
    shippedDate: "2024-03-17T10:15:00Z",
    deliveredDate: "2024-03-19T15:45:00Z",
    estimatedDelivery: "2024-03-21",
    trackingNumber: "VN456789123",
    shippingProvider: "J&T Express",
    notes: "",
    adminNotes: "Khách hàng khiếu nại sản phẩm",
    priority: "urgent",
    source: "web",
    commission: 799000,
    refundAmount: 0,
    refundReason: "",
    disputeReason: "Sản phẩm không đúng mô tả, có vết xước",
    disputeDate: "2024-03-20T09:00:00Z",
    disputeStatus: "investigating",
  },
]

export default function AdminOrdersPage() {
  const { user, isLoading } = useAuth()
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [actionType, setActionType] = useState<string>("")
  const [actionNote, setActionNote] = useState("")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      redirect("/login")
    }
  }, [user, isLoading])

  if (isLoading) return <div>Loading...</div>
  if (!user || user.role !== "admin") return null

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPayment && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Chờ Xử Lý", className: "bg-yellow-500" },
      confirmed: { label: "Đã Xác Nhận", className: "bg-blue-500" },
      processing: { label: "Đang Xử Lý", className: "bg-indigo-500" },
      shipped: { label: "Đang Giao", className: "bg-purple-500" },
      delivered: { label: "Đã Giao", className: "bg-green-500" },
      cancelled: { label: "Đã Hủy", className: "bg-red-500" },
      dispute: { label: "Tranh Chấp", className: "bg-orange-500" },
      returned: { label: "Đã Trả", className: "bg-gray-500" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: "bg-gray-500" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getPaymentBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Chờ Thanh Toán", className: "bg-yellow-500" },
      paid: { label: "Đã Thanh Toán", className: "bg-green-500" },
      failed: { label: "Thất Bại", className: "bg-red-500" },
      refunded: { label: "Đã Hoàn Tiền", className: "bg-gray-500" },
      partial_refund: { label: "Hoàn Một Phần", className: "bg-orange-500" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: "bg-gray-500" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Thấp", className: "bg-gray-500" },
      normal: { label: "Bình Thường", className: "bg-blue-500" },
      high: { label: "Cao", className: "bg-orange-500" },
      urgent: { label: "Khẩn Cấp", className: "bg-red-500" },
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig] || {
      label: priority,
      className: "bg-gray-500",
    }
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const handleOrderAction = (orderId: string, action: string, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order }
          const now = new Date().toISOString()

          switch (action) {
            case "confirm":
              updatedOrder.status = "confirmed"
              updatedOrder.confirmedDate = now
              break
            case "ship":
              updatedOrder.status = "shipped"
              updatedOrder.shippedDate = now
              updatedOrder.trackingNumber = `VN${Date.now()}`
              updatedOrder.shippingProvider = "Giao Hàng Nhanh"
              break
            case "deliver":
              updatedOrder.status = "delivered"
              updatedOrder.deliveredDate = now
              break
            case "cancel":
              updatedOrder.status = "cancelled"
              updatedOrder.cancelledDate = now
              updatedOrder.cancelledBy = "admin"
              break
            case "refund":
              updatedOrder.paymentStatus = "refunded"
              updatedOrder.refundAmount = order.total
              updatedOrder.refundReason = note || "Hoàn tiền theo yêu cầu"
              break
            case "resolve_dispute":
              updatedOrder.status = "delivered"
              updatedOrder.disputeStatus = "resolved"
              break
          }

          if (note) {
            updatedOrder.adminNotes = note
          }

          return updatedOrder
        }
        return order
      }),
    )
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

  // Statistics
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const shippedOrders = orders.filter((o) => o.status === "shipped").length
  const disputeOrders = orders.filter((o) => o.status === "dispute").length
  const totalRevenue = orders.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0)
  const totalCommission = orders.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.commission, 0)

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Quản Lý Đơn Hàng</h1>
            <p className="text-muted-foreground">Theo dõi và quản lý tất cả đơn hàng trên nền tảng</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm Mới
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng Đơn Hàng</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chờ Xử Lý</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
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
                  <p className="text-2xl font-bold text-purple-600">{shippedOrders}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tranh Chấp</p>
                  <p className="text-2xl font-bold text-orange-600">{disputeOrders}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng Doanh Thu</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hoa Hồng</p>
                  <p className="text-lg font-bold text-indigo-600">{formatCurrency(totalCommission)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm đơn hàng, khách hàng, mã vận đơn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="shipped">Đang giao</SelectItem>
                  <SelectItem value="delivered">Đã giao</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                  <SelectItem value="dispute">Tranh chấp</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thanh toán</SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                  <SelectItem value="pending">Chờ thanh toán</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                  <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả mức độ</SelectItem>
                  <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="normal">Bình thường</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thời gian</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Đơn Hàng</CardTitle>
            <CardDescription>Hiển thị {filteredOrders.length} đơn hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Đơn Hàng</TableHead>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>Người Bán</TableHead>
                  <TableHead>Sản Phẩm</TableHead>
                  <TableHead>Tổng Tiền</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Ưu Tiên</TableHead>
                  <TableHead>Ngày Đặt</TableHead>
                  <TableHead>Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.id}</div>
                        {order.trackingNumber && (
                          <div className="text-sm text-muted-foreground">
                            <Truck className="inline h-3 w-3 mr-1" />
                            {order.trackingNumber}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">{order.shippingProvider}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={order.customerAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{order.customerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                          <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={order.sellerAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{order.sellerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{order.sellerName}</div>
                          <div className="text-sm text-muted-foreground">ID: {order.sellerId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {order.products.slice(0, 3).map((product, index) => (
                            <Image
                              key={index}
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={32}
                              height={32}
                              className="rounded border-2 border-background"
                            />
                          ))}
                        </div>
                        <div>
                          <div className="font-medium">{order.products.length} sản phẩm</div>
                          <div className="text-sm text-muted-foreground">
                            {order.products.reduce((sum, p) => sum + p.quantity, 0)} món
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatCurrency(order.total)}</div>
                        <div className="text-sm text-muted-foreground">HH: {formatCurrency(order.commission)}</div>
                        {getPaymentBadge(order.paymentStatus)}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDateTime(order.orderDate)}</div>
                        {order.estimatedDelivery && (
                          <div className="text-muted-foreground">
                            Dự kiến: {new Date(order.estimatedDelivery).toLocaleDateString("vi-VN")}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-4">
                                Chi Tiết Đơn Hàng #{selectedOrder?.id}
                                <div className="flex gap-2">
                                  {selectedOrder && getStatusBadge(selectedOrder.status)}
                                  {selectedOrder && getPaymentBadge(selectedOrder.paymentStatus)}
                                  {selectedOrder && getPriorityBadge(selectedOrder.priority)}
                                </div>
                              </DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="details">Chi Tiết</TabsTrigger>
                                  <TabsTrigger value="timeline">Lịch Sử</TabsTrigger>
                                  <TabsTrigger value="payment">Thanh Toán</TabsTrigger>
                                  <TabsTrigger value="actions">Hành Động</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-6">
                                  {/* Order Info */}
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                          <Users className="h-5 w-5" />
                                          Thông Tin Khách Hàng
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3">
                                          <Avatar className="h-12 w-12">
                                            <AvatarImage src={selectedOrder.customerAvatar || "/placeholder.svg"} />
                                            <AvatarFallback>{selectedOrder.customerName.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <div className="font-semibold">{selectedOrder.customerName}</div>
                                            <div className="text-sm text-muted-foreground">
                                              {selectedOrder.customerEmail}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{selectedOrder.customerPhone}</span>
                                          </div>
                                          <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div className="text-sm">
                                              <div className="font-medium">
                                                {selectedOrder.shippingAddress.fullName}
                                              </div>
                                              <div>{selectedOrder.shippingAddress.address}</div>
                                              <div>
                                                {selectedOrder.shippingAddress.ward},{" "}
                                                {selectedOrder.shippingAddress.district}
                                              </div>
                                              <div>
                                                {selectedOrder.shippingAddress.city}{" "}
                                                {selectedOrder.shippingAddress.zipCode}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                          <Package className="h-5 w-5" />
                                          Thông Tin Người Bán
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3">
                                          <Avatar className="h-12 w-12">
                                            <AvatarImage src={selectedOrder.sellerAvatar || "/placeholder.svg"} />
                                            <AvatarFallback>{selectedOrder.sellerName.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <div className="font-semibold">{selectedOrder.sellerName}</div>
                                            <div className="text-sm text-muted-foreground">
                                              ID: {selectedOrder.sellerId}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Nguồn đơn hàng:</span>
                                            <span className="text-sm capitalize">{selectedOrder.source}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                              Phương thức thanh toán:
                                            </span>
                                            <span className="text-sm capitalize">
                                              {selectedOrder.paymentMethod.replace("_", " ")}
                                            </span>
                                          </div>
                                          {selectedOrder.trackingNumber && (
                                            <div className="flex justify-between">
                                              <span className="text-sm text-muted-foreground">Mã vận đơn:</span>
                                              <span className="text-sm font-mono">{selectedOrder.trackingNumber}</span>
                                            </div>
                                          )}
                                          {selectedOrder.shippingProvider && (
                                            <div className="flex justify-between">
                                              <span className="text-sm text-muted-foreground">Đơn vị vận chuyển:</span>
                                              <span className="text-sm">{selectedOrder.shippingProvider}</span>
                                            </div>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Products */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Sản Phẩm Đặt Hàng</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Sản Phẩm</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Số Lượng</TableHead>
                                            <TableHead>Đơn Giá</TableHead>
                                            <TableHead>Thành Tiền</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedOrder.products.map((product: any, index: number) => (
                                            <TableRow key={index}>
                                              <TableCell>
                                                <div className="flex items-center gap-3">
                                                  <Image
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    width={50}
                                                    height={50}
                                                    className="rounded object-cover"
                                                  />
                                                  <div>
                                                    <div className="font-medium">{product.name}</div>
                                                  </div>
                                                </div>
                                              </TableCell>
                                              <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                                              <TableCell>{product.quantity}</TableCell>
                                              <TableCell>{formatCurrency(product.price)}</TableCell>
                                              <TableCell>{formatCurrency(product.price * product.quantity)}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>

                                      <Separator className="my-4" />

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
                                          <span>Thuế:</span>
                                          <span>{formatCurrency(selectedOrder.tax)}</span>
                                        </div>
                                        {selectedOrder.discount > 0 && (
                                          <div className="flex justify-between text-green-600">
                                            <span>Giảm giá:</span>
                                            <span>-{formatCurrency(selectedOrder.discount)}</span>
                                          </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between text-lg font-semibold">
                                          <span>Tổng cộng:</span>
                                          <span>{formatCurrency(selectedOrder.total)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                          <span>Hoa hồng nền tảng:</span>
                                          <span>{formatCurrency(selectedOrder.commission)}</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Notes */}
                                  {(selectedOrder.notes ||
                                    selectedOrder.adminNotes ||
                                    selectedOrder.disputeReason ||
                                    selectedOrder.refundReason) && (
                                    <Card>
                                      <CardHeader>
                                        <CardTitle>Ghi Chú & Vấn Đề</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        {selectedOrder.notes && (
                                          <div className="p-4 bg-blue-50 rounded-lg">
                                            <span className="text-sm font-medium text-blue-800">
                                              Ghi chú khách hàng:
                                            </span>
                                            <p className="text-sm text-blue-700 mt-1">{selectedOrder.notes}</p>
                                          </div>
                                        )}
                                        {selectedOrder.adminNotes && (
                                          <div className="p-4 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-800">Ghi chú admin:</span>
                                            <p className="text-sm text-gray-700 mt-1">{selectedOrder.adminNotes}</p>
                                          </div>
                                        )}
                                        {selectedOrder.disputeReason && (
                                          <div className="p-4 bg-orange-50 rounded-lg">
                                            <span className="text-sm font-medium text-orange-800">
                                              Lý do tranh chấp:
                                            </span>
                                            <p className="text-sm text-orange-700 mt-1">
                                              {selectedOrder.disputeReason}
                                            </p>
                                          </div>
                                        )}
                                        {selectedOrder.refundReason && (
                                          <div className="p-4 bg-red-50 rounded-lg">
                                            <span className="text-sm font-medium text-red-800">Lý do hoàn tiền:</span>
                                            <p className="text-sm text-red-700 mt-1">{selectedOrder.refundReason}</p>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  )}
                                </TabsContent>

                                <TabsContent value="timeline" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Lịch Sử Đơn Hàng</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                          <div className="flex-1">
                                            <div className="font-medium">Đơn hàng được tạo</div>
                                            <div className="text-sm text-muted-foreground">
                                              {formatDateTime(selectedOrder.orderDate)}
                                            </div>
                                          </div>
                                        </div>

                                        {selectedOrder.confirmedDate && (
                                          <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div className="flex-1">
                                              <div className="font-medium">Đơn hàng được xác nhận</div>
                                              <div className="text-sm text-muted-foreground">
                                                {formatDateTime(selectedOrder.confirmedDate)}
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {selectedOrder.shippedDate && (
                                          <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <div className="flex-1">
                                              <div className="font-medium">Đơn hàng được giao cho vận chuyển</div>
                                              <div className="text-sm text-muted-foreground">
                                                {formatDateTime(selectedOrder.shippedDate)}
                                              </div>
                                              {selectedOrder.trackingNumber && (
                                                <div className="text-sm text-muted-foreground">
                                                  Mã vận đơn: {selectedOrder.trackingNumber}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        {selectedOrder.deliveredDate && (
                                          <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            <div className="flex-1">
                                              <div className="font-medium">Đơn hàng đã được giao</div>
                                              <div className="text-sm text-muted-foreground">
                                                {formatDateTime(selectedOrder.deliveredDate)}
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {selectedOrder.cancelledDate && (
                                          <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <div className="flex-1">
                                              <div className="font-medium">Đơn hàng đã bị hủy</div>
                                              <div className="text-sm text-muted-foreground">
                                                {formatDateTime(selectedOrder.cancelledDate)}
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                Hủy bởi:{" "}
                                                {selectedOrder.cancelledBy === "customer" ? "Khách hàng" : "Admin"}
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {selectedOrder.disputeDate && (
                                          <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                            <div className="flex-1">
                                              <div className="font-medium">Tranh chấp được tạo</div>
                                              <div className="text-sm text-muted-foreground">
                                                {formatDateTime(selectedOrder.disputeDate)}
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                Trạng thái: {selectedOrder.disputeStatus}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                <TabsContent value="payment" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Thông Tin Thanh Toán</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <span className="text-sm text-muted-foreground">Phương thức:</span>
                                          <div className="font-medium capitalize">
                                            {selectedOrder.paymentMethod.replace("_", " ")}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-sm text-muted-foreground">Mã giao dịch:</span>
                                          <div className="font-mono text-sm">{selectedOrder.paymentId}</div>
                                        </div>
                                        <div>
                                          <span className="text-sm text-muted-foreground">Trạng thái:</span>
                                          <div>{getPaymentBadge(selectedOrder.paymentStatus)}</div>
                                        </div>
                                        <div>
                                          <span className="text-sm text-muted-foreground">Tổng tiền:</span>
                                          <div className="font-semibold">{formatCurrency(selectedOrder.total)}</div>
                                        </div>
                                      </div>

                                      {selectedOrder.refundAmount > 0 && (
                                        <div className="p-4 bg-red-50 rounded-lg">
                                          <div className="font-medium text-red-800">Thông Tin Hoàn Tiền</div>
                                          <div className="text-sm text-red-700 mt-2">
                                            <div>Số tiền hoàn: {formatCurrency(selectedOrder.refundAmount)}</div>
                                            <div>Lý do: {selectedOrder.refundReason}</div>
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                <TabsContent value="actions" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Hành Động Quản Lý</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        {selectedOrder.status === "pending" && (
                                          <>
                                            <Button
                                              onClick={() => handleOrderAction(selectedOrder.id, "confirm")}
                                              className="w-full"
                                            >
                                              <CheckCircle className="mr-2 h-4 w-4" />
                                              Xác Nhận Đơn Hàng
                                            </Button>
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button variant="destructive" className="w-full">
                                                  <XCircle className="mr-2 h-4 w-4" />
                                                  Hủy Đơn Hàng
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent>
                                                <DialogHeader>
                                                  <DialogTitle>Hủy Đơn Hàng</DialogTitle>
                                                  <DialogDescription>
                                                    Vui lòng nhập lý do hủy đơn hàng
                                                  </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                  <Textarea
                                                    placeholder="Lý do hủy đơn hàng..."
                                                    value={actionNote}
                                                    onChange={(e) => setActionNote(e.target.value)}
                                                  />
                                                  <div className="flex justify-end gap-2">
                                                    <Button variant="outline">Hủy</Button>
                                                    <Button
                                                      variant="destructive"
                                                      onClick={() => {
                                                        handleOrderAction(selectedOrder.id, "cancel", actionNote)
                                                        setActionNote("")
                                                      }}
                                                    >
                                                      Xác Nhận Hủy
                                                    </Button>
                                                  </div>
                                                </div>
                                              </DialogContent>
                                            </Dialog>
                                          </>
                                        )}

                                        {selectedOrder.status === "confirmed" && (
                                          <Button
                                            onClick={() => handleOrderAction(selectedOrder.id, "ship")}
                                            className="w-full"
                                          >
                                            <Truck className="mr-2 h-4 w-4" />
                                            Giao Cho Vận Chuyển
                                          </Button>
                                        )}

                                        {selectedOrder.status === "shipped" && (
                                          <Button
                                            onClick={() => handleOrderAction(selectedOrder.id, "deliver")}
                                            className="w-full"
                                          >
                                            <Package className="mr-2 h-4 w-4" />
                                            Xác Nhận Đã Giao
                                          </Button>
                                        )}

                                        {selectedOrder.status === "dispute" && (
                                          <>
                                            <Button
                                              onClick={() => handleOrderAction(selectedOrder.id, "resolve_dispute")}
                                              className="w-full"
                                            >
                                              <CheckCircle className="mr-2 h-4 w-4" />
                                              Giải Quyết Tranh Chấp
                                            </Button>
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                  <DollarSign className="mr-2 h-4 w-4" />
                                                  Hoàn Tiền
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent>
                                                <DialogHeader>
                                                  <DialogTitle>Hoàn Tiền</DialogTitle>
                                                  <DialogDescription>
                                                    Xác nhận hoàn tiền cho khách hàng
                                                  </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                  <div>
                                                    <Label>Số tiền hoàn</Label>
                                                    <Input
                                                      type="number"
                                                      defaultValue={selectedOrder.total}
                                                      max={selectedOrder.total}
                                                    />
                                                  </div>
                                                  <div>
                                                    <Label>Lý do hoàn tiền</Label>
                                                    <Textarea
                                                      placeholder="Lý do hoàn tiền..."
                                                      value={actionNote}
                                                      onChange={(e) => setActionNote(e.target.value)}
                                                    />
                                                  </div>
                                                  <div className="flex justify-end gap-2">
                                                    <Button variant="outline">Hủy</Button>
                                                    <Button
                                                      onClick={() => {
                                                        handleOrderAction(selectedOrder.id, "refund", actionNote)
                                                        setActionNote("")
                                                      }}
                                                    >
                                                      Xác Nhận Hoàn Tiền
                                                    </Button>
                                                  </div>
                                                </div>
                                              </DialogContent>
                                            </Dialog>
                                          </>
                                        )}

                                        <Button variant="outline" className="w-full">
                                          <MessageSquare className="mr-2 h-4 w-4" />
                                          Liên Hệ Khách Hàng
                                        </Button>

                                        <Button variant="outline" className="w-full">
                                          <MessageSquare className="mr-2 h-4 w-4" />
                                          Liên Hệ Người Bán
                                        </Button>

                                        <Button variant="outline" className="w-full">
                                          <FileText className="mr-2 h-4 w-4" />
                                          Xuất Hóa Đơn
                                        </Button>

                                        <Button variant="outline" className="w-full">
                                          <Edit className="mr-2 h-4 w-4" />
                                          Chỉnh Sửa Đơn Hàng
                                        </Button>
                                      </div>

                                      <Separator />

                                      <div>
                                        <Label>Ghi Chú Admin</Label>
                                        <Textarea
                                          placeholder="Thêm ghi chú cho đơn hàng này..."
                                          value={actionNote}
                                          onChange={(e) => setActionNote(e.target.value)}
                                        />
                                        <Button className="mt-2" size="sm">
                                          Lưu Ghi Chú
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* Quick Actions */}
                        {order.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleOrderAction(order.id, "confirm")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}

                        {order.status === "confirmed" && (
                          <Button size="sm" onClick={() => handleOrderAction(order.id, "ship")}>
                            <Truck className="h-4 w-4" />
                          </Button>
                        )}

                        {order.status === "dispute" && (
                          <Button size="sm" variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
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
  )
}
