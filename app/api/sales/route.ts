// app/api/sales/route.ts
import { NextResponse } from "next/server";
import Order from "@/lib/models/order";
import { connectDb } from "@/lib/db";

interface MonthlySalesData {
  month: number;
  totalAmount: number;
  orderCount: number;
  productsSold: number;
  categoryBreakdown: Record<string, { count: number; revenue: number }>;
}

export async function GET() {
  try {
    await connectDb();

    const currentYear = new Date().getFullYear();

    const monthlyData = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31),
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            category: "$productDetails.category",
          },
          totalAmount: {
            $sum: { $multiply: ["$quantity", "$productDetails.price"] },
          },
          orderCount: { $sum: 1 },
          productsSold: { $sum: "$quantity" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          totalAmount: { $sum: "$totalAmount" },
          orderCount: { $sum: "$orderCount" },
          productsSold: { $sum: "$productsSold" },
          categoryBreakdown: {
            $push: {
              category: "$_id.category",
              count: "$productsSold",
              revenue: "$totalAmount",
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Fill in missing months with zero values
    const filledData: MonthlySalesData[] = Array.from(
      { length: 12 },
      (_, i) => {
        const existingData = monthlyData.find((item) => item._id === i + 1);
        return {
          month: i + 1,
          totalAmount: existingData?.totalAmount || 0,
          orderCount: existingData?.orderCount || 0,
          productsSold: existingData?.productsSold || 0,
          categoryBreakdown:
            existingData?.categoryBreakdown?.reduce(
              (
                acc: Record<string, { count: number; revenue: number }>,
                curr: { category: string; count: number; revenue: number }
                // check this once might not work
              ) => ({
                ...acc,
                [curr.category]: {
                  count: curr.count,
                  revenue: curr.revenue,
                },
              }),
              {}
            ) || {},
        };
      }
    );

    return NextResponse.json({
      success: true,
      data: filledData,
      message: "Monthly sales data fetched successfully",
    });
  } catch (error) {
    console.error("Error in sales API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching monthly sales data",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
