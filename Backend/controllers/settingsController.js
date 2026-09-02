import User from "../models/User.js";

export const updateSettings = async (req, res, next) => {
  try {
    const allowedFields = [
      "companyName",
      "companyAddress",
      "companyLogo",
      "taxId",
      "defaultTaxRate",
      "currency",
      "dueDateTerms",
      "paymentMethods",
      "name",
    ];
    const update = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      companyAddress: user.companyAddress,
      companyLogo: user.companyLogo,
      taxId: user.taxId,
      defaultTaxRate: user.defaultTaxRate,
      currency: user.currency,
      dueDateTerms: user.dueDateTerms,
      paymentMethods: user.paymentMethods,
    });
  } catch (err) {
    next(err);
  }
};
