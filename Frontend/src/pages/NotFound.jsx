import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Receipt } from "lucide-react";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-indigo-50 text-primary">
        <Receipt size={26} />
      </div>
      <h1 className="font-display text-3xl font-semibold text-textPrimary">Page not found</h1>
      <p className="mt-2 text-sm text-textSecondary">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
      >
        Back to dashboard
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
