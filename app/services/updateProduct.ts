import { connectDb } from "@/lib/db"
import Product from "@/lib/models/product"
import { uploadToCloudinary } from "@/utils/cloudinary"
import { NextRequest } from "next/server"
import { Types } from "mongoose"

export const updateProduct = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    // Validate product ID
    if (!Types.ObjectId.isValid(params.id)) {
      return {
        success: false,
        message: "Invalid product ID format",
      }
    }

    await connectDb()
    const formData = await request.formData()

    // Get existing product
    const existingProduct = await Product.findById(params.id)
    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      }
    }

    // Initialize update object with existing data
    const updateData = {
      name: formData.get("name") || existingProduct.name,
      description: formData.get("description") || existingProduct.description,
      price: formData.get("price") ? Number(formData.get("price")) : existingProduct.price,
      category: formData.get("category") || existingProduct.category,
      dimensions: formData.get("dimensions") 
        ? JSON.parse(formData.get("dimensions") as string)
        : existingProduct.dimensions,
    }

    // Handle main product image update
    const mainImage = formData.get("img") as File | null
    if (mainImage && mainImage.size > 0) {
      const mainImageUrl = await uploadToCloudinary(mainImage)
      updateData.img = mainImageUrl
    }

    // Handle color images update
    const newColorsData = formData.get("colors")
    if (newColorsData) {
      const colorImagesData = JSON.parse(newColorsData as string)
      const processedColors = []

      for (const color of colorImagesData) {
        const colorFile = formData.get(`color_${color.name}`) as File | null
        let colorImageUrl = color.image // Use existing image URL by default

        // Only upload new image if file is provided
        if (colorFile && colorFile.size > 0) {
          colorImageUrl = await uploadToCloudinary(colorFile, "product_colors")
        }

        processedColors.push({
          name: color.name,
          image: colorImageUrl,
        })
      }

      updateData.colors = processedColors
    }

    // Update product with new data
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return {
        success: false,
        message: "Failed to update product",
      }
    }

    return {
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    }

  } catch (error) {
    console.error("Error updating product:", error)
    return {
      success: false,
      message: "Error updating product",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}