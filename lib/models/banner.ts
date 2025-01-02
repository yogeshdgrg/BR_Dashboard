import { Document, model, models, Schema } from "mongoose"

export interface IBanner extends Document {
  image: string
  link?: string
}

const bannerSchema = new Schema<IBanner>(
  {
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const Banner = models.Banner || model<IBanner>("Banner", bannerSchema)

export default Banner
