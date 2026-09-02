import User from "../models/User.js";

// Atomically increments the user's invoice counter and returns a
// zero-padded invoice number like INV-0001.
export const generateInvoiceNumber = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { invoiceCounter: 1 } },
    { new: true }
  );
  const padded = String(user.invoiceCounter).padStart(4, "0");
  return `INV-${padded}`;
};
