import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    companyName: { type: String, default: "" },
    companyAddress: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    taxId: { type: String, default: "" },
    defaultTaxRate: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    dueDateTerms: { type: Number, default: 14 },
    paymentMethods: { type: String, default: "" },
    invoiceCounter: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
