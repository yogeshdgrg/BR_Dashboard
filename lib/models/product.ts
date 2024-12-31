import { Schema, Document, model, models } from "mongoose"

// Define an interface for Product Colors
interface Image {
  image: string
}

// Define the main Product interface
export interface IProduct extends Document {
  name: string
  description: string
  price: number
  category: string
  sizes: string[] // Changed [string] to string[]
  images: Image[] // Updated to use camelCase for consistency
  feature: string[]
}

// Define the Mongoose Schema
const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sizes: {
      type: [String], // Explicitly defining as an array of strings
      required: true,
    },
    images: {
      type: [
        {
          image: { type: String, required: true }, // Changed Images to images
        },
      ],
    },
    feature: {
      type: [String],
    },
  },
  { timestamps: true } // Enable timestamps
)

// Export the Mongoose Model
const Product = models.Product || model<IProduct>("Product", productSchema)

export default Product
