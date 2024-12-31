// app/api/products/top/route.ts
import { connectDb } from '@/lib/db';
import Order from '@/lib/models/order';
import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/db';
// import Order from '@/models/Order';

export async function GET() {
  try {
    await connectDb();
    
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: "delivered"
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $group: {
          _id: '$product',
          productName: { $first: '$productDetails.name' },
          totalSales: { $sum: '$quantity' },
          totalRevenue: { $sum: { $multiply: ['$quantity', '$productDetails.price'] } },
          category: { $first: '$productDetails.category' }
        }
      },
      {
        $sort: { totalSales: -1 }
      },
      {
        $limit: 5
      }
    ]);

    return NextResponse.json({
      success: true,
      data: topProducts,
      message: "Top products fetched successfully"
    });
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching top products",
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}