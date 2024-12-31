import { Document, model, Schema } from "mongoose"
import { models } from "mongoose"

export interface INews extends Document {
  title: string
  description: string
  img: string
  author: string
  date?: Date
}

const newsSchema = new Schema<INews>({
  title: {
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
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

const News = models.News || model<INews>("News", newsSchema)

export default News
