"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth, type UserRole } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer" as UserRole,
    storeName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      setIsLoading(false)
      return
    }

    if (formData.role === "seller" && !formData.storeName.trim()) {
      setError("Tên cửa hàng là bắt buộc cho người bán")
      setIsLoading(false)
      return
    }

    try {
      const success = await register(
        formData.name,
        formData.email, 
        formData.password, 
        formData.role,
        formData.role === "seller" ? formData.storeName : undefined
      )
      if (success) {
        router.push("/")
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md relative">
        <Link href="/" className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </Link>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Tạo Tài Khoản</CardTitle>
          <CardDescription className="text-center">Nhập thông tin của bạn để tạo tài khoản</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và Tên</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nhập họ và tên đầy đủ"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Loại Tài Khoản</Label>
              <Select value={formData.role} onValueChange={(value: UserRole) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Khách Hàng - Mua sản phẩm</SelectItem>
                  <SelectItem value="seller">Người Bán - Bán sản phẩm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "seller" && (
              <div className="space-y-2">
                <Label htmlFor="storeName">Tên Cửa Hàng</Label>
                <Input
                  id="storeName"
                  type="text"
                  placeholder="Nhập tên cửa hàng của bạn"
                  value={formData.storeName}
                  onChange={(e) => handleInputChange("storeName", e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Tạo mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tạo mật khẩu"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Xác nhận mật khẩu của bạn"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tạo Tài Khoản
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
