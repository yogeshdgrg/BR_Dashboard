// app/api/product/[productId]/color/[colorId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { connectDb } from "@/lib/db"
import Product from "@/lib/models/product"
import { v2 as cloudinary } from "cloudinary"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; colorId: string } }
) {
  try {
    await connectDb()
    
    const { id, colorId } = params
    
    // Find the product
    const product = await Product.findById(id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      )
    }
    
    // Find the color variant
    const colorVariant = product.colors.find(
      color => color._id.toString() === colorId
    )
    
    if (!colorVariant) {
      return NextResponse.json(
        { success: false, message: "Color variant not found" },
        { status: 404 }
      )
    }

    // Delete image from Cloudinary if it exists
    if (colorVariant.image) {
      try {
        // Extract public_id from the Cloudinary URL
        const publicId = colorVariant.image.split('/').slice(-1)[0].split('.')[0]
        await cloudinary.uploader.destroy(`product_colors/${publicId}`)
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error)
        // Continue with color deletion even if image deletion fails
      }
    }

    // Remove the color variant from the array
    product.colors = product.colors.filter(
      color => color._id.toString() !== colorId
    )
    
    // Save the updated product
    await product.save()
    
    return NextResponse.json({
      success: true,
      message: "Color variant deleted successfully"
    })
    
  } catch (error) {
    console.error("Delete color error:", error)
    return NextResponse.json({
      success: false,
      message: "Error deleting color variant",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}