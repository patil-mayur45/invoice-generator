import PDFDocument from "pdfkit";

const INDIGO = "#4F46E5";
const SLATE_800 = "#1E293B";
const SLATE_500 = "#64748B";
const SLATE_200 = "#E2E8F0";
const EMERALD = "#10B981";
const RED = "#EF4444";
const AMBER = "#F59E0B";

const statusColor = (status) => {
  if (status === "paid") return EMERALD;
  if (status === "overdue") return RED;
  if (status === "sent") return AMBER;
  return SLATE_500;
};

const money = (n, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n || 0);
  } catch {
    return `$${Number(n || 0).toFixed(2)}`;
  }
};

// Streams a professional invoice PDF directly to the response.
export const buildInvoicePDF = ({ invoice, user }, res) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(res);

  const currency = user.currency || "USD";

  // Header
  doc
    .fillColor(INDIGO)
    .fontSize(22)
    .font("Helvetica-Bold")
    .text(user.companyName || user.name, 50, 50);

  doc
    .fillColor(SLATE_500)
    .fontSize(9)
    .font("Helvetica")
    .text(user.companyAddress || "", 50, 78, { width: 250 });
  if (user.taxId) doc.text(`Tax ID: ${user.taxId}`, 50, doc.y);

  doc
    .fillColor(SLATE_800)
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("INVOICE", 350, 50, { width: 200, align: "right" });

  doc
    .fillColor(SLATE_500)
    .fontSize(10)
    .font("Helvetica")
    .text(invoice.invoiceNumber, 350, 78, { width: 200, align: "right" });

  const badgeColor = statusColor(invoice.status);
  doc
    .fillColor(badgeColor)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(invoice.status.toUpperCase(), 350, 94, { width: 200, align: "right" });

  doc.moveTo(50, 130).lineTo(545, 130).strokeColor(SLATE_200).stroke();

  // Bill to / dates
  doc
    .fillColor(SLATE_500)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("BILL TO", 50, 150);
  doc
    .fillColor(SLATE_800)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(invoice.clientId?.name || "Client", 50, 165);
  doc
    .fillColor(SLATE_500)
    .fontSize(9)
    .font("Helvetica")
    .text(invoice.clientId?.email || "", 50, 181)
    .text(invoice.clientId?.address || "", 50, 194, { width: 220 });

  doc
    .fillColor(SLATE_500)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("ISSUE DATE", 350, 150, { width: 200, align: "right" });
  doc
    .fillColor(SLATE_800)
    .fontSize(10)
    .font("Helvetica")
    .text(new Date(invoice.issueDate).toLocaleDateString(), 350, 163, {
      width: 200,
      align: "right",
    });

  doc
    .fillColor(SLATE_500)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("DUE DATE", 350, 183, { width: 200, align: "right" });
  doc
    .fillColor(SLATE_800)
    .fontSize(10)
    .font("Helvetica")
    .text(new Date(invoice.dueDate).toLocaleDateString(), 350, 196, {
      width: 200,
      align: "right",
    });

  // Items table
  let y = 250;
  doc.rect(50, y, 495, 24).fill(INDIGO);
  doc
    .fillColor("#FFFFFF")
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("DESCRIPTION", 60, y + 8)
    .text("QTY", 320, y + 8, { width: 50, align: "right" })
    .text("RATE", 380, y + 8, { width: 70, align: "right" })
    .text("AMOUNT", 460, y + 8, { width: 75, align: "right" });

  y += 24;
  invoice.items.forEach((item, i) => {
    const rowHeight = 26;
    if (i % 2 === 1) {
      doc.rect(50, y, 495, rowHeight).fill("#F8FAFC");
    }
    doc
      .fillColor(SLATE_800)
      .fontSize(9.5)
      .font("Helvetica")
      .text(item.description, 60, y + 8, { width: 250 })
      .text(String(item.quantity), 320, y + 8, { width: 50, align: "right" })
      .text(money(item.rate, currency), 380, y + 8, { width: 70, align: "right" })
      .text(money(item.amount, currency), 460, y + 8, { width: 75, align: "right" });
    y += rowHeight;
  });

  doc.moveTo(50, y).lineTo(545, y).strokeColor(SLATE_200).stroke();
  y += 15;

  const totalsX = 350;
  const rows = [
    ["Subtotal", money(invoice.subtotal, currency)],
    ...(invoice.discount ? [["Discount", `-${money(invoice.discount, currency)}`]] : []),
    [`Tax (${invoice.taxRate}%)`, money(invoice.taxAmount, currency)],
  ];
  rows.forEach(([label, value]) => {
    doc
      .fillColor(SLATE_500)
      .fontSize(10)
      .font("Helvetica")
      .text(label, totalsX, y, { width: 100 })
      .fillColor(SLATE_800)
      .text(value, totalsX + 100, y, { width: 95, align: "right" });
    y += 18;
  });

  doc.rect(totalsX, y, 195, 30).fill(INDIGO);
  doc
    .fillColor("#FFFFFF")
    .fontSize(11)
    .font("Helvetica-Bold")
    .text("TOTAL", totalsX + 10, y + 9)
    .text(money(invoice.total, currency), totalsX + 100, y + 9, { width: 85, align: "right" });

  y += 55;

  if (invoice.notes) {
    doc
      .fillColor(SLATE_500)
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("NOTES", 50, y);
    doc
      .fillColor(SLATE_800)
      .fontSize(9.5)
      .font("Helvetica")
      .text(invoice.notes, 50, y + 14, { width: 495 });
    y = doc.y + 15;
  }

  if (invoice.terms) {
    doc
      .fillColor(SLATE_500)
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("PAYMENT TERMS", 50, y);
    doc
      .fillColor(SLATE_800)
      .fontSize(9.5)
      .font("Helvetica")
      .text(invoice.terms, 50, y + 14, { width: 495 });
  }

  doc.end();
};
