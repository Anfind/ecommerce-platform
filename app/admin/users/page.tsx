"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { MainNav } from "@/components/main-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Package,
  ShoppingCart,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionType, setActionType] = useState<
    "view" | "edit" | "suspend" | "activate" | null
  >(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      redirect("/login");
    }
  }, [user, isLoading]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    if (user && user.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (!user || user.role !== "admin") return null;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Hoạt Động</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Chờ Duyệt</Badge>;
      case "suspended":
        return <Badge className="bg-red-500">Tạm Khóa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "buyer":
        return (
          <Badge variant="outline" className="bg-blue-50">
            Khách Hàng
          </Badge>
        );
      case "seller":
        return (
          <Badge variant="outline" className="bg-purple-50">
            Người Bán
          </Badge>
        );
      case "admin":
        return (
          <Badge variant="outline" className="bg-red-50">
            Quản Trị
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const handleUserAction = (
    user: any,
    action: "suspend" | "activate" | "verify"
  ) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              status: action === "suspend" ? "suspended" : "active",
              verified: action === "verify" ? true : u.verified,
            }
          : u
      )
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Quản Lý Người Dùng</h1>
            <p className="text-muted-foreground">
              Quản lý tài khoản và quyền hạn người dùng
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm Người Dùng
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
                <DialogDescription>
                  Tạo tài khoản người dùng mới trong hệ thống
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Họ và Tên</Label>
                    <Input id="name" placeholder="Nhập họ tên" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Nhập email" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Số Điện Thoại</Label>
                    <Input id="phone" placeholder="Nhập số điện thoại" />
                  </div>
                  <div>
                    <Label htmlFor="role">Vai Trò</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Khách Hàng</SelectItem>
                        <SelectItem value="seller">Người Bán</SelectItem>
                        <SelectItem value="admin">Quản Trị</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Địa Chỉ</Label>
                  <Textarea id="address" placeholder="Nhập địa chỉ" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Hủy</Button>
                  <Button>Tạo Tài Khoản</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tổng Người Dùng
                  </p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Khách Hàng
                  </p>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === "buyer").length}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Người Bán
                  </p>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === "seller").length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Chờ Duyệt
                  </p>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.status === "pending").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
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
                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="buyer">Khách hàng</SelectItem>
                  <SelectItem value="seller">Người bán</SelectItem>
                  <SelectItem value="admin">Quản trị</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="suspended">Tạm khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Người Dùng</CardTitle>
            <CardDescription>
              Hiển thị {filteredUsers.length} người dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người Dùng</TableHead>
                  <TableHead>Vai Trò</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Ngày Tham Gia</TableHead>
                  <TableHead>Hoạt Động</TableHead>
                  <TableHead>Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.role === "buyer" ? (
                          <>
                            <div>{user.totalOrders} đơn hàng</div>
                            <div className="text-muted-foreground">
                              {formatCurrency(user.totalSpent)}
                            </div>
                          </>
                        ) : user.role === "seller" ? (
                          <>
                            <div>{user.totalProducts} sản phẩm</div>
                            <div className="text-muted-foreground">
                              {formatCurrency(user.totalRevenue)}
                            </div>
                          </>
                        ) : (
                          <div className="text-muted-foreground">
                            Quản trị viên
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setActionType("view");
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Chi Tiết Người Dùng</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage
                                      src={
                                        selectedUser.avatar ||
                                        "/placeholder.svg"
                                      }
                                    />
                                    <AvatarFallback className="text-lg">
                                      {selectedUser.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-xl font-semibold">
                                      {selectedUser.name}
                                    </h3>
                                    <p className="text-muted-foreground">
                                      {selectedUser.email}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                      {getRoleBadge(selectedUser.role)}
                                      {getStatusBadge(selectedUser.status)}
                                      {selectedUser.verified && (
                                        <Badge className="bg-green-500">
                                          Đã Xác Minh
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <h4 className="font-semibold">
                                      Thông Tin Liên Lạc
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                          {selectedUser.email}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                          {selectedUser.phone}
                                        </span>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <span className="text-sm">
                                          {selectedUser.address}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <h4 className="font-semibold">Thống Kê</h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                          Ngày tham gia:
                                        </span>
                                        <span className="text-sm">
                                          {selectedUser.joinDate}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                          Đăng nhập cuối:
                                        </span>
                                        <span className="text-sm">
                                          {selectedUser.lastLogin}
                                        </span>
                                      </div>
                                      {selectedUser.role === "buyer" && (
                                        <>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                              Tổng đơn hàng:
                                            </span>
                                            <span className="text-sm">
                                              {selectedUser.totalOrders}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                              Tổng chi tiêu:
                                            </span>
                                            <span className="text-sm">
                                              {formatCurrency(
                                                selectedUser.totalSpent
                                              )}
                                            </span>
                                          </div>
                                        </>
                                      )}
                                      {selectedUser.role === "seller" && (
                                        <>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                              Tên shop:
                                            </span>
                                            <span className="text-sm">
                                              {selectedUser.shopName}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                              Sản phẩm:
                                            </span>
                                            <span className="text-sm">
                                              {selectedUser.totalProducts}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                              Doanh thu:
                                            </span>
                                            <span className="text-sm">
                                              {formatCurrency(
                                                selectedUser.totalRevenue
                                              )}
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {selectedUser.status === "suspended" &&
                                  selectedUser.suspendReason && (
                                    <div className="p-4 bg-red-50 rounded-lg">
                                      <h4 className="font-semibold text-red-800 mb-2">
                                        Lý Do Tạm Khóa
                                      </h4>
                                      <p className="text-sm text-red-700">
                                        {selectedUser.suspendReason}
                                      </p>
                                    </div>
                                  )}

                                <div className="flex justify-end gap-2">
                                  {selectedUser.status === "active" ? (
                                    <Button
                                      variant="destructive"
                                      onClick={() =>
                                        handleUserAction(
                                          selectedUser,
                                          "suspend"
                                        )
                                      }
                                    >
                                      <Ban className="mr-2 h-4 w-4" />
                                      Tạm Khóa
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() =>
                                        handleUserAction(
                                          selectedUser,
                                          "activate"
                                        )
                                      }
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Kích Hoạt
                                    </Button>
                                  )}
                                  {!selectedUser.verified && (
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        handleUserAction(selectedUser, "verify")
                                      }
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Xác Minh
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>

                        {user.status === "active" ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUserAction(user, "suspend")}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(user, "activate")}
                          >
                            <CheckCircle className="h-4 w-4" />
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
  );
}
