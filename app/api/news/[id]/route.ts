import { connectDb } from "@/lib/db"
import News from "@/lib/models/news"
import { INews } from "@/types/news"
import { uploadToCloudinary } from "@/utils/cloudinary"
import { NextRequest, NextResponse } from "next/server"

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params
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


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectDb()

    // Get form data from request
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const author = formData.get("author") as string
    const imageFile = formData.get("image") as File | null

    // Find existing news entry
    const existingNews = await News.findById(params.id)
    if (!existingNews) {
      return NextResponse.json(
        { error: "News entry not found" },
        { status: 404 }
      )
    }

    // Prepare update object
    const updateData: Partial<INews> = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (author) updateData.author = author

    // Handle image update if new image is provided
    if (imageFile) {
      // Upload new image and update URL
      const imageUrl = await uploadToCloudinary(imageFile, "news")
      updateData.img = imageUrl
    }

    // Update news entry in database
    const updatedNews = await News.findByIdAndUpdate(params.id, updateData, {
      new: true,
    })

    return NextResponse.json({
      success: true,
      news: updatedNews,
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: "Error updating news entry" },
      { status: 500 }
    )
  }
}
