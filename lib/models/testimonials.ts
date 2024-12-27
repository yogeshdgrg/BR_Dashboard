import { Schema, models, model, Document } from "mongoose"

export interface ITestimonal extends Document {
  name: string
  designation: string
  reviewDescription: string
  position: string
  img: string
  stars: number
}

const testimonialSchema = new Schema<ITestimonal>({
  name: {
    type: String,
    required: true,
  },
  reviewDescription: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    default: 5,
  },
})

const Testimonail =
  models.Testimonail || model<ITestimonal>("Testimonail", testimonialSchema)

export default Testimonail
