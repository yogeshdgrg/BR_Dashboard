import { Document, model, models, Schema } from "mongoose"

export interface IWholesale extends Document {
  name: string
  email: string
  phone: string
  company: string
  companyAddress: string
  businessType?: string
  message?: string
  productList: string[]
}

const wholesaleSchema = new Schema<IWholesale>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
  },
  message: {
    type: String,
  },
  productList: {
    type: [String],
    default: [],
  },
})

const Wholesale =
  models.Wholesale || model<IWholesale>("Wholesale", wholesaleSchema)

export default Wholesale
