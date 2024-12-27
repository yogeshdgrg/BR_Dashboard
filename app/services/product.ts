import { connectDb } from "@/lib/db"
import Product from "@/lib/models/product"
import { uploadToCloudinary } from "@/utils/cloudinary"
import { NextRequest } from "next/server"

export const addProduct = async (request: NextRequest) => {
  try {
    await connectDb()
    const formData = await request.formData()

    const name = formData.get("name")
    const description = formData.get("description")
    const price = formData.get("price")
    const category = formData.get("category")
    const dimensions = formData.get("dimensions")
    if (!name || !description || !price || !category || !dimensions) {
      return {
        success: false,
        message: "Missing required fields.",
      }
    }

    // Step 3: Process the main product image
    const mainImage = formData.get("img") as File // Get the uploaded file from the form data
    let mainImageUrl = ""
    if (mainImage) {
      // Upload the image to Cloudinary and get the URL
      // console.log("I am in uploading the main image")
      mainImageUrl = await uploadToCloudinary(mainImage)
    }
    console.log("main image url: ", mainImageUrl)

    // Extract color images

    // Step 4: Process color images
    const colorImagesData = JSON.parse(formData.get("colors") as string)
    console.log("ColorImagesData : ", colorImagesData) // Get color data as an array
    const processedColors = []

    for (const color of colorImagesData) {
      const colorFile = formData.get(`color_${color.name}`) as File // Get the file for each color
      console.log(`color name: color_${color.name}`)
      let colorImageUrl = color.image // Default to existing image URL

      console.log("Color file : ", colorFile)
      if (colorFile) {
        // If a file is uploaded, upload it to Cloudinary
        colorImageUrl = await uploadToCloudinary(colorFile, "product_colors")
        console.log("ColorImageUrl : ", colorImageUrl)
      }

      processedColors.push({
        name: color.name,
        image: colorImageUrl,
      })

      // console.log("Processed color : ", processedColors)
    }

    // Step 5: Prepare the product data
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      img: mainImageUrl,
      price: Number(formData.get("price")),
      category: formData.get("category"),
      dimensions: JSON.parse(formData.get("dimensions") as string),
      colors: processedColors,
    }

    // console.log("ProductData: ", productData)

    const product = await Product.create(productData)

    if (product) {
      return {
        success: true,
        message: "Product created successfully.",
        product,
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: "Error creating product.",
        err: error.message,
      }
    }
  }
}

export const getProduct = async () => {
  try {
    await connectDb()

    const response = await Product.find({})
    if (response) {
      return {
        success: true,
        products: response,
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: "Internal Server error.",
        err: error.message,
      }
    }
  }
}
