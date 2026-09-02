import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Pencil, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Button from "../components/Button.jsx";

const STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"];

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const currency = user?.currency || "USD";
  const fmt = (n) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n || 0);

  const load = () => {
    api
      .get(`/invoices/${id}`)
      .then(({ data }) => setInvoice(data))
      .catch(() => toast.error("Couldn't load invoice"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/invoices/${id}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Couldn't generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusChange = async (status) => {
    setUpdatingStatus(true);
    // optimistic update
    setInvoice((prev) => ({ ...prev, status }));
    try {
      await api.patch(`/invoices/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Couldn't update status");
      load();
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this invoice? This can't be undone.")) return;
    try {
      await api.delete(`/invoices/${id}`);
      toast.success("Invoice deleted");
      navigate("/invoices");
    } catch {
      toast.error("Couldn't delete invoice");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => navigate("/invoices")}
          className="flex items-center gap-1.5 text-sm font-medium text-textSecondary hover:text-textPrimary"
        >
          <ArrowLeft size={16} /> Back to invoices
        </button>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Download PDF
          </Button>
          <Link to={`/invoices/${id}/edit`}>
            <Button variant="secondary">
              <Pencil size={16} /> Edit
            </Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-borderColor bg-surface p-6 shadow-card sm:p-10"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="font-display text-xl font-semibold text-primary">
              {user?.companyName || user?.name}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm text-textSecondary">
              {user?.companyAddress}
            </p>
            {user?.taxId && (
              <p className="mt-1 text-sm text-textSecondary">Tax ID: {user.taxId}</p>
            )}
          </div>
          <div className="text-left sm:text-right">
            <p className="font-display text-2xl font-semibold text-textPrimary">INVOICE</p>
            <p className="mt-1 text-sm text-textSecondary">{invoice.invoiceNumber}</p>
            <div className="mt-2 flex items-center gap-2 sm:justify-end">
              <StatusBadge status={invoice.status} />
              <select
                value={invoice.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="rounded-lg border border-borderColor px-2 py-1 text-xs outline-none focus:border-primary"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    Mark as {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="my-6 border-t border-borderColor" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-textSecondary">Bill to</p>
            <p className="mt-1 font-medium text-textPrimary">{invoice.clientId?.name}</p>
            <p className="text-sm text-textSecondary">{invoice.clientId?.email}</p>
            <p className="whitespace-pre-line text-sm text-textSecondary">
              {invoice.clientId?.address}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase text-textSecondary">Issue date</p>
            <p className="text-sm text-textPrimary">
              {new Date(invoice.issueDate).toLocaleDateString()}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase text-textSecondary">Due date</p>
            <p className="text-sm text-textPrimary">
              {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-borderColor">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-2.5 font-medium">Description</th>
                <th className="px-4 py-2.5 text-right font-medium">Qty</th>
                <th className="px-4 py-2.5 text-right font-medium">Rate</th>
                <th className="px-4 py-2.5 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((it, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-slate-50" : ""}>
                  <td className="px-4 py-2.5 text-textPrimary">{it.description}</td>
                  <td className="px-4 py-2.5 text-right text-textSecondary">{it.quantity}</td>
                  <td className="px-4 py-2.5 text-right text-textSecondary">{fmt(it.rate)}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-textPrimary">
                    {fmt(it.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-textSecondary">Subtotal</span>
              <span className="text-textPrimary">{fmt(invoice.subtotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-textSecondary">Discount</span>
                <span className="text-textPrimary">-{fmt(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-textSecondary">Tax ({invoice.taxRate}%)</span>
              <span className="text-textPrimary">{fmt(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-primary px-3 py-2.5 text-white">
              <span className="font-medium">Total</span>
              <span className="font-display font-semibold">{fmt(invoice.total)}</span>
            </div>
          </div>
        </div>

        {(invoice.notes || invoice.terms) && (
          <div className="mt-6 space-y-3 border-t border-borderColor pt-6 text-sm">
            {invoice.notes && (
              <div>
                <p className="text-xs font-semibold uppercase text-textSecondary">Notes</p>
                <p className="mt-1 whitespace-pre-line text-textPrimary">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <p className="text-xs font-semibold uppercase text-textSecondary">Payment terms</p>
                <p className="mt-1 whitespace-pre-line text-textPrimary">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default InvoiceDetail;
