import { motion } from "framer-motion";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "bg-white text-textPrimary border border-borderColor hover:bg-slate-50",
  danger: "bg-red-50 text-danger hover:bg-red-100",
  ghost: "text-textSecondary hover:bg-slate-100",
};

const Button = ({ children, variant = "primary", className = "", ...props }) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    whileHover={{ y: -1 }}
    transition={{ duration: 0.15 }}
    className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export default Button;
