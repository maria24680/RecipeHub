"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        toast.error(res.error.message || "Login failed");
        return;
      }

      toast.success("Welcome back to RecipeHub!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      toast.info("Connecting to RecipeHub...");
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (err) {
      toast.error("Google login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] to-[#ffe3e1] dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center px-4 py-8 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8">
        <ToastContainer position="top-right" autoClose={2000} />
        
        {/* Logo */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-[#F5726B] tracking-tight">
          RecipeHub
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-400 mt-2 mb-8">
          Discover, cook, and share your favorite recipes
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5726B]"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5726B]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#F5726B] cursor-pointer hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold bg-[#F5726B] hover:bg-[#e05f59] transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-500/10"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
        </div>

        {/* Google login button */}
        <button
          onClick={handleGoogle}
          type="button"
          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-200 cursor-pointer"
        >
          <Image
            width={16}
            height={16}
            className="w-4 h-auto" 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google Logo" 
          />
          Sign in with Google
        </button>

        {/* Register link */}
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#F5726B] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}