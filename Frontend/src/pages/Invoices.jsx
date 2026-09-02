import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, FileText, Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Button from "../components/Button.jsx";
import { SkeletonRow } from "../components/Skeleton.jsx";

const STATUS_TABS = ["all", "draft", "sent", "paid", "overdue", "cancelled"];

const Invoices = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [deletingId, setDeletingId] = useState(null);

  const currency = user?.currency || "USD";
  const fmt = (n) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n || 0);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/invoices", {
        params: { status, search: debouncedSearch, limit: 50 },
      });
      setInvoices(data.invoices);
    } catch {
      toast.error("Couldn't load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, debouncedSearch]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this invoice? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/invoices/${id}`);
      setInvoices((prev) => prev.filter((i) => i._id !== id));
      toast.success("Invoice deleted");
    } catch {
      toast.error("Couldn't delete invoice");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (id, invoiceNumber) => {
    try {
      const res = await api.get(`/invoices/${id}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Couldn't generate PDF");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice number..."
            className="w-full rounded-lg border border-borderColor bg-surface py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button onClick={() => navigate("/invoices/new")} className="sm:w-auto">
          <Plus size={16} /> New invoice
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatus(tab)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
              status === tab
                ? "border-primary bg-primary text-white"
                : "border-borderColor bg-surface text-textSecondary hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-borderColor bg-surface shadow-card">
        {loading ? (
          <div>
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={FileText}
              title="No invoices found"
              description="Try a different filter, or create your first invoice."
              action={
                <Button onClick={() => navigate("/invoices/new")}>
                  <Plus size={16} /> New invoice
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead>
                <tr className="border-b border-borderColor bg-slate-50 text-xs uppercase text-textSecondary">
                  <th className="px-5 py-3 font-medium">Invoice</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Due date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Total</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {invoices.map((inv) => (
                    <motion.tr
                      key={inv._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ backgroundColor: "#F8FAFC" }}
                      className="border-b border-borderColor last:border-0"
                    >
                      <td className="px-5 py-3.5">
                        <Link to={`/invoices/${inv._id}`} className="font-medium text-primary hover:underline">
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-textPrimary">{inv.clientId?.name}</td>
                      <td className="px-5 py-3.5 text-textSecondary">
                        {new Date(inv.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-textPrimary">
                        {fmt(inv.total)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDownload(inv._id, inv.invoiceNumber)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-textSecondary hover:bg-slate-100"
                            title="Download PDF"
                          >
                            <Download size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(inv._id)}
                            disabled={deletingId === inv._id}
                            className="grid h-8 w-8 place-items-center rounded-lg text-danger hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="divide-y divide-borderColor md:hidden">
              {invoices.map((inv) => (
                <Link
                  key={inv._id}
                  to={`/invoices/${inv._id}`}
                  className="block px-4 py-4 active:bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary">{inv.invoiceNumber}</span>
                    <StatusBadge status={inv.status} />
                  </div>
                  <p className="mt-1 text-sm text-textPrimary">{inv.clientId?.name}</p>
                  <div className="mt-1 flex items-center justify-between text-sm text-textSecondary">
                    <span>Due {new Date(inv.dueDate).toLocaleDateString()}</span>
                    <span className="font-medium text-textPrimary">{fmt(inv.total)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Invoices;
