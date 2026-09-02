import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Receipt, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Must be at least 6 characters"),
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await registerUser(data);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-xl border border-borderColor bg-surface p-8 shadow-card"
      >
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white">
            <Receipt size={20} />
          </div>
          <span className="font-display text-xl font-semibold text-textPrimary">Invoicely</span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-textPrimary">Create your account</h1>
        <p className="mt-1 text-sm text-textSecondary">Start sending professional invoices.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-textPrimary">Full name</label>
            <input
              {...register("name")}
              className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Jordan Reyes"
            />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-textPrimary">
              Company name <span className="text-textSecondary">(optional)</span>
            </label>
            <input
              {...register("companyName")}
              className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Acme Studio"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-textPrimary">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="you@company.com"
            />
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-textPrimary">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-lg border border-borderColor px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -1 }}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-70"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Create account
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-textSecondary">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
