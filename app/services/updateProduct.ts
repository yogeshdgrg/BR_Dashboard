import { connectDb } from "@/lib/db"
import Product from "@/lib/models/product"
import { uploadToCloudinary } from "@/utils/cloudinary"
import { NextRequest } from "next/server"
import { Types } from "mongoose"

interface Image {
  image: string
}

export const updateProduct = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    if (!Types.ObjectId.isValid(params.id)) {
      return {
        success: false,
        message: "Invalid product ID format",
      }
    }

    await connectDb()
    const formData = await request.formData()

    const existingProduct = await Product.findById(params.id)
    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      }
    }

    const updateData = {
      name: (formData.get("name") as string) || existingProduct.name,
      description:
        (formData.get("description") as string) || existingProduct.description,
      category:
        (formData.get("category") as string) || existingProduct.category,
      sizes: formData.get("sizes")
        ? JSON.parse(formData.get("sizes") as string)
        : existingProduct.sizes,
      feature: formData.get("feature")
        ? JSON.parse(formData.get("feature") as string)
        : existingProduct.feature,
      isFeatured: formData.get("isFeatured")
        ? formData.get("isFeatured") === "true"
        : existingProduct.isFeatured,
      images: [] as Image[],
    }

    const formEntries = Array.from(formData.entries())
    const additionalImagesEntries = formEntries.filter(
      ([key]) => key === "additionalImages"
    )

    if (additionalImagesEntries.length > 0) {
      const processedImages: Image[] = [] // Initialize as an array of Image type

      for (const [key, imageFile] of additionalImagesEntries) {
        console.log(key)
        if (imageFile instanceof File && imageFile.size > 0) {
          try {
            const imageUrl = await uploadToCloudinary(
              imageFile,
              "products/additional"
            )
            processedImages.push({
              image: imageUrl,
            })
          } catch (error) {
            console.error("Error uploading additional image:", error)
          }
        }
      }
      if (processedImages.length > 0) {
        updateData.images = processedImages
      }
    }

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
