import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import api from "../lib/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    companyName: user?.companyName || "",
    companyAddress: user?.companyAddress || "",
    taxId: user?.taxId || "",
    defaultTaxRate: user?.defaultTaxRate || 0,
    currency: user?.currency || "USD",
    dueDateTerms: user?.dueDateTerms || 14,
    paymentMethods: user?.paymentMethods || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.put("/settings", form);
      updateUser(data);
      toast.success("Settings saved");
    } catch {
      toast.error("Couldn't save settings");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-textPrimary">Settings</h1>
        <p className="mt-1 text-sm text-textSecondary">
          Update your company profile and invoice defaults.
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="rounded-xl border border-borderColor bg-surface p-5 shadow-card">
          <h2 className="mb-4 font-display text-base font-semibold text-textPrimary">
            Company profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">Your name</label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">Company name</label>
              <input
                value={form.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">Company address</label>
              <textarea
                value={form.companyAddress}
                onChange={(e) => handleChange("companyAddress", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">Tax ID</label>
              <input
                value={form.taxId}
                onChange={(e) => handleChange("taxId", e.target.value)}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-borderColor bg-surface p-5 shadow-card">
          <h2 className="mb-4 font-display text-base font-semibold text-textPrimary">
            Invoice preferences
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">
                Default tax rate (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.defaultTaxRate}
                onChange={(e) => handleChange("defaultTaxRate", e.target.value)}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textPrimary">
                Default due terms (days)
              </label>
              <input
                type="number"
                min="0"
                value={form.dueDateTerms}
                onChange={(e) => handleChange("dueDateTerms", e.target.value)}
                className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-textPrimary">
              Payment methods
            </label>
            <textarea
              value={form.paymentMethods}
              onChange={(e) => handleChange("paymentMethods", e.target.value)}
              rows={2}
              placeholder="Bank transfer, PayPal, etc."
              className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Save settings
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default Settings;
