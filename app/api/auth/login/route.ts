import { NextRequest, NextResponse } from "next/server"
import { connectDb } from "@/lib/db"
import Admin from "@/lib/models/admin"
import jwt from "jsonwebtoken"
// import bcrypt from "bcryptjs"

const secretKey = process.env.SECRETKEY as string

export async function POST(req: NextRequest) {
  try {
    console.log("I am post function.")
    await connectDb()
    const { email, password } = await req.json()

    const admin = await Admin.findOne({
      email,
    })

    console.log("In login Admin: ", admin)

    if (!admin) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          message: "Not authenticate user.",
          ok: false,
        },
        { status: 401 }
      )
    }

    if (!admin.isAdmin) {
      return NextResponse.json({
        message: "Sorry not Admin.",
        ok: false,
      })
    }

    if (!password || !(await admin.comparePassword(password))) {
      console.log("I am in password checking")
      return NextResponse.json({
        message: "Invalid password or email...",
        ok: false,
      })
    }

    const payload = {
      email: admin.email,
      isAdmin: admin.isAdmin,
    }

    const token = await jwt.sign(payload, secretKey)

    const res = NextResponse.json({ message: "Login successful", ok: true })
    res.cookies.set("auth_token", token, { httpOnly: true })
    return res
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }
  }
}
