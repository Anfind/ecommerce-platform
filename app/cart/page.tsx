"use client"
import { useAuth } from "@/components/auth-provider"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { useCart } from "@/components/cart-provider"

const getSellerName = (sellerName: string) => {
  return sellerName || "Unknown Seller"
}

export default function CartPage() {
  const { user, isLoading } = useAuth()
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart()

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
  }, [user, isLoading])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const availableItems = items.filter((item) => item.inStock)
  const unavailableItems = items.filter((item) => !item.inStock)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Giỏ hàng của bạn đang trống</h1>
            <p className="text-muted-foreground mb-8">Thêm một số sản phẩm để bắt đầu</p>
            <Button asChild>
              <Link href="/products">Tiếp Tục Mua Sắm</Link>
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
        <h1 className="text-3xl font-bold mb-8">Giỏ Hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Items */}
            {availableItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sản Phẩm Có Sẵn ({availableItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">by {getSellerName(item.sellerName)}</p>
                        <p className="font-bold">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Unavailable Items */}
            {unavailableItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Sản Phẩm Không Có Sẵn ({unavailableItems.length})<Badge variant="destructive">Hết Hàng</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {unavailableItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg opacity-60">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover grayscale"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">by {getSellerName(item.sellerName)}</p>
                        <p className="font-bold">${item.price}</p>
                        <Badge variant="destructive" className="mt-1">
                          Hết Hàng
                        </Badge>
                      </div>
                      <div className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tạm Tính ({availableItems.length} sản phẩm)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vận Chuyển</span>
                  <span>{shipping === 0 ? "Miễn Phí" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600">Miễn phí vận chuyển cho đơn hàng trên $100!</p>
                )}
                <div className="flex justify-between">
                  <span>Thuế</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng Cộng</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full" size="lg" disabled={availableItems.length === 0} asChild>
                  <Link href="/checkout">Tiến Hành Thanh Toán</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">Tiếp Tục Mua Sắm</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
