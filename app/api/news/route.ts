// app/api/news/route.ts
import { NextRequest, NextResponse } from "next/server"
import News from "@/lib/models/news"
import { connectDb } from "@/lib/db"
import { uploadToCloudinary } from "@/utils/cloudinary"

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDb()
    // Get form data from request
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const author = formData.get("author") as string
    const imageFile = formData.get("image") as File

    console.log(title, description, author, imageFile)

    // Validate required fields
    if (!title || !description || !author || !imageFile) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(imageFile, "news")

    // Create news entry in database
    const news = await News.create({
      title,
      description,
      author,
      img: imageUrl,
      date: new Date(),
    })

    return NextResponse.json({
      success: true,
      news,
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: "Error creating news entry" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDb()

    const news = await News.find().sort({ date: -1 })

    return NextResponse.json({
      success: true,
      news,
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 })
  }
}
