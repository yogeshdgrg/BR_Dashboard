import { connectDb } from "@/lib/db"
import Product from "@/lib/models/product"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    await connectDb()
    const response = await Product.find({ isFeatured: true })
    if (!response) {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch the featured product.",
      })
    }
    return NextResponse.json({
      success: true,
      product: response,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Something wrong.",
    })
  }
}
