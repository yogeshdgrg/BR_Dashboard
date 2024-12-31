import { connectDb } from "@/lib/db"
import Product from "@/lib/models/product"
import { uploadToCloudinary } from "@/utils/cloudinary"
import { NextRequest } from "next/server"

export const addProduct = async (request: NextRequest) => {
  try {
    await connectDb()
    const formData = await request.formData()

    // Extract basic fields
    const name = formData.get("name")
    const description = formData.get("description")
    const price = formData.get("price")
    const category = formData.get("category")
    const sizes = JSON.parse(formData.get("sizes") as string)

    // Validation
    if (!name || !description || !category || !sizes) {
      return {
        success: false,
        message: "Missing required fields.",
      }
    }

    // Upload main product image
    const mainImage = formData.get("img") as File
    console.log("Main image : ", mainImage)
    let mainImageUrl = ""
    if (mainImage) {
      try {
        mainImageUrl = await uploadToCloudinary(mainImage, "products/main")
      } catch (error) {
        return {
          success: false,
          message: "Error uploading main image.",
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    } else {
      return {
        success: false,
        message: "Main image is required.",
      }
    }

    // Process additional images - Fixed to handle multiple files
    const processedImages = []

    // Get all form entries and filter for additionalImages
    const formEntries = Array.from(formData.entries())
    const additionalImagesEntries = formEntries.filter(
      ([key]) => key === "additionalImages"
    )

    console.log(
      "Number of additional images found:",
      additionalImagesEntries.length
    )

    // Process each additional image
    for (const [_, imageFile] of additionalImagesEntries) {
      if (imageFile instanceof File) {
        try {
          console.log("Processing additional image:", imageFile.name)
          const imageUrl = await uploadToCloudinary(
            imageFile,
            "products/additional"
          )
          processedImages.push({
            image: imageUrl,
          })
          console.log("Successfully uploaded additional image:", imageUrl)
        } catch (error) {
          console.error("Error uploading additional image:", error)
        }
      }
    }

    console.log("Total processed additional images:", processedImages.length)

    // Prepare the product data according to the new schema
    const productData = {
      name,
      description,
      img: mainImageUrl,
      price: Number(price),
      category,
      sizes,
      images: processedImages,
    }

    const product = await Product.create(productData)

    if (product) {
      return {
        success: true,
        message: "Product created successfully.",
        product,
      }
    }
  } catch (error) {
    console.error("Error in addProduct:", error)
    return {
      success: false,
      message: "Error creating product.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export const getProduct = async () => {
  try {
    await connectDb()
    const response = await Product.find({})
    if (!response) {
      return {
        success: false,
        message: "No product found.",
      }
    }
    return {
      success: true,
      message: "Successfully fetched.",
      response,
    }
  } catch (err) {
    return {
      message: err instanceof Error ? err.message : "Something wrong",
    }
  }
}
