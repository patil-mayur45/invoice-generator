import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber.jsx";

const StatCard = ({ label, value, prefix = "", decimals = 0, icon: Icon, accent = "primary" }) => {
  const accents = {
    primary: "bg-indigo-50 text-primary",
    secondary: "bg-emerald-50 text-secondary",
    warning: "bg-amber-50 text-warning",
    danger: "bg-red-50 text-danger",
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-xl border border-borderColor bg-surface p-5 shadow-card hover:shadow-cardHover transition-shadow"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-textSecondary">{label}</p>
        {Icon && (
          <div className={`grid h-9 w-9 place-items-center rounded-lg ${accents[accent]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-textPrimary">
        <AnimatedNumber value={value} prefix={prefix} decimals={decimals} />
      </p>
    </motion.div>
  );
};

export default StatCard;
