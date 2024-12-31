import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Admin from "@/lib/models/admin";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRETKEY as string;

export async function POST(req: NextRequest) {
  try {
    console.log("I am post function.");
    await connectDb();
    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });

    console.log("In login Admin: ", admin);

    if (!admin) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          message: "Not authenticate user.",
          ok: false,
        },
        { status: 401 }
      );
    }

    if (!admin.isAdmin) {
      return NextResponse.json(
        {
          message: "Sorry not Admin.",
          ok: false,
        },
        { status: 403 }
      );
    }

    if (!password || !(await admin.comparePassword(password))) {
      console.log("I am in password checking");
      return NextResponse.json(
        {
          message: "Invalid password or email...",
          ok: false,
        },
        { status: 401 }
      );
    }

    const payload = {
      email: admin.email,
      isAdmin: admin.isAdmin,
    };

    const token = jwt.sign(payload, secretKey);

    const res = NextResponse.json({ message: "Login successful", ok: true });
    res.cookies.set("auth_token", token, { httpOnly: true });
    return res;
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        ok: false,
      },
      { status: 500 }
    );
  }
}
