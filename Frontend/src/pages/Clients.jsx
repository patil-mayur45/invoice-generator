import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Users, Pencil, Trash2, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios.js";
import { useDebounce } from "../hooks/useDebounce.js";
import EmptyState from "../components/EmptyState.jsx";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";
import { SkeletonRow } from "../components/Skeleton.jsx";

const emptyForm = { name: "", email: "", phone: "", address: "" };

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/clients", { params: { search: debouncedSearch } });
      setClients(data);
    } catch {
      toast.error("Couldn't load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (client) => {
    setEditingId(client._id);
    setForm({
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Client name is required");
    setSubmitting(true);
    try {
      if (editingId) {
        const { data } = await api.put(`/clients/${editingId}`, form);
        setClients((prev) => prev.map((c) => (c._id === editingId ? data : c)));
        toast.success("Client updated");
      } else {
        const { data } = await api.post("/clients", form);
        setClients((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
        toast.success("Client added");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save client");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this client?")) return;
    try {
      await api.delete(`/clients/${id}`);
      setClients((prev) => prev.filter((c) => c._id !== id));
      toast.success("Client deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete client");
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
            placeholder="Search clients..."
            className="w-full rounded-lg border border-borderColor bg-surface py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Add client
        </Button>
      </div>

      {loading ? (
        <div className="overflow-hidden rounded-xl border border-borderColor bg-surface shadow-card">
          {[1, 2, 3].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-xl border border-borderColor bg-surface p-6 shadow-card">
          <EmptyState
            icon={Users}
            title="No clients yet"
            description="Add a client to start creating invoices for them."
            action={
              <Button onClick={openCreate}>
                <Plus size={16} /> Add client
              </Button>
            }
          />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {clients.map((client) => (
              <motion.div
                key={client._id}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -3 }}
                className="rounded-xl border border-borderColor bg-surface p-5 shadow-card transition-shadow hover:shadow-cardHover"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-50 font-display font-semibold text-primary">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(client)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-textSecondary hover:bg-slate-100"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-danger hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="mt-3 font-medium text-textPrimary">{client.name}</p>
                {client.email && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-textSecondary">
                    <Mail size={13} /> {client.email}
                  </p>
                )}
                {client.phone && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-textSecondary">
                    <Phone size={13} /> {client.phone}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit client" : "Add client"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-textPrimary">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Client or company name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-textPrimary">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="client@email.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-textPrimary">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="+1 555 000 0000"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-textPrimary">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {editingId ? "Save changes" : "Add client"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Clients;
