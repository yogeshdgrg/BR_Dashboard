import { connectDb } from "@/lib/db"
import Contact from "@/lib/models/contact"
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const POST = async (req: NextRequest) => {
  try {
    await connectDb()
    const body = await req.json()

    // Validate required fields
    if (!body.email || !body.name || !body.message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }

    const response = await Contact.create(body)
    // console.log("Response : ", response)

    if (response) {
      const transporter = nodemailer.createTransport({
        service: "Gmail", // Use your email service (e.g., Gmail, Outlook)
        auth: {
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASS, // Your email password or app password
        },
      })

      // Email to the product owner
      const ownerEmailOptions = {
        from: body.email,
        to: "yogeshgrg83@gmail.com",
        subject: `Contact Message from ${body.name}`,
        text: body.message,
      }

      try {
        await transporter.sendMail(ownerEmailOptions)
      } catch (emailError) {
        console.error("Failed to send email:", emailError)
        return NextResponse.json(
          {
            success: false,
            message: "Contact saved but failed to send email",
            contact: response,
          },
          { status: 500 }
        )
      }


      return NextResponse.json({
        success: true,
        message: "Your message has sent successfully",
        contact: response,
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Your message has not been sent successfully",
      err: error.message,
    })
  }
}
