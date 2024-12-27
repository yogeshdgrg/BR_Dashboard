import { connectDb } from "@/lib/db"
import Admin from "@/lib/models/admin"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"


export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()
    await connectDb()
    console.log(body)
    // Manually hash the password before saving
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(body.password, salt)

    // Create the admin object with the hashed password
    const admin = await Admin.create({
      ...body,
      password: hashedPassword, // Ensure the password is hashed
    })

    console.log("Admin : ",admin)

    if (!admin)
      return NextResponse.json({
        success: false,
        message: "Admin account not created.",
      })
    return NextResponse.json({
      success: true,
      admin,
      message: "Admin created.",
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: "Internal Server error.",
        error: error.message,
      })
    }
  }
}
