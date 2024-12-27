import { Schema, Document, model, models } from "mongoose"

// Define an interface for Product Dimensions
interface Dimensions {
  length: string
  width: string
  height: string
}

// Define an interface for Product Colors
interface Color {
  name: string
  image: string
}

// Define the main Product interface
export interface IProduct extends Document {
  name: string
  description: string
  img: string
  price: number
  category: string
  dimensions: Dimensions
  colors: Color[]
}

// Define the Mongoose Schema
const productSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  dimensions: {
    length: { type: String },
    width: { type: String },
    height: { type: String },
  },
  colors: [
    {
      name: { type: String },
      image: { type: String },
    },
  ],
})

// Export the Mongoose Model
const Product = models.Product || model<IProduct>("Product", productSchema)

export default Product
