import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DollarSign, FileText, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import api from "../lib/axios.js";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { SkeletonCard, SkeletonRow } from "../components/Skeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/dashboard/stats")
      .then(({ data }) => mounted && setStats(data))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const currency = user?.currency || "USD";
  const fmt = (n) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n || 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="rounded-xl border border-borderColor bg-surface p-5">
          <div className="shimmer h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={stats.totalRevenue}
          prefix={currency === "USD" ? "$" : ""}
          decimals={0}
          icon={DollarSign}
          accent="secondary"
        />
        <StatCard label="Total invoices" value={stats.totalInvoices} icon={FileText} accent="primary" />
        <StatCard label="Paid" value={stats.paid} icon={CheckCircle2} accent="secondary" />
        <StatCard label="Pending / Overdue" value={stats.pending + stats.overdue} icon={Clock} accent="warning" />
      </motion.div>

      <motion.div
        variants={item}
        className="rounded-xl border border-borderColor bg-surface p-5 shadow-card"
      >
        <h2 className="mb-4 font-display text-base font-semibold text-textPrimary">
          Monthly revenue
        </h2>
        {stats.monthlyRevenue?.length ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyRevenue}>
                <CartesianGrid vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#F8FAFC" }}
                  formatter={(value) => fmt(value)}
                  contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }}
                />
                <Bar dataKey="revenue" fill="#4F46E5" radius={[6, 6, 0, 0]} animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-textSecondary">
            No paid invoices yet — revenue will chart here once you get paid.
          </p>
        )}
      </motion.div>

      <motion.div
        variants={item}
        className="rounded-xl border border-borderColor bg-surface shadow-card"
      >
        <div className="flex items-center justify-between border-b border-borderColor px-5 py-4">
          <h2 className="font-display text-base font-semibold text-textPrimary">Recent invoices</h2>
          <Link to="/invoices" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>

        {stats.recentInvoices?.length ? (
          <motion.div variants={container} initial="hidden" animate="show">
            {stats.recentInvoices.map((inv) => (
              <motion.div key={inv._id} variants={item}>
                <Link
                  to={`/invoices/${inv._id}`}
                  className="flex items-center justify-between gap-4 border-b border-borderColor px-5 py-4 text-sm transition-colors last:border-0 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-textPrimary">{inv.invoiceNumber}</p>
                    <p className="text-textSecondary">{inv.clientId?.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-textPrimary">{fmt(inv.total)}</span>
                    <StatusBadge status={inv.status} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="p-5">
            <EmptyState
              icon={FileText}
              title="No invoices yet"
              description="Create your first invoice to see it appear here."
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
