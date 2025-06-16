"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-provider"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  sellerId: string
  sellerName: string
}

export interface ShippingAddress {
  fullName: string
  phone: string
  email: string
  address: string
  ward: string
  district: string
  city: string
  zipCode: string
}

export interface Order {
  id: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  sellerId: string
  sellerName: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  shippingMethod: string
  orderNotes: string
  subtotal: number
  shippingFee: number
  tax: number
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  createdAt: string
  confirmedAt?: string
  shippedAt?: string
  deliveredAt?: string
  cancelledAt?: string
  trackingNumber?: string
  sellerNotes?: string
}

interface OrderContextType {
  orders: Order[]
  getOrdersByBuyer: (buyerId: string) => Order[]
  getOrdersBySeller: (sellerId: string) => Order[]
  createOrder: (orderData: Omit<Order, "id" | "createdAt">) => string
  updateOrderStatus: (orderId: string, status: Order["status"], notes?: string) => boolean
  getOrderById: (orderId: string) => Order | null
  refreshOrders: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const { user } = useAuth()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    const savedOrders = localStorage.getItem("all_orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    } else {
      // Initialize with sample orders for testing
      const sampleOrders: Order[] = [
        {
          id: "ORD-1734567890123-abc123def",
          buyerId: "2", // John Buyer
          buyerName: "John Buyer",
          buyerEmail: "buyer@example.com",
          sellerId: "3",
          sellerName: "Tech Store VN",
          items: [
            {
              id: "1",
              name: "iPhone 15 Pro Max",
              price: 29990000,
              quantity: 1,
              image: "/images/iphone-15-pro.jpg",
              sellerId: "3",
              sellerName: "Tech Store VN"
            },
            {
              id: "2", 
              name: "AirPods Pro",
              price: 5990000,
              quantity: 1,
              image: "/images/airpods-pro.jpg",
              sellerId: "3",
              sellerName: "Tech Store VN"
            }
          ],
          shippingAddress: {
            fullName: "John Buyer",
            phone: "0987654321",
            email: "buyer@example.com",
            address: "123 Nguyễn Văn Linh",
            ward: "Phường 1",
            district: "Quận 7", 
            city: "TP. Hồ Chí Minh",
            zipCode: "70000"
          },
          paymentMethod: "cod",
          shippingMethod: "standard",
          orderNotes: "Giao hàng giờ hành chính",
          subtotal: 35980000,
          shippingFee: 30000,
          tax: 3598000,
          total: 39608000,
          status: "shipped",
          paymentStatus: "pending",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          confirmedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          shippedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          trackingNumber: "TN12345678"
        },
        {
          id: "ORD-1734467890123-def456ghi",
          buyerId: "2",
          buyerName: "John Buyer", 
          buyerEmail: "buyer@example.com",
          sellerId: "4",
          sellerName: "Fashion Hub",
          items: [
            {
              id: "15",
              name: "Nike Air Jordan",
              price: 3500000,
              quantity: 1,
              image: "/images/nike-shoes.jpg",
              sellerId: "4",
              sellerName: "Fashion Hub"
            }
          ],
          shippingAddress: {
            fullName: "John Buyer",
            phone: "0987654321", 
            email: "buyer@example.com",
            address: "123 Nguyễn Văn Linh",
            ward: "Phường 1",
            district: "Quận 7",
            city: "TP. Hồ Chí Minh", 
            zipCode: "70000"
          },
          paymentMethod: "bank_transfer",
          shippingMethod: "express",
          orderNotes: "",
          subtotal: 3500000,
          shippingFee: 50000,
          tax: 350000,
          total: 3900000,
          status: "delivered",
          paymentStatus: "paid",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          confirmedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          shippedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          trackingNumber: "TN87654321"
        },
        {
          id: "ORD-1734367890123-ghi789jkl",
          buyerId: "2",
          buyerName: "John Buyer",
          buyerEmail: "buyer@example.com",
          sellerId: "5",
          sellerName: "Home & Garden",
          items: [
            {
              id: "20",
              name: "Máy Pha Cà Phê Delonghi",
              price: 4500000,
              quantity: 1,
              image: "/images/coffee-maker.jpg",
              sellerId: "5",
              sellerName: "Home & Garden"
            },
            {
              id: "21",
              name: "Đèn Bàn LED Thông Minh",
              price: 890000,
              quantity: 2,
              image: "/images/desk-lamp.jpg",
              sellerId: "5",
              sellerName: "Home & Garden"
            }
          ],
          shippingAddress: {
            fullName: "John Buyer",
            phone: "0987654321",
            email: "buyer@example.com",
            address: "123 Nguyễn Văn Linh",
            ward: "Phường 1",
            district: "Quận 7",
            city: "TP. Hồ Chí Minh",
            zipCode: "70000"
          },
          paymentMethod: "bank_transfer",
          shippingMethod: "standard",
          orderNotes: "Gói cẩn thận, đây là quà tặng",
          subtotal: 6280000,
          shippingFee: 25000,
          tax: 628000,
          total: 6933000,
          status: "confirmed",
          paymentStatus: "paid",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          confirmedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          sellerNotes: "Đơn hàng đã được xác nhận, sẽ giao trong 2-3 ngày tới"
        },
        {
          id: "ORD-1734267890123-jkl012mno",
          buyerId: "2",
          buyerName: "John Buyer",
          buyerEmail: "buyer@example.com",
          sellerId: "3",
          sellerName: "Tech Store VN",
          items: [
            {
              id: "8",
              name: "MacBook Air M3",
              price: 28990000,
              quantity: 1,
              image: "/images/macbook-air.jpg",
              sellerId: "3",
              sellerName: "Tech Store VN"
            },
            {
              id: "9",
              name: "Balo Laptop Cao Cấp",
              price: 1200000,
              quantity: 1,
              image: "/images/laptop-backpack.jpg",
              sellerId: "3",
              sellerName: "Tech Store VN"
            }
          ],
          shippingAddress: {
            fullName: "John Buyer",
            phone: "0987654321",
            email: "buyer@example.com",
            address: "456 Lê Văn Việt",
            ward: "Phường Tăng Nhơn Phú A",
            district: "Quận 9",
            city: "TP. Hồ Chí Minh",
            zipCode: "70000"
          },
          paymentMethod: "cod",
          shippingMethod: "express",
          orderNotes: "Giao hàng buổi chiều sau 2h",
          subtotal: 30190000,
          shippingFee: 50000,
          tax: 3019000,
          total: 33259000,
          status: "pending",
          paymentStatus: "pending",
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          sellerNotes: ""
        }
      ]
      localStorage.setItem("all_orders", JSON.stringify(sampleOrders))
      setOrders(sampleOrders)
    }
  }

  const saveOrders = (newOrders: Order[]) => {
    localStorage.setItem("all_orders", JSON.stringify(newOrders))
    setOrders(newOrders)
  }

  const getOrdersByBuyer = (buyerId: string) => {
    const buyerOrders = orders.filter((order) => order.buyerId === buyerId)
    console.log(`Getting orders for buyer ${buyerId}:`, buyerOrders.length, "orders found")
    return buyerOrders
  }

  const getOrdersBySeller = (sellerId: string) => {
    return orders.filter((order) => order.sellerId === sellerId)
  }

  const createOrder = (orderData: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    const updatedOrders = [newOrder, ...orders]
    saveOrders(updatedOrders)
    return newOrder.id
  }

  const updateOrderStatus = (orderId: string, status: Order["status"], notes?: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status }

        // Add timestamp for status changes
        const now = new Date().toISOString()
        switch (status) {
          case "confirmed":
            updatedOrder.confirmedAt = now
            break
          case "shipped":
            updatedOrder.shippedAt = now
            updatedOrder.trackingNumber = `TN${Date.now().toString().slice(-8)}`
            break
          case "delivered":
            updatedOrder.deliveredAt = now
            break
          case "cancelled":
            updatedOrder.cancelledAt = now
            break
        }

        if (notes) {
          updatedOrder.sellerNotes = notes
        }

        return updatedOrder
      }
      return order
    })

    saveOrders(updatedOrders)
    return true
  }

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId) || null
  }

  const refreshOrders = () => {
    console.log("Refreshing orders...")
    loadOrders()
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        getOrdersByBuyer,
        getOrdersBySeller,
        createOrder,
        updateOrderStatus,
        getOrderById,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}
