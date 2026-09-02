import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import { generateInvoiceNumber } from "../utils/generateInvoiceNumber.js";
import { buildInvoicePDF } from "../utils/pdfGenerator.js";

const computeTotals = (items = [], taxRate = 0, discount = 0) => {
  const subtotal = items.reduce((sum, item) => {
    const amount = Number(item.quantity || 0) * Number(item.rate || 0);
    return sum + amount;
  }, 0);
  const normalizedItems = items.map((item) => ({
    ...item,
    amount: Number(item.quantity || 0) * Number(item.rate || 0),
  }));
  const taxAmount = (subtotal - Number(discount || 0)) * (Number(taxRate || 0) / 100);
  const total = subtotal - Number(discount || 0) + taxAmount;
  return { items: normalizedItems, subtotal, taxAmount, total };
};

export const getInvoices = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10, clientId } = req.query;
    const query = { userId: req.user._id };
    if (status && status !== "all") query.status = status;
    if (clientId) query.clientId = clientId;
    if (search) query.invoiceNumber = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .populate("clientId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Invoice.countDocuments(query),
    ]);

    res.json({
      invoices,
      total,
      page: Number(page),
      totalPages: Math.max(1, Math.ceil(total / Number(limit))),
    });
  } catch (err) {
    next(err);
  }
};

export const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user._id }).populate(
      "clientId"
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const { clientId, issueDate, dueDate, items, taxRate, discount, notes, terms, status } =
      req.body;

    if (!clientId) return res.status(400).json({ message: "Client is required" });
    const client = await Client.findOne({ _id: clientId, userId: req.user._id });
    if (!client) return res.status(400).json({ message: "Client not found" });

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Add at least one line item" });
    }

    const invoiceNumber = await generateInvoiceNumber(req.user._id);
    const { items: normalizedItems, subtotal, taxAmount, total } = computeTotals(
      items,
      taxRate,
      discount
    );

    const invoice = await Invoice.create({
      userId: req.user._id,
      clientId,
      invoiceNumber,
      issueDate: issueDate || new Date(),
      dueDate,
      items: normalizedItems,
      subtotal,
      taxRate: taxRate || 0,
      taxAmount,
      discount: discount || 0,
      total,
      status: status || "draft",
      notes,
      terms,
    });

    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
};

export const updateInvoice = async (req, res, next) => {
  try {
    const existing = await Invoice.findOne({ _id: req.params.id, userId: req.user._id });
    if (!existing) return res.status(404).json({ message: "Invoice not found" });

    const { items, taxRate, discount } = req.body;
    let update = { ...req.body };

    if (items) {
      const { items: normalizedItems, subtotal, taxAmount, total } = computeTotals(
        items,
        taxRate ?? existing.taxRate,
        discount ?? existing.discount
      );
      update = { ...update, items: normalizedItems, subtotal, taxAmount, total };
    }

    const invoice = await Invoice.findByIdAndUpdate(existing._id, update, {
      new: true,
      runValidators: true,
    }).populate("clientId");

    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    next(err);
  }
};

export const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["draft", "sent", "paid", "overdue", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    ).populate("clientId");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

export const downloadInvoicePDF = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user._id }).populate(
      "clientId"
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoice.invoiceNumber}.pdf`
    );

    buildInvoicePDF({ invoice, user: req.user }, res);
  } catch (err) {
    next(err);
  }
};
