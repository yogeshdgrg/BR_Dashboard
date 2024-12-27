import { connectDb } from "@/lib/db"
import Order from "@/lib/models/order"
import { NextRequest, NextResponse } from "next/server"

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = params.id
    const dataToBeUpdated = await req.json()

    if (!id)
      return NextResponse.json({
        message: "Missing the order id.",
        success: false,
      })

    await connectDb()

    const response = await Order.findByIdAndUpdate(id, dataToBeUpdated, {
      new: true,
    })
    if (!response)
      return NextResponse.json({
        success: false,
        message: "Failed to update the change status of order.",
      })
    return NextResponse.json({
      success: true,
      message: "Successfully update the status of order.",
      order: response,
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
