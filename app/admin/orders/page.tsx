"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  sizes: string[];
  images: {
    image: string;
    _id: string;
  }[];
  feature: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  _id: string;
  name: string;
  email: string;
  phone: string;
  product: Product;
  company: string;
  size: string;
  companyAddress: string;
  businessType: string;
  quantity: number;
  message: string;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "delivered">("all")
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false)
  const [newStatus, setNewStatus] = useState<string>("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async (): Promise<void> => {
    try {
      const response = await fetch("/api/order")
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string): Promise<void> => {
    if (!newStatus) return

    setUpdatingStatus(true)
    try {
      const response = await fetch(`/api/order/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, status: newStatus }
              : order
          )
        )
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const filteredOrders = orders.filter((order) =>
    statusFilter === "all" ? true : order.status.toLowerCase() === statusFilter
  )

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleOrderSelect = (order: IOrder): void => {
    setSelectedOrder(order)
    setNewStatus(order.status.toLowerCase())
    setIsDetailsOpen(true)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const ShimmerRow = () => (
    <tr>
      <td className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-4 py-4">
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-4 py-4">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-4 py-4">
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
      </td>
    </tr>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | "pending" | "delivered")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <>
                    <ShimmerRow />
                    <ShimmerRow />
                    <ShimmerRow />
                  </>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {order._id.slice(-6)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="w-10 h-10 relative">
                          <Image
                            fill
                            className="object-cover rounded"
                            src={order.product.images[0]?.image || '/placeholder.png'}
                            alt={order.product.name}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.name}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{order.product.name}</div>
                        <div className="text-sm text-gray-500">{order.product.category}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">{order.quantity}</td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOrderSelect(order)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="sticky top-0 bg-white pb-6 z-10">
            <SheetTitle>Order Details</SheetTitle>
          </SheetHeader>
          {selectedOrder && (
            <div className="space-y-6 pb-6">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{selectedOrder.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Business Type</p>
                    <p className="font-medium">{selectedOrder.businessType}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Company Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Company Name</p>
                    <p className="font-medium">{selectedOrder.company}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium">{selectedOrder.companyAddress}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Product Name</p>
                    <p className="font-medium">{selectedOrder.product.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="font-medium">{selectedOrder.product.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-medium">{selectedOrder.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Size</p>
                    <p className="font-medium">{selectedOrder.size}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Product Features</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {selectedOrder.product.feature.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Order Status</h3>
                <div className="space-y-2">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-full"
                    onClick={() => updateOrderStatus(selectedOrder._id)}
                    disabled={updatingStatus || newStatus === selectedOrder.status.toLowerCase()}
                  >
                    {updatingStatus ? "Updating..." : "Change Status"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Customer Message</h3>
                <p className="text-sm text-gray-600">{selectedOrder.message}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Order Timeline</h3>
                <div className="text-sm text-gray-600">
                  <p>Created: {formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}