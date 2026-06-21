"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

export default function Login() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: redirectTo,
      }, {
        onError: (ctx) => {
          setError(ctx.error.message || "Invalid email or password.");
          setLoading(false);
        }
      });
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-white dark:bg-zinc-950 px-6 py-12 transition-colors duration-300 relative overflow-hidden">
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-96 h-96 bg-[#DFD0BD]/20 dark:bg-zinc-900/30 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 12 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-900 rounded-3xl p-8 shadow-xl shadow-gray-100/50 dark:shadow-none"
      >
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-black tracking-tight">
            Welcome Back to <span className="text-[#F5726B]">RecipeHub</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Log in to discover and share fresh culinary ideas.
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

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
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
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-[#F5726B] dark:focus:border-[#F5726B] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative overflow-hidden w-full bg-[#F5726B] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#F5726B]/10 hover:shadow-xl transition-all duration-300 group cursor-pointer active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? "Authenticating..." : "Sign In with Email"}
            </span>
            <span className="absolute inset-0 bg-[#AE514B] scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out" />
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 border-t border-gray-100 dark:border-zinc-800 w-full"></div>
          <span className="relative bg-white dark:bg-zinc-950 px-3 text-xs font-bold text-gray-400 tracking-wide uppercase">
            Or Continue With
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-700 dark:text-gray-200 font-bold py-3.5 rounded-xl border-2 border-[#DFD0BD] dark:border-zinc-800 hover:border-[#F5726B] dark:hover:border-[#F5726B] transition-all duration-300 cursor-pointer active:scale-[0.99]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
          </svg>
          <span>Google Sign In</span>
        </button>

        <p className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mt-6">
          Dont have an account?{" "}
          <Link href="/register" className="text-[#F5726B] hover:underline font-bold ml-1">
            Sign up for free
          </Link>
        </p>
      </motion.div>

    </div>
  );
}