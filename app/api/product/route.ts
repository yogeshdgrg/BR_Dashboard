import { addProduct, getProduct } from "@/app/services/product"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  const response = await addProduct(req)
  if (response?.success) {
    return NextResponse.json(response, { status: 200 })
  } else {
    return NextResponse.json(response, { status: 500 })
  }
}

export const GET = async () => {
  const response = await getProduct()
  if (response?.success) {
    return NextResponse.json(response, { status: 200 })
  } else {
    return NextResponse.json(response, { status: 500 })
  }
}


