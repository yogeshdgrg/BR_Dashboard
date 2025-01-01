import { connectDb } from "@/lib/db"
import News from "@/lib/models/news"
import { INews } from "@/types/news"
import { uploadToCloudinary } from "@/utils/cloudinary"
import { NextRequest, NextResponse } from "next/server"

type Params = { id: string }

export const DELETE = async (
  req: NextRequest,
  context: { params: { id: string } }
): Promise<Response> => {
  const { id } = context.params
  if (!id) {
    return NextResponse.json({
      success: false,
      message: "Please provide the news id.",
    })
  }
  try {
    await connectDb()
    const response = await News.findByIdAndDelete(id)
    if (!response) {
      return NextResponse.json({
        success: false,
        message: "Failed to delete the news.",
      })
    }
    return NextResponse.json({
      success: true,
      message: "Successfully deleted the news.",
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Something Wrong.",
    })
  }
}

// export async function PUT(
//   request: NextRequest,
//   // context: { params: { id: string } }
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   try {
//     // const { id } = context.params;
//     const { id } = params
//     // Connect to database
//     await connectDb()

//     // Get form data from request
//     const formData = await request.formData()
//     const title = formData.get("title") as string
//     const description = formData.get("description") as string
//     const author = formData.get("author") as string
//     const imageFile = formData.get("image") as File | null

//     // Find existing news entry
//     const existingNews = await News.findById(id)
//     if (!existingNews) {
//       return NextResponse.json(
//         { error: "News entry not found" },
//         { status: 404 }
//       )
//     }

//     // Prepare update object
//     const updateData: Partial<INews> = {}
//     if (title) updateData.title = title
//     if (description) updateData.description = description
//     if (author) updateData.author = author

//     // Handle image update if new image is provided
//     if (imageFile) {
//       // Upload new image and update URL
//       const imageUrl = await uploadToCloudinary(imageFile, "news")
//       updateData.img = imageUrl
//     }

//     // Update news entry in database
//     const updatedNews = await News.findByIdAndUpdate(id, updateData, {
//       new: true,
//     })

//     return NextResponse.json({
//       success: true,
//       news: updatedNews,
//     })
//   } catch (error) {
//     console.error("Error processing request:", error)
//     return NextResponse.json(
//       { error: "Error updating news entry" },
//       { status: 500 }
//     )
//   }
// }

export async function PATCH(
  req: NextRequest,
  { params }: { params: Params }
): Promise<Response> {
  try {
    const { id } = params
    await connectDb()

    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const author = formData.get("author") as string
    const imageFile = formData.get("image") as File | null

    const existingNews = await News.findById(id)
    if (!existingNews) {
      return NextResponse.json(
        { error: "News entry not found" },
        { status: 404 }
      )
    }

    const updateData: Partial<INews> = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (author) updateData.author = author

    if (imageFile) {
      const imageUrl = await uploadToCloudinary(imageFile, "news")
      updateData.img = imageUrl
    }

    const updatedNews = await News.findByIdAndUpdate(id, updateData, {
      new: true,
    })

    return NextResponse.json({ success: true, news: updatedNews })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: "Error updating news entry" },
      { status: 500 }
    )
  }
}
