// types/index.ts
import { Types } from 'mongoose';

export interface Dimensions {
  length: string;
  width: string;
  height: string;
}

export interface Color {
  name: string;
  image: string;
}

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  description: string;
  img: string;
  price: number;
  category: string;
  dimensions: Dimensions;
  colors: Color[];
}

export interface IOrder {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  product: IProduct;
  color: string;
  quantity: number;
  message: string;
  status: string;
  createdAt?: Date;
}

export interface MonthlySalesData {
  month: number;
  totalAmount: number;
  orderCount: number;
  productsSold: number;
  categoryBreakdown?: {
    [key: string]: {
      count: number;
      revenue: number;
    };
  };
}

export interface SalesApiResponse {
  success: boolean;
  data: MonthlySalesData[];
  message: string;
}