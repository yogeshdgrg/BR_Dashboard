import { updateProduct } from "@/app/services/updateProduct"
import { connectDb } from "@/lib/db"
import Product from "@/lib/models/product"
import { NextRequest, NextResponse } from "next/server"
import { Types } from "mongoose"


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
      return Response.json({
        success: false,
        message: "Invalid product ID format"
      }, { status: 400 })
    }

    await connectDb()

    // Find the product first to ensure it exists
    const product = await Product.findById(params.id)
    if (!product) {
      return Response.json({
        success: false,
        message: "Product not found"
      }, { status: 404 })
    }

    // Delete the product
    await Product.findByIdAndDelete(params.id)

    return Response.json({
      success: true,
      message: "Product deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting product:", error)
    return Response.json({
      success: false,
      message: "Error deleting product",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const response = await updateProduct(request, { params })
  return Response.json(response)
}
