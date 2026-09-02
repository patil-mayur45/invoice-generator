import { motion } from "framer-motion";

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="flex flex-col items-center justify-center rounded-xl border border-dashed border-borderColor bg-surface px-6 py-16 text-center"
  >
    {Icon && (
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-indigo-50 text-primary">
        <Icon size={26} />
      </div>
    )}
    <h3 className="font-display text-base font-semibold text-textPrimary">{title}</h3>
    <p className="mt-1.5 max-w-xs text-sm text-textSecondary">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </motion.div>
);

export default EmptyState;
