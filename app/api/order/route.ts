import { connectDb } from "@/lib/db"
import Order from "@/lib/models/order"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  try {
    await connectDb()

    const { message, name, email, phone, product, color, quantity } =
      await req.json()

    const response = await Order.create({
      name,
      email,
      phone,
      color,
      product,
      quantity,
      message,
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
    await connectDb() // Ensure database connection
    const orders = await Order.find({}).populate("product") // Populate 'product' field
    if (!orders.length) {
      return NextResponse.json({
        success: false,
        message: "No order yet.",
      })
    }

    return NextResponse.json({
      success: true,
      orders,
      message: "Order lists successfully fetched.",
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
