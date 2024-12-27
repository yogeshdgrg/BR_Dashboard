import { Document, model, models, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface IAdmin extends Document {
  email: string
  password: string
  isAdmin: boolean
}

const adminSchema = new Schema<IAdmin>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

// adminSchema.pre("save", async function (next) {
//     console.log("I am in pre middleware.")
//   if (!this.isModified("password")) {
//     return next() // Skip if password is not modified
//   }

//   try {
//     // Generate salt for bcrypt
//     const salt = await bcrypt.genSalt(10)
//     // Encrypt the password using the generated salt
//     this.password = await bcrypt.hash(this.password, salt)
//     next()
//   } catch (err) {
//     if (err instanceof Error) {
//       next(err)
//     }
//   }
// })

adminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
  }

const Admin = models.Admin || model<IAdmin>("Admin", adminSchema)

export default Admin
