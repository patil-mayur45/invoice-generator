import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  X,
  Receipt,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/invoices", label: "Invoices", icon: FileText },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

const NavItems = ({ onNavigate }) => (
  <nav className="flex flex-col gap-1 px-3">
    {links.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive
              ? "bg-primary text-white shadow-sm"
              : "text-textSecondary hover:bg-slate-100 hover:text-textPrimary"
          }`
        }
      >
        <Icon size={18} />
        {label}
      </NavLink>
    ))}
  </nav>
);

const Sidebar = ({ mobileOpen, onClose }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-borderColor lg:bg-surface lg:py-6">
        <div className="mb-8 flex items-center gap-2 px-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white">
            <Receipt size={18} />
          </div>
          <span className="font-display text-lg font-semibold text-textPrimary">Invoicely</span>
        </div>
        <NavItems />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface py-6 shadow-2xl lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between px-5">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white">
                    <Receipt size={18} />
                  </div>
                  <span className="font-display text-lg font-semibold text-textPrimary">
                    Invoicely
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-lg text-textSecondary hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>
              <NavItems onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
