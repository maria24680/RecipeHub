"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ফিক্স ১: স্টেট ডিফাইন করা হয়েছে
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (pass) => {
    const hasMinLength = pass.length >= 6;
    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    return hasMinLength && hasUppercase && hasLowercase;
  };

  const handleCredentialsRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long, contain at least one uppercase letter, and one lowercase letter.");
      setLoading(false);
      return;
    }

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        image: image || undefined,
        callbackURL: "/",
      }, {
        onError: (ctx) => {
          setError(ctx.error.message || "Registration failed. Try again.");
          setLoading(false);
        }
      });
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-white dark:bg-zinc-950 px-6 py-12 transition-colors duration-300 relative overflow-hidden">
      
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 -z-10 w-96 h-96 bg-[#F5726B]/10 dark:bg-zinc-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 12 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-900 rounded-3xl p-8 shadow-xl shadow-gray-100/50 dark:shadow-none"
      >
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-black tracking-tight">
            Join the <span className="text-[#F5726B]">RecipeHub</span> Kitchen
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Create an account to save recipes and connect with food lovers.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-5 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleCredentialsRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chef Gourmet"
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-[#F5726B] dark:focus:border-[#F5726B] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="chef@recipehub.com"
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-[#F5726B] dark:focus:border-[#F5726B] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-[#F5726B] dark:focus:border-[#F5726B] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Password</label>
            
            {/* ফিক্স ২: ইনপুট এবং বাটনকে relative ডিভে রাখা হয়েছে এবং টাইপ ডাইনামিক করা হয়েছে */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl pl-4 pr-16 py-3.5 text-sm font-medium outline-none focus:border-[#F5726B] dark:focus:border-[#F5726B] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#2A6F8F] cursor-pointer hover:text-[#F5726B] transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            <div className="pt-1 flex flex-col gap-1">
              <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${password.length >= 6 ? "text-emerald-500" : "text-gray-400"}`}>
                {password.length >= 6 ? "✓" : "•"} Minimum 6 characters
              </span>
              <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${/[A-Z]/.test(password) ? "text-emerald-500" : "text-gray-400"}`}>
                {/[A-Z]/.test(password) ? "✓" : "•"} One uppercase letter
              </span>
              <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${/[a-z]/.test(password) ? "text-emerald-500" : "text-gray-400"}`}>
                {/[a-z]/.test(password) ? "✓" : "•"} One lowercase letter
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative overflow-hidden w-full bg-[#F5726B] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#F5726B]/10 hover:shadow-xl transition-all duration-300 group cursor-pointer active:scale-[0.99] disabled:opacity-50 mt-4"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? "Creating Account..." : "Sign Up with Email"}
            </span>
            <span className="absolute inset-0 bg-[#AE514B] scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out" />
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#F5726B] hover:underline font-bold ml-1">
            Sign In here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}