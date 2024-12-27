import { Schema, models, model, Document } from "mongoose"

export interface IContact extends Document {
  name: string
  email: string
  phone: string
  company_name: string
  message: string
}

export const contactSchema = new Schema<IContact>({
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
  company_name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
})

const Contact = models.Contact || model<IContact>("Contact", contactSchema)

export default Contact
