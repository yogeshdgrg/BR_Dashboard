"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface TopProduct {
  _id: string
  productName: string
  totalSales: number
  totalRevenue: number
  category: string
}

const TopProducts = () => {
  const [products, setProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch("/api/product/top")
        const data = await response.json()

        if (data.success) {
          setProducts(data.data)
        } else {
          setError(data.message)
        }
      } catch {
        setError("Failed to fetch top products")
      } finally {
        setLoading(false)
      }
    }

    fetchTopProducts()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex justify-between items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div>
                <h3 className="font-medium">{product.productName}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{product.totalSales} sold</p>
                <p className="text-sm text-muted-foreground">
                  ${product.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TopProducts
