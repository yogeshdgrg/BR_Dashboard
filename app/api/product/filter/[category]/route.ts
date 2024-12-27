import { connectDb } from "@/lib/db"
import Product from "@/lib/models/product"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (
  req: NextRequest,
  { params }: { params: { category: string } }
) => {
  const { category } = params
  try {
    if (!category) {
      return NextResponse.json({
        success: false,
        message: "Product ID is required",
      })
    }
    await connectDb()

    const product = await Product.find({ category })
    if (!product || product.length < 1) {
      return NextResponse.json({
        success: false,
        message: `${category} Product not found.`,
      })
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch {
    return NextResponse.json({
      success: false,
      message: `Unable to find the ${category} product. Internal Server Error`,
    })
  }
}
