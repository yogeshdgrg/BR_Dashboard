import { connectDb } from "@/lib/db"
import Product from "@/lib/models/product"
import { uploadToCloudinary } from "@/utils/cloudinary"
import { NextRequest } from "next/server"

// export const addProduct = async (request: NextRequest) => {
//   try {
//     await connectDb()
//     const formData = await request.formData()

//     // Extract basic fields
//     const name = formData.get("name")
//     const description = formData.get("description")
//     const price = formData.get("price")
//     const category = formData.get("category")
//     const sizes = JSON.parse(formData.get("sizes") as string)
//     const feature = JSON.parse(formData.get("feature") as string)

//     // Validation
//     if (!name || !description || !category || !sizes || !feature) {
//       return {
//         success: false,
//         message: "Missing required fields.",
//       }
//     }

//     // Process additional images - Fixed to handle multiple files
//     const processedImages = []

//     // Get all form entries and filter for additionalImages
//     const formEntries = Array.from(formData.entries())
//     const additionalImagesEntries = formEntries.filter(
//       ([key]) => key === "additionalImages"
//     )

//     console.log(
//       "Number of additional images found:",
//       additionalImagesEntries.length
//     )

//     // Process each additional image
//     for (const [key, imageFile] of additionalImagesEntries) {
//       console.log(key)

//       if (imageFile instanceof File) {
//         try {
//           console.log("Processing additional image:", imageFile.name)
//           const imageUrl = await uploadToCloudinary(
//             imageFile,
//             "products/additional"
//           )
//           processedImages.push({
//             image: imageUrl,
//           })
//           console.log("Successfully uploaded additional image:", imageUrl)
//         } catch (error) {
//           console.error("Error uploading additional image:", error)
//         }
//       }
//     }

//     console.log("Total processed additional images:", processedImages.length)

//     // Prepare the product data according to the new schema
//     const productData = {
//       name,
//       description,
//       price: Number(price),
//       category,
//       sizes,
//       images: processedImages,  // Additional images array
//       feature,
//       // Assign the first image from the additional images as the main image
//       img: processedImages.length > 0 ? processedImages[0].image : '',  // Main image field
//     }

//     console.log(productData)

//     const product = await Product.create(productData)

//     if (product) {
//       return {
//         success: true,
//         message: "Product created successfully.",
//         product,
//       }
//     }
//   } catch (error) {
//     console.error("Error in addProduct:", error)
//     return {
//       success: false,
//       message: "Error creating product.",
//       error: error instanceof Error ? error.message : "Unknown error",
//     }
//   }
// }

export const addProduct = async (request: NextRequest) => {
  try {
    await connectDb()
    const formData = await request.formData()

    const name = formData.get("name")
    const description = formData.get("description")
    const category = formData.get("category")
    const sizes = JSON.parse(formData.get("sizes") as string)
    const feature = JSON.parse(formData.get("feature") as string)
    const isFeatured = formData.get("isFeatured") === "true"

    if (!name || !description || !category || !sizes || !feature) {
      return {
        success: false,
        message: "Missing required fields.",
      }
    }

    const processedImages = []
    const formEntries = Array.from(formData.entries())
    const additionalImagesEntries = formEntries.filter(
      ([key]) => key === "additionalImages"
    )

    for (const [key, imageFile] of additionalImagesEntries) {
      console.log(key)
      if (imageFile instanceof File) {
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

    const productData = {
      name,
      description,
      category,
      sizes,
      images: processedImages,
      feature,
      isFeatured,
      img: processedImages.length > 0 ? processedImages[0].image : '',
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
