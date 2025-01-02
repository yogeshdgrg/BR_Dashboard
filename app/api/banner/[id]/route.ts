import { connectDb } from "@/lib/db"
import Banner from "@/lib/models/banner"
import { deleteFromCloudinary, uploadToCloudinary } from "@/utils/cloudinary"
import { NextResponse, NextRequest } from "next/server"

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDb()
    const formData = await request.formData()
    const id = (await params).id
    const img = formData.get("image") as File | null
    const link = formData.get("link") as string | null

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner ID is required",
        },
        { status: 400 }
      )
    }

    const existingBanner = await Banner.findById(id)
    if (!existingBanner) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        { status: 404 }
      )
    }

    const updateData: { image?: string; link?: string } = {}

    // Handle image update
    if (img) {
      // Delete old image from Cloudinary
      if (existingBanner.image) {
        await deleteFromCloudinary(existingBanner.image)
      }
      // Upload new image
      const newImageUrl = await uploadToCloudinary(img, "banner")
      updateData.image = newImageUrl
    }

    // Handle link update
    if (link) {
      updateData.link = link
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true,
    })

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      banner: updatedBanner,
    })
  } catch (error) {
    console.error("Error updating banner:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    )
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDb()
    const id = (await params).id

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner ID is required",
        },
        { status: 400 }
      )
    }

    const existingBanner = await Banner.findByIdAndDelete(id, {
      new: true,
    })

    if (!existingBanner) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      banner: existingBanner,
    })
  } catch (error) {
    console.error("Error updating banner:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    )
  }
}
