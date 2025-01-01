import mongoose, { Types } from "mongoose"
import { Document, model, models, Schema } from "mongoose"
import { IProduct } from "./product"

export interface IOrder extends Document {
  name: string
  email: string
  phone: string
  product: Types.ObjectId | IProduct
  company:string
  size:string
  companyAddress:string
  businessType?:string
  quantity: number
  message: string
  status: string
  createdAt: Date // Add createdAt field
}

const orderSchema = new Schema<IOrder>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String, // Change type to String
    required: [true, "Phone number is required"],
    validate: {
      validator: (v: string) => /^[0-9]{10}$/.test(v), // Check if it's exactly 10 digits and numeric
      message: "Phone number must be exactly 10 numeric digits",
    },
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Order = models.Order || model<IOrder>("Order", orderSchema)
export default Order
