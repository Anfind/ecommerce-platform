"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign, Users, Package, ShoppingCart, Calendar, BarChart3, PieChart } from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect } from "react"

// Mock analytics data
const analyticsData = {
  overview: {
    totalRevenue: 2450000000,
    revenueGrowth: 12.5,
    totalOrders: 15420,
    ordersGrowth: 8.3,
    totalUsers: 45230,
    usersGrowth: 15.2,
    totalProducts: 8940,
    productsGrowth: 5.7,
  },
  revenueByMonth: [
    { month: "Jan", revenue: 180000000, orders: 1200 },
    { month: "Feb", revenue: 195000000, orders: 1350 },
    { month: "Mar", revenue: 220000000, orders: 1500 },
    { month: "Apr", revenue: 205000000, orders: 1400 },
    { month: "May", revenue: 240000000, orders: 1650 },
    { month: "Jun", revenue: 260000000, orders: 1800 },
  ],
  topCategories: [
    { name: "Điện Tử", revenue: 980000000, percentage: 40 },
    { name: "Thời Trang", revenue: 490000000, percentage: 20 },
    { name: "Nhà Cửa", revenue: 367500000, percentage: 15 },
    { name: "Thể Thao", revenue: 245000000, percentage: 10 },
    { name: "Sách", revenue: 122500000, percentage: 5 },
    { name: "Khác", revenue: 245000000, percentage: 10 },
  ],
  topSellers: [
    { name: "Apple Store VN", revenue: 450000000, orders: 2500, rating: 4.9 },
    { name: "Samsung Official", revenue: 380000000, orders: 2100, rating: 4.8 },
    { name: "TechStore Pro", revenue: 320000000, orders: 1800, rating: 4.7 },
    { name: "Fashion Hub", revenue: 280000000, orders: 1600, rating: 4.6 },
    { name: "Electronics World", revenue: 250000000, orders: 1400, rating: 4.5 },
  ],
  userActivity: {
    dailyActiveUsers: 12500,
    weeklyActiveUsers: 35000,
    monthlyActiveUsers: 45230,
    averageSessionTime: "8m 32s",
    bounceRate: 35.2,
    conversionRate: 3.8,
  },
  paymentMethods: [
    { method: "Thẻ tín dụng", percentage: 45, amount: 1102500000 },
    { method: "Chuyển khoản", percentage: 30, amount: 735000000 },
    { method: "Ví điện tử", percentage: 20, amount: 490000000 },
    { method: "COD", percentage: 5, amount: 122500000 },
  ],
}

export default function AdminAnalyticsPage() {
  const { user, isLoading } = useAuth()
  const [timeRange, setTimeRange] = useState("6months")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      redirect("/login")
    }
  }, [user, isLoading])

  if (isLoading) return <div>Loading...</div>
  if (!user || user.role !== "admin") return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num)
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Phân Tích & Báo Cáo</h1>
            <p className="text-muted-foreground">Thống kê chi tiết về hoạt động kinh doanh</p>
          </div>
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 ngày qua</SelectItem>
                <SelectItem value="30days">30 ngày qua</SelectItem>
                <SelectItem value="3months">3 tháng qua</SelectItem>
                <SelectItem value="6months">6 tháng qua</SelectItem>
                <SelectItem value="1year">1 năm qua</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Xuất Báo Cáo
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
            <TabsTrigger value="revenue">Doanh Thu</TabsTrigger>
            <TabsTrigger value="users">Người Dùng</TabsTrigger>
            <TabsTrigger value="products">Sản Phẩm</TabsTrigger>
            <TabsTrigger value="sellers">Người Bán</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tổng Doanh Thu</p>
                      <p className="text-2xl font-bold">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600">+{analyticsData.overview.revenueGrowth}%</span>
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tổng Đơn Hàng</p>
                      <p className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalOrders)}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-sm text-blue-600">+{analyticsData.overview.ordersGrowth}%</span>
                      </div>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tổng Người Dùng</p>
                      <p className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalUsers)}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
                        <span className="text-sm text-purple-600">+{analyticsData.overview.usersGrowth}%</span>
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tổng Sản Phẩm</p>
                      <p className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalProducts)}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-orange-600 mr-1" />
                        <span className="text-sm text-orange-600">+{analyticsData.overview.productsGrowth}%</span>
                      </div>
                    </div>
                    <Package className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Doanh Thu Theo Tháng</CardTitle>
                  <CardDescription>Biểu đồ doanh thu 6 tháng gần nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end justify-between gap-2">
                    {analyticsData.revenueByMonth.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className="w-full bg-blue-500 rounded-t-md min-h-[20px] flex items-end justify-center text-white text-xs font-medium"
                          style={{
                            height: `${(data.revenue / Math.max(...analyticsData.revenueByMonth.map((d) => d.revenue))) * 250}px`,
                          }}
                        >
                          {formatCurrency(data.revenue).slice(0, -2)}
                        </div>
                        <div className="mt-2 text-sm font-medium">{data.month}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh Mục Bán Chạy</CardTitle>
                  <CardDescription>Doanh thu theo danh mục sản phẩm</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full bg-blue-500"
                            style={{
                              backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                            }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(category.revenue)}</div>
                          <div className="text-sm text-muted-foreground">{category.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Activity & Payment Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt Động Người Dùng</CardTitle>
                  <CardDescription>Thống kê tương tác người dùng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatNumber(analyticsData.userActivity.dailyActiveUsers)}
                      </div>
                      <div className="text-sm text-muted-foreground">Người dùng hoạt động/ngày</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {analyticsData.userActivity.averageSessionTime}
                      </div>
                      <div className="text-sm text-muted-foreground">Thời gian trung bình</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {analyticsData.userActivity.conversionRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">Tỷ lệ chuyển đổi</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{analyticsData.userActivity.bounceRate}%</div>
                      <div className="text-sm text-muted-foreground">Tỷ lệ thoát</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Phương Thức Thanh Toán</CardTitle>
                  <CardDescription>Phân bố theo phương thức thanh toán</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.paymentMethods.map((method, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{method.method}</span>
                          <span className="text-sm text-muted-foreground">{method.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${method.percentage}%`,
                              backgroundColor: `hsl(${index * 90}, 70%, 50%)`,
                            }}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">{formatCurrency(method.amount)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Biểu Đồ Doanh Thu Chi Tiết</CardTitle>
                  <CardDescription>Doanh thu và số đơn hàng theo thời gian</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                      <p>Biểu đồ doanh thu chi tiết sẽ được hiển thị ở đây</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Người Bán</CardTitle>
                  <CardDescription>Doanh thu cao nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topSellers.map((seller, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{seller.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {seller.orders} đơn hàng • {seller.rating}⭐
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(seller.revenue)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tăng Trưởng Người Dùng</CardTitle>
                  <CardDescription>Số lượng người dùng mới theo thời gian</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                      <p>Biểu đồ tăng trưởng người dùng</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phân Bố Người Dùng</CardTitle>
                  <CardDescription>Theo vai trò và khu vực</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <PieChart className="h-16 w-16 mx-auto mb-4" />
                      <p>Biểu đồ phân bố người dùng</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hiệu Suất Sản Phẩm</CardTitle>
                  <CardDescription>Thống kê về sản phẩm bán chạy và tồn kho</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Package className="h-16 w-16 mx-auto mb-4" />
                      <p>Biểu đồ hiệu suất sản phẩm sẽ được hiển thị ở đây</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sellers">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hiệu Suất Người Bán</CardTitle>
                  <CardDescription>Thống kê doanh thu và đánh giá của người bán</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Users className="h-16 w-16 mx-auto mb-4" />
                      <p>Biểu đồ hiệu suất người bán sẽ được hiển thị ở đây</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
