"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Search,
  User,
  Settings,
  LogOut,
  Package,
  BarChart3,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/cart-provider";

export function MainNav() {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "seller":
        return "bg-blue-500";
      case "buyer":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản Trị Viên";
      case "seller":
        return "Người Bán";
      case "buyer":
        return "Khách Hàng";
      default:
        return "";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Thương Mại Điện Tử
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/products"
              className="transition-colors hover:text-foreground/80"
            >
              Sản Phẩm
            </Link>
            <Link
              href="/categories"
              className="transition-colors hover:text-foreground/80"
            >
              Danh Mục
            </Link>
            {user?.role === "seller" && (
              <Link
                href="/seller/dashboard"
                className="transition-colors hover:text-foreground/80"
              >
                Bảng Điều Khiển Người Bán
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className="transition-colors hover:text-foreground/80"
              >
                Quản Trị Viên
              </Link>
            )}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            {user && user.role === "buyer" && (
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                  <span className="sr-only">Giỏ hàng</span>
                </Link>
              </Button>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge
                        className={`w-fit text-xs ${getRoleColor(user.role)}`}
                      >
                        {getRoleName(user.role)}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Hồ Sơ
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "buyer" && (
                    <DropdownMenuItem asChild>
                      <Link href="/orders">
                        <Package className="mr-2 h-4 w-4" />
                        Đơn Hàng Của Tôi
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "seller" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/dashboard?tab=products">
                          <Package className="mr-2 h-4 w-4" />
                          Sản Phẩm Của Tôi
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/dashboard?tab=analytics">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Doanh Số
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users">
                        <Users className="mr-2 h-4 w-4" />
                        Quản Lý Người Dùng
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Cài Đặt
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng Xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Đăng Nhập</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Đăng Ký</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
