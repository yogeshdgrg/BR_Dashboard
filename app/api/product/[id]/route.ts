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

// export const DELETE = async (
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) => {
//   try {
//     const { id } = params
//     // console.log("I am id : ", id)

//     if (!id) {
//       return NextResponse.json({
//         success: false,
//         message: "Product ID is required",
//       })
//     }
//     await connectDb()

//     const product = await Product.findByIdAndDelete(id, {
//       new: true,
//     })
//     if (!product) {
//       return NextResponse.json({
//         success: false,
//         message: "Product not deleted.",
//       })
//     }

//     return NextResponse.json({
//       success: true,
//       product,
//       message: "Product deleted successfully.",
//     })
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({
//         success: false,
//         message: "Internal Server Error",
//         error: error.message,
//       })
//     }
//   }
// }

// app/api/product/[id]/route.ts

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

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const response = await updateProduct(request, { params })
//   return Response.json(response)
// }

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb()
    const { id } = params

    const formData = await request.formData()

    // Extract basic product data
    const name = formData.get("name")
    const description = formData.get("description")
    const price = formData.get("price")
    const category = formData.get("category")
    const dimensions = JSON.parse(formData.get("dimensions") as string)

    // Find existing product
    const existingProduct = await Product.findById(id)
    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      )
    }

    // Handle main product image
    let mainImageUrl = existingProduct.img
    const mainImage = formData.get("img") as File
    if (mainImage && mainImage.size > 0) {
      mainImageUrl = await uploadToCloudinary(mainImage)
    }

    // Handle color variants
    const colorsData = JSON.parse(formData.get("colors") as string)
    const updatedColors = []

    for (const colorData of colorsData) {
      const colorImageFile = formData.get(`color_image_${colorData.id}`) as File

      // If it's an existing color
      const existingColor = existingProduct.colors.find(
        (c) => c._id.toString() === colorData.id
      )

      if (existingColor) {
        // Update existing color
        const colorInfo = {
          _id: existingColor._id,
          name: colorData.name,
          image: existingColor.image, // Keep existing image by default
        }

        // Update image if new one provided
        if (colorImageFile && colorImageFile.size > 0) {
          colorInfo.image = await uploadToCloudinary(
            colorImageFile,
            "product_colors"
          )
        }

        updatedColors.push(colorInfo)
      } else {
        // Add new color
        if (colorImageFile && colorImageFile.size > 0) {
          const newImageUrl = await uploadToCloudinary(
            colorImageFile,
            "product_colors"
          )
          updatedColors.push({
            name: colorData.name,
            image: newImageUrl,
          })
        }
      }
    }

    // Update product in database
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        img: mainImageUrl,
        price: Number(price),
        category,
        dimensions,
        colors: updatedColors,
      },
      { new: true }
    )

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error updating product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
