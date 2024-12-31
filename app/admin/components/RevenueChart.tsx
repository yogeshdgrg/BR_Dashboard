"use client"

import React, { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Package,
  // TrendingUp
} from "lucide-react"
import { MonthlySalesData, SalesApiResponse } from "@/types"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const SalesDashboard = () => {
  const [salesData, setSalesData] = useState<MonthlySalesData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState("year")

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("/api/sales")
        const data: SalesApiResponse = await response.json()
        if (data.success) {
          setSalesData(data.data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        if (err instanceof Error) {
          setError("Failed to fetch sales data")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [timeframe])

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  if (error) return <div className="text-red-500">Error: {error}</div>
  if (!salesData) return null

  // Calculate category totals
  const categoryTotals = salesData.reduce((acc, month) => {
    if (month.categoryBreakdown) {
      Object.entries(month.categoryBreakdown).forEach(([category, data]) => {
        if (!acc[category]) {
          acc[category] = { count: 0, revenue: 0 }
        }
        acc[category].count += data.count
        acc[category].revenue += data.revenue
      })
    }
    return acc
  }, {} as { [key: string]: { count: number; revenue: number } })

  const chartData = {
    labels: monthNames,
    datasets: [
      {
        label: "Revenue",
        data: salesData.map((item) => item.totalAmount),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Products Sold",
        data: salesData.map((item) => item.productsSold),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  // Calculate summary statistics
  const totalRevenue = salesData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  )
  const totalProducts = salesData.reduce(
    (sum, item) => sum + item.productsSold,
    0
  )
  const totalOrders = salesData.reduce((sum, item) => sum + item.orderCount, 0)

  // Calculate month-over-month growth
  const currentMonth = new Date().getMonth()
  const currentMonthData = salesData[currentMonth]
  const previousMonthData = salesData[currentMonth - 1]
  const revenueGrowth = previousMonthData?.totalAmount
    ? ((currentMonthData?.totalAmount - previousMonthData?.totalAmount) /
        previousMonthData?.totalAmount) *
      100
    : 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs.{totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueGrowth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  revenueGrowth >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(revenueGrowth).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProducts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs.
              {totalOrders ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Per order average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <Tabs defaultValue="year" className="w-full">
            <TabsList>
              <TabsTrigger value="year" onClick={() => setTimeframe("year")}>
                Year
              </TabsTrigger>
              <TabsTrigger
                value="6month"
                onClick={() => setTimeframe("6month")}
              >
                6 Months
              </TabsTrigger>
              <TabsTrigger
                value="3month"
                onClick={() => setTimeframe("3month")}
              >
                3 Months
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <Line data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryTotals).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{category}</h3>
                  <p className="text-sm text-muted-foreground">
                    {data.count} units sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${data.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {((data.revenue / totalRevenue) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SalesDashboard
