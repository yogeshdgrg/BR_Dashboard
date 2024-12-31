import { connectDb } from "@/lib/db"
import News from "@/lib/models/news"
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
