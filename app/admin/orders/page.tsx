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

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
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

  const updateOrderStatus = async (orderId) => {
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
        // Update the orders state directly instead of fetching again
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        )
        
        // Update the selected order state
        setSelectedOrder(prev => ({ ...prev, status: newStatus }))
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleOrderSelect = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.status.toLowerCase())
    setIsDetailsOpen(true)
  }

  const ShimmerRow = () => (
    <tr>
      <td className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 background-position-start"></div>
      </td>
      <td className="px-4 py-4">
        <div className="h-10 w-10 bg-gray-200 rounded animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 background-position-start"></div>
      </td>
      <td className="px-4 py-4">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 background-position-start"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 background-position-start"></div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 background-position-start"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 background-position-start"></div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="h-6 w-20 bg-gray-200 rounded animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 background-position-start"></div>
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-8 bg-gray-200 rounded animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 background-position-start"></div>
      </td>
      <td className="px-4 py-4">
        <div className="h-8 w-24 bg-gray-200 rounded animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 background-position-start"></div>
      </td>
    </tr>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
          <div className="overflow-x-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
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
                        <Image
                          width={40}
                          height={40}
                          className="w-10 h-10"
                          src={order.product.img}
                          alt="prod_img"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.email}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {order.product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${order.product.price}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {order.quantity}
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
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
                <h3 className="font-medium text-gray-900">
                  Customer Information
                </h3>
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
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium">
                      ${selectedOrder.product.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-medium">{selectedOrder.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Color</p>
                    <p className="font-medium">{selectedOrder.color}</p>
                  </div>
                </div>
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
                    disabled={
                      updatingStatus ||
                      newStatus === selectedOrder.status.toLowerCase()
                    }
                  >
                    {updatingStatus ? "Updating..." : "Change Status"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Customer Message</h3>
                <p className="text-sm text-gray-600">{selectedOrder.message}</p>
              </div>

              {selectedOrder.product.dimensions && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">
                    Product Dimensions
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Length</p>
                      <p className="font-medium">
                        {selectedOrder.product.dimensions.length || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Width</p>
                      <p className="font-medium">
                        {selectedOrder.product.dimensions.width || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Height</p>
                      <p className="font-medium">
                        {selectedOrder.product.dimensions.height || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}