import { connectDb } from "@/lib/db"
import Banner from "@/lib/models/banner"
import { uploadToCloudinary } from "@/utils/cloudinary"
import { NextRequest, NextResponse } from "next/server"

// export const POST = async (request: NextRequest) => {
//   try {
//     await connectDb()
//     const formData = await request.formData()
//     const img = formData.get("image") as File
//     const link = formData.get("link")

//     if (!img || !link) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Missing required fields.",
//         },
//         { status: 400 }
//       )
//     }

//     const imageUrl = await uploadToCloudinary(img, "banner")

//     const banner = await Banner.create({
//       image: imageUrl,
//       link: link.toString() || "",
//     })

//     return NextResponse.json({
//       success: true,
//       message: "Banner created successfully.",
//       banner,
//     })
//   } catch (error) {
//     console.error("Error creating banner:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: error instanceof Error ? error.message : "Something went wrong",
//       },
//       { status: 500 }
//     )
//   }
// }

export const POST = async (request: NextRequest) => {
    try {
      await connectDb()
      const formData = await request.formData()
      const img = formData.get("image") as File
      const link = formData.get("link") as string | null
  
      if (!img) {
        return NextResponse.json(
          {
            success: false,
            message: "Image is required.",
          },
          { status: 400 }
        )
      }
  
      const imageUrl = await uploadToCloudinary(img, "banner")
  
      const banner = await Banner.create({
        image: imageUrl,
        link: link || undefined,
      })
  
      return NextResponse.json({
        success: true,
        message: "Banner created successfully.",
        banner,
      })
    } catch (error) {
      console.error("Error creating banner:", error)
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Something went wrong",
        },
        { status: 500 }
      )
    }
  }
  

export const GET = async () => {
  try {
    await connectDb()
    const response = await Banner.find({})
    if (!response) {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch the Banner image.",
      })
    }
    return NextResponse.json({
      success: true,
      banner: response,
      message: "Successfully fetched the Banner images.",
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Something Wrong",
    })
  }
}
