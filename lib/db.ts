import mongoose from "mongoose"

const url = process.env.MONGODB_URI as string
export const connectDb = async () => {
  try {
    await mongoose.connect(url)
    console.log("Database connected...")
  } catch (err) {
    console.log("Failed to connect the database...", err)
  }
}
