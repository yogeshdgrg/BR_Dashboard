import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.SECRETKEY);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value; // Extract token value

  if (!token) {
    return NextResponse.json({
      message: "Token missing.",
      success: false,
    });
  }

  try {
    const { payload } = await jwtVerify(token, secretKey); // Verify token
    console.log("Decoded Token:", payload); // Log the decoded payload
    return NextResponse.next();
  } catch (error) {
    // console.error("JWT Verification Error:", error.message);
    return NextResponse.json({
      message: "Invalid or expired token.",
      success: false,
    });
  }
}

export const config = {
  matcher: "/admin/:path*", // Apply middleware to this route
};
