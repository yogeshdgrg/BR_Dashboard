import { connectDb } from "@/lib/db"
import Wholesale from "@/lib/models/wholesale"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  const body = await req.json()
  try {
    await connectDb()
    const wholeSaleProduct = await Wholesale.create(body)
    if (!wholeSaleProduct) {
      return NextResponse.json({
        success: false,
        message: "Cannot create the wholesale product.",
      })
    }
    return NextResponse.json({
      success: true,
      message: "successfully submitted.",
      wholesale: wholeSaleProduct,
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

export const GET = async () => {
  try {
    await connectDb()
    const wholeSaleProduct = await Wholesale.find({})
    if (!wholeSaleProduct) {
      return NextResponse.json({
        success: false,
        message: "Failed to get the wholesale product.",
      })
    }
    return NextResponse.json({
      success: true,
      wholesale: wholeSaleProduct,
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
