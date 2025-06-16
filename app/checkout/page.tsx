"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { useOrders } from "@/components/order-provider"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Truck, MapPin, Clock, CheckCircle, AlertCircle, Banknote } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ShippingAddress {
  fullName: string
  phone: string
  email: string
  address: string
  ward: string
  district: string
  city: string
  zipCode: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  type: "credit_card" | "bank_transfer" | "e_wallet" | "cod"
  name: string
  description: string
  icon: any
  processingTime: string
  fee: number
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "cod",
    type: "cod",
    name: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt khi nhận được hàng",
    icon: Banknote,
    processingTime: "Ngay lập tức",
    fee: 0,
  },
  {
    id: "credit_card",
    type: "credit_card",
    name: "Thẻ tín dụng/Ghi nợ",
    description: "Visa, Mastercard, JCB",
    icon: CreditCard,
    processingTime: "Ngay lập tức",
    fee: 0,
  },
  {
    id: "bank_transfer",
    type: "bank_transfer",
    name: "Chuyển khoản ngân hàng",
    description: "Chuyển khoản qua Internet Banking",
    icon: CreditCard,
    processingTime: "1-2 giờ",
    fee: 0,
  },
]

const shippingMethods = [
  {
    id: "standard",
    name: "Giao hàng tiêu chuẩn",
    description: "3-5 ngày làm việc",
    price: 30000,
    estimatedDays: "3-5",
  },
  {
    id: "express",
    name: "Giao hàng nhanh",
    description: "1-2 ngày làm việc",
    price: 50000,
    estimatedDays: "1-2",
  },
  {
    id: "same_day",
    name: "Giao hàng trong ngày",
    description: "Trong vòng 24 giờ",
    price: 100000,
    estimatedDays: "Trong ngày",
  },
]

export default function CheckoutPage() {
  const { user, isLoading } = useAuth()
  const { items, getTotalPrice, clearCart } = useCart()
  const { createOrder } = useOrders()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderError, setOrderError] = useState("")

  // Shipping Information
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    zipCode: "",
    isDefault: false,
  })

  // Payment & Shipping
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod")
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("standard")
  const [orderNotes, setOrderNotes] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }))
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  if (isLoading) return <div>Loading...</div>
  if (!user) return null
  if (items.length === 0) return null

  const subtotal = getTotalPrice()
  const selectedShipping = shippingMethods.find((m) => m.id === selectedShippingMethod)
  const shippingFee = selectedShipping?.price || 0
  const selectedPayment = paymentMethods.find((m) => m.id === selectedPaymentMethod)
  const paymentFee = selectedPayment?.fee || 0
  const tax = subtotal * 0.1 // 10% VAT
  const total = subtotal + shippingFee + paymentFee + tax

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate shipping address
      if (
        !shippingAddress.fullName ||
        !shippingAddress.phone ||
        !shippingAddress.address ||
        !shippingAddress.ward ||
        !shippingAddress.district ||
        !shippingAddress.city
      ) {
        setOrderError("Vui lòng điền đầy đủ thông tin giao hàng")
        return
      }
    }

    if (currentStep === 2) {
      // Validate payment method
      if (!selectedPaymentMethod) {
        setOrderError("Vui lòng chọn phương thức thanh toán")
        return
      }
    }

    setOrderError("")
    setCurrentStep((prev) => prev + 1)
  }

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1)
    setOrderError("")
  }

  const handlePlaceOrder = async () => {
    if (!agreeToTerms) {
      setOrderError("Vui lòng đồng ý với điều khoản và điều kiện")
      return
    }

    setIsProcessing(true)
    setOrderError("")

    try {
      // Group items by seller
      const ordersBySeller = items.reduce(
        (acc, item) => {
          const sellerId = item.sellerId
          if (!acc[sellerId]) {
            acc[sellerId] = {
              sellerId,
              sellerName: item.sellerName,
              items: [],
              subtotal: 0,
            }
          }
          acc[sellerId].items.push(item)
          acc[sellerId].subtotal += item.price * item.quantity
          return acc
        },
        {} as Record<string, any>,
      )

      // Create separate orders for each seller
      const orderIds: string[] = []

      for (const sellerOrder of Object.values(ordersBySeller)) {
        const orderSubtotal = (sellerOrder as any).subtotal
        const orderTax = orderSubtotal * 0.1
        const orderTotal = orderSubtotal + shippingFee + paymentFee + orderTax

        const orderId = createOrder({
          buyerId: user.id,
          buyerName: user.name,
          buyerEmail: user.email,
          sellerId: (sellerOrder as any).sellerId,
          sellerName: (sellerOrder as any).sellerName,
          items: (sellerOrder as any).items,
          shippingAddress,
          paymentMethod: selectedPaymentMethod,
          shippingMethod: selectedShippingMethod,
          orderNotes,
          subtotal: orderSubtotal,
          shippingFee,
          tax: orderTax,
          total: orderTotal,
          status: "pending",
          paymentStatus: selectedPaymentMethod === "cod" ? "pending" : "paid",
        })

        orderIds.push(orderId)
      }

      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart
      clearCart()

      // Redirect to orders page
      router.push("/orders")
    } catch (error) {
      setOrderError("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.")
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
            </div>
            {step < 3 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>
    </div>
  )

  const renderShippingStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Thông Tin Giao Hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={shippingAddress.fullName}
                onChange={(e) => setShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={shippingAddress.email}
              onChange={(e) => setShippingAddress((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Nhập email"
            />
          </div>

          <div>
            <Label htmlFor="address">Địa chỉ cụ thể *</Label>
            <Input
              id="address"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Số nhà, tên đường"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ward">Phường/Xã *</Label>
              <Input
                id="ward"
                value={shippingAddress.ward}
                onChange={(e) => setShippingAddress((prev) => ({ ...prev, ward: e.target.value }))}
                placeholder="Chọn phường/xã"
              />
            </div>
            <div>
              <Label htmlFor="district">Quận/Huyện *</Label>
              <Input
                id="district"
                value={shippingAddress.district}
                onChange={(e) => setShippingAddress((prev) => ({ ...prev, district: e.target.value }))}
                placeholder="Chọn quận/huyện"
              />
            </div>
            <div>
              <Label htmlFor="city">Tỉnh/Thành phố *</Label>
              <Select
                value={shippingAddress.city}
                onValueChange={(value) => setShippingAddress((prev) => ({ ...prev, city: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ho-chi-minh">TP. Hồ Chí Minh</SelectItem>
                  <SelectItem value="ha-noi">Hà Nội</SelectItem>
                  <SelectItem value="da-nang">Đà Nẵng</SelectItem>
                  <SelectItem value="can-tho">Cần Thơ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={shippingAddress.isDefault}
              onCheckedChange={(checked) => setShippingAddress((prev) => ({ ...prev, isDefault: checked as boolean }))}
            />
            <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Phương Thức Giao Hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedShippingMethod} onValueChange={setSelectedShippingMethod}>
            {shippingMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex-1">
                  <Label htmlFor={method.id} className="font-medium cursor-pointer">
                    {method.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(method.price)}</div>
                  <div className="text-sm text-muted-foreground">{method.estimatedDays} ngày</div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Phương Thức Thanh Toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value={method.id} id={method.id} />
                <method.icon className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor={method.id} className="font-medium cursor-pointer">
                    {method.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      <Clock className="inline h-3 w-3 mr-1" />
                      {method.processingTime}
                    </span>
                    {method.fee > 0 && (
                      <span className="text-xs text-muted-foreground">Phí: {formatCurrency(method.fee)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ghi Chú Đơn Hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ghi chú cho người bán (tùy chọn)"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Xem Lại Đơn Hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shipping Address */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Địa Chỉ Giao Hàng
            </h4>
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-medium">{shippingAddress.fullName}</div>
              <div className="text-sm text-muted-foreground">{shippingAddress.phone}</div>
              <div className="text-sm text-muted-foreground">
                {shippingAddress.address}, {shippingAddress.ward}, {shippingAddress.district}, {shippingAddress.city}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Phương Thức Thanh Toán
            </h4>
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-medium">{selectedPayment?.name}</div>
              <div className="text-sm text-muted-foreground">{selectedPayment?.description}</div>
            </div>
          </div>

          {/* Shipping Method */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Phương Thức Giao Hàng
            </h4>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{selectedShipping?.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedShipping?.description}</div>
                </div>
                <div className="font-medium">{formatCurrency(shippingFee)}</div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {orderNotes && (
            <div>
              <h4 className="font-medium mb-2">Ghi Chú</h4>
              <div className="p-4 bg-muted rounded-lg text-sm">{orderNotes}</div>
            </div>
          )}

          {/* Terms Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox id="agreeToTerms" checked={agreeToTerms} onCheckedChange={setAgreeToTerms} />
            <Label htmlFor="agreeToTerms" className="text-sm">
              Tôi đồng ý với{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Điều khoản và Điều kiện
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Chính sách Bảo mật
              </Link>
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Thanh Toán</h1>

        {renderStepIndicator()}

        {orderError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{orderError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && renderShippingStep()}
            {currentStep === 2 && renderPaymentStep()}
            {currentStep === 3 && renderReviewStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === 1}>
                Quay Lại
              </Button>

              {currentStep < 3 ? (
                <Button onClick={handleNextStep}>Tiếp Tục</Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !agreeToTerms}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? "Đang xử lý..." : "Đặt Hàng"}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Products */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantity} x {formatCurrency(item.price)}
                        </div>
                        <div className="text-xs text-muted-foreground">Bán bởi: {item.sellerName}</div>
                      </div>
                      <div className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>{formatCurrency(shippingFee)}</span>
                  </div>
                  {paymentFee > 0 && (
                    <div className="flex justify-between">
                      <span>Phí thanh toán</span>
                      <span>{formatCurrency(paymentFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Thuế VAT (10%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Payment Method Info */}
                {selectedPaymentMethod === "cod" && (
                  <Alert>
                    <Banknote className="h-4 w-4" />
                    <AlertDescription>Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
