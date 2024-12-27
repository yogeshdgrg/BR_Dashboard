import { connectDb } from "@/lib/db"
import Testimonail from "@/lib/models/testimonials"
import { uploadToCloudinary } from "@/utils/cloudinary"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  try {
    await connectDb()

    const formData = await req.formData()
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const reviewDescription = formData.get("reviewDescription") as string
    const imgFile = formData.get("img") as File



    // Upload the image to Cloudinary
    let imgUrl = ""
    if (imgFile) {
      imgUrl = await uploadToCloudinary(imgFile, "testimonials")
    }

    // Create the testimonial document
    const response = await Testimonail.create({
      name,
      position,
      reviewDescription,
      img: imgUrl,
    })

    if (response) {
      return NextResponse.json({
        success: true,
        message: "Your review added. Thank you!",
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to add review.",
      })
    }
  } catch {
    return NextResponse.json({
      success: false,
      message: "Failed to add review.",
    })
  }
}

export const GET = async () => {
  try {
    await connectDb()

    const testimonials = await Testimonail.find({})

    if (testimonials) {
      return NextResponse.json({
        success: true,
        testimonials,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Testimonial lists unavailable.",
      })
    }
  } catch {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch the testimonial lists.",
    })
  }
}
