import { connectDb } from "@/lib/db"
import Order from "@/lib/models/order"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  try {
    await connectDb()

    const {
      message,
      name,
      email,
      phone,
      product,
      quantity,
      businessType,
      size,
      company,
      companyAddress,
    } = await req.json()

    const response = await Order.create({
      name,
      email,
      phone,
      product,
      businessType,
      quantity,
      message,
      size,
      company,
      companyAddress,
    })

    if (response) {
      return NextResponse.json({
        success: true,
        message: "Order successful...",
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: "Order not successful...",
        error: error.message,
      })
    }
  }
}
export const GET = async () => {
  try {
    // Ensure database connection
    await connectDb()

    console.log("Hello")
    // Fetch all orders and populate the product field
    const orders = await Order.find({}).populate("product") //if product id is not there after populating the value of product will be null

    console.log("Orders: ",orders)

    // Filter orders where the product does not exist
    const invalidOrders = orders.filter((order) => !order.product)

    // Remove invalid orders from the database
    if (invalidOrders.length > 0) {
      const invalidOrderIds = invalidOrders.map((order) => order._id)
      await Order.deleteMany({ _id: { $in: invalidOrderIds } })
    }

    // Fetch valid orders again after cleanup
    const validOrders = await Order.find({}).populate("product")

    if (!validOrders.length) {
      return NextResponse.json({
        success: false,
        message: "No valid orders found.",
      })
    }

    return NextResponse.json({
      success: true,
      orders: validOrders,
      message: "Order list successfully fetched.",
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      })
    }
  }
}
