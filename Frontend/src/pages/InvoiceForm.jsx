import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";

const emptyItem = () => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  rate: 0,
});

const InvoiceForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([emptyItem()]);
  const [taxRate, setTaxRate] = useState(user?.defaultTaxRate || 0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/clients").then(({ data }) => setClients(data));
  }, []);

  useEffect(() => {
    if (!isEdit) {
      const due = new Date();
      due.setDate(due.getDate() + (user?.dueDateTerms || 14));
      setDueDate(due.toISOString().slice(0, 10));
      return;
    }
    api
      .get(`/invoices/${id}`)
      .then(({ data }) => {
        setClientId(data.clientId?._id || data.clientId);
        setIssueDate(new Date(data.issueDate).toISOString().slice(0, 10));
        setDueDate(new Date(data.dueDate).toISOString().slice(0, 10));
        setItems(
          data.items.map((it) => ({ id: crypto.randomUUID(), ...it }))
        );
        setTaxRate(data.taxRate);
        setDiscount(data.discount);
        setNotes(data.notes || "");
        setTerms(data.terms || "");
        setStatus(data.status);
      })
      .catch(() => toast.error("Couldn't load invoice"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateItem = (idx, field, value) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it))
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (idx) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.quantity || 0) * Number(it.rate || 0),
    0
  );
  const taxAmount = (subtotal - Number(discount || 0)) * (Number(taxRate || 0) / 100);
  const total = subtotal - Number(discount || 0) + taxAmount;

  const currency = user?.currency || "USD";
  const fmt = (n) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) return toast.error("Select a client");
    if (items.some((it) => !it.description.trim())) {
      return toast.error("Every line item needs a description");
    }

    setSubmitting(true);
    const payload = {
      clientId,
      issueDate,
      dueDate,
      items: items.map(({ description, quantity, rate }) => ({
        description,
        quantity: Number(quantity),
        rate: Number(rate),
      })),
      taxRate: Number(taxRate),
      discount: Number(discount),
      notes,
      terms,
      status,
    };

    try {
      if (isEdit) {
        await api.put(`/invoices/${id}`, payload);
        toast.success("Invoice updated");
        navigate(`/invoices/${id}`);
      } else {
        const { data } = await api.post("/invoices", payload);
        toast.success("Invoice created");
        navigate(`/invoices/${data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save invoice");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-textSecondary hover:text-textPrimary"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="font-display text-2xl font-semibold text-textPrimary">
        {isEdit ? "Edit invoice" : "New invoice"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-borderColor bg-surface p-5 shadow-card">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select a client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {["draft", "sent", "paid", "overdue", "cancelled"].map((s) => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">Issue date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-borderColor bg-surface p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-textPrimary">Line items</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <Plus size={15} /> Add item
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {items.map((it, idx) => (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-12 items-start gap-2"
                >
                  <input
                    value={it.description}
                    onChange={(e) => updateItem(idx, "description", e.target.value)}
                    placeholder="Description"
                    className="col-span-12 rounded-lg border border-borderColor px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:col-span-6"
                  />
                  <input
                    type="number"
                    min="0"
                    value={it.quantity}
                    onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                    placeholder="Qty"
                    className="col-span-4 rounded-lg border border-borderColor px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:col-span-2"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={it.rate}
                    onChange={(e) => updateItem(idx, "rate", e.target.value)}
                    placeholder="Rate"
                    className="col-span-4 rounded-lg border border-borderColor px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:col-span-3"
                  />
                  <div className="col-span-3 flex items-center justify-end px-1 py-2.5 text-sm font-medium text-textPrimary sm:col-span-1">
                    {fmt(Number(it.quantity || 0) * Number(it.rate || 0))}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="col-span-1 grid h-10 place-items-center rounded-lg text-danger hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-borderColor bg-surface p-5 shadow-card">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Thanks for your business!"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">Payment terms</label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Due within 14 days of receipt."
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-borderColor bg-surface p-5 shadow-card">
            <div className="flex items-center justify-between">
              <label className="text-sm text-textSecondary">Subtotal</label>
              <span className="text-sm font-medium text-textPrimary">{fmt(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-textSecondary">Discount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-28 rounded-lg border border-borderColor px-3 py-1.5 text-right text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-textSecondary">Tax rate (%)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-28 rounded-lg border border-borderColor px-3 py-1.5 text-right text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center justify-between border-t border-borderColor pt-3">
              <span className="font-medium text-textPrimary">Total</span>
              <span className="font-display text-lg font-semibold text-primary">{fmt(total)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Save changes" : "Create invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
