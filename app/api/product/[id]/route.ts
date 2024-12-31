// import { updateProduct } from "@/app/services/updateProduct"
import { connectDb } from "@/lib/db"
import Product from "@/lib/models/product"
import { NextRequest, NextResponse } from "next/server"
import { Types } from "mongoose"
import { uploadToCloudinary } from "@/utils/cloudinary"

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params
    // console.log("I am id : ", id)

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Product ID is required",
      })
    }
    await connectDb()

    const product = await Product.findById(id)
    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      })
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: "Unable to find the product. Internal Server Error",
      })
    }
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate product ID
    if (!Types.ObjectId.isValid(params.id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid product ID format",
        },
        { status: 400 }
      )
    }

    await connectDb()

    // Find the product first to ensure it exists
    const product = await Product.findById(params.id)
    if (!product) {
      return Response.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      )
    }

    // Delete the product
    await Product.findByIdAndDelete(params.id)

    return Response.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return Response.json(
      {
        success: false,
        message: "Error deleting product",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    )
  }
}


// export const PUT = async (
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) => {
//   const { id } = await params
//   try {
//     // Validate product ID
//     if (!Types.ObjectId.isValid(id)) {
//       return {
//         success: false,
//         message: "Invalid product ID format",
//       }
//     }

//     await connectDb()
//     const formData = await request.formData()

//     // Get existing product
//     const existingProduct = await Product.findById(id)
//     if (!existingProduct) {
//       return {
//         success: false,
//         message: "Product not found",
//       }
//     }

//     // Initialize update object with existing data
//     const updateData = {
//       name: formData.get("name") || existingProduct.name,
//       description: formData.get("description") || existingProduct.description,
//       price: formData.get("price")
//         ? Number(formData.get("price"))
//         : existingProduct.price,
//       category: formData.get("category") || existingProduct.category,
//       sizes: formData.get("sizes")
//         ? JSON.parse(formData.get("sizes") as string)
//         : existingProduct.sizes,
//       feature: formData.get("feature")
//         ? JSON.parse(formData.get("feature") as string)
//         : existingProduct.feature,
//     }

//     // Handle additional images update
//     const formEntries = Array.from(formData.entries())
//     const additionalImagesEntries = formEntries.filter(
//       ([key]) => key === "additionalImages"
//     )

//     if (additionalImagesEntries.length > 0) {
//       const processedImages = []

//       for (const [_, imageFile] of additionalImagesEntries) {
//         if (imageFile instanceof File && imageFile.size > 0) {
//           try {
//             const imageUrl = await uploadToCloudinary(
//               imageFile,
//               "products/additional"
//             )
//             processedImages.push({
//               image: imageUrl,
//             })
//           } catch (error) {
//             console.error("Error uploading additional image:", error)
//             // Continue with other images even if one fails
//           }
//         }
//       }

//       if (processedImages.length > 0) {
//         updateData.images = processedImages
//       }
//     }

//     // Update product with new data
//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     )

//     if (!updatedProduct) {
//       return {
//         success: false,
//         message: "Failed to update product",
//       }
//     }

//     return {
//       success: true,
//       message: "Product updated successfully",
//       product: updatedProduct,
//     }
//   } catch (error) {
//     console.error("Error updating product:", error)
//     return {
//       success: false,
//       message: "Error updating product",
//       error: error instanceof Error ? error.message : "Unknown error occurred",
//     }
//   }
// }
