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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Camera, Save, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    website: "",
  });
  const [resetPassword, setResetPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleResetPassword = async () => {
    if (
      resetPassword.newPassword &&
      resetPassword.newPassword === resetPassword.confirmPassword
    ) {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          currentPassword: resetPassword.currentPassword,
          newPassword: resetPassword.newPassword,
        }),
      });

      const result = await res.json();
      console.log("Reset Password Result:", result);

      if (result.success) {
        console.log("Đổi mật khẩu thành công!");
        alert("Đổi mật khẩu thành công!");
      } else {
        console.error("Lỗi:", result.error);
        alert(`Lỗi: ${result.error || "Không thể đổi mật khẩu"}`);
      }
      setResetPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      alert("Mật khẩu mới không khớp hoặc không hợp lệ.");
    }
  };

  const handleChangeResetPassword = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof resetPassword
  ) => {
    setResetPassword({
      ...resetPassword,
      [field]: e.target.value,
    });
  };

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login");
    }
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: "+1 (555) 123-4567",
        address: "123 Main St, City, State 12345",
        bio: "Passionate about technology and great products.",
        website: "https://example.com",
      });
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleSave = () => {
    // In a real app, this would save to your backend
    setIsEditing(false);
  };

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

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản Trị Viên Nền Tảng";
      case "seller":
        return "Người Bán Sản Phẩm";
      case "buyer":
        return "Khách Hàng";
      default:
        return "Người Dùng";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Hồ Sơ</h1>
            {/* <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  Lưu Thay Đổi
                </>
              ) : (
                "Chỉnh Sửa Hồ Sơ"
              )}
            </Button> */}
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general">Chung</TabsTrigger>
              <TabsTrigger value="security">Bảo Mật</TabsTrigger>
              {user.role === "seller" && (
                <TabsTrigger value="store">Cài Đặt Cửa Hàng</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="general">
              <div className="grid gap-6">
                {/* Profile Header */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                          />
                          <AvatarFallback className="text-2xl">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            className={`${getRoleColor(user.role)} text-white`}
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {getRoleDescription(user.role)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Tham gia{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông Tin Cá Nhân</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin cá nhân và liên lạc
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và Tên</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Điện Thoại</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Trang Web</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              website: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Địa Chỉ</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Tiểu Sử</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information Display */}
                {!isEditing && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông Tin Liên Lạc</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span>{formData.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span>{formData.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <span>{formData.address}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Cài Đặt Bảo Mật</CardTitle>
                  <CardDescription>
                    Quản lý mật khẩu và tùy chọn bảo mật
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mật Khẩu Hiện Tại</Label>
                    <Input
                      value={resetPassword.currentPassword}
                      id="current-password"
                      type="password"
                      onChange={(e) =>
                        handleChangeResetPassword(e, "currentPassword")
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Mật Khẩu Mới</Label>
                    <Input
                      value={resetPassword.newPassword}
                      id="new-password"
                      type="password"
                      onChange={(e) =>
                        handleChangeResetPassword(e, "newPassword")
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Xác Nhận Mật Khẩu Mới
                    </Label>
                    <Input
                      value={resetPassword.confirmPassword}
                      id="confirm-password"
                      type="password"
                      onChange={(e) =>
                        handleChangeResetPassword(e, "confirmPassword")
                      }
                    />
                  </div>
                  <Separator />
                  <Button onClick={handleResetPassword}>
                    Cập Nhật Mật Khẩu
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {user.role === "seller" && (
              <TabsContent value="store">
                <Card>
                  <CardHeader>
                    <CardTitle>Cài Đặt Cửa Hàng</CardTitle>
                    <CardDescription>
                      Quản lý thông tin và tùy chọn cửa hàng
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Tên Cửa Hàng</Label>
                      <Input id="store-name" defaultValue="My Awesome Store" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-description">Mô Tả Cửa Hàng</Label>
                      <Textarea
                        id="store-description"
                        defaultValue="We sell amazing products at great prices!"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="return-policy">Chính Sách Đổi Trả</Label>
                      <Textarea
                        id="return-policy"
                        defaultValue="30-day return policy on all items."
                        rows={3}
                      />
                    </div>
                    <Button>Cập Nhật Cài Đặt Cửa Hàng</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
