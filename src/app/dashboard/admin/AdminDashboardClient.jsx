"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Loader2,
  Users,
  UtensilsCrossed,
  Crown,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000').replace(/\/$/, '');

export default function AdminDashboardClient({ user: initialUser }) {
  const { data: session } = useSession();
  const adminUser = session?.user || initialUser;

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalPremium: 0,
    totalReports: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // ── Fetch dashboard stats ──
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/stats`, {
        headers: { 'user-email': adminUser.email },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        toast.error('Failed to load stats');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-800',
      href: '/dashboard/admin/users',
    },
    {
      label: 'Total Recipes',
      value: stats.totalRecipes,
      icon: UtensilsCrossed,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-100 dark:border-orange-800',
      href: '/dashboard/admin/recipes',
    },
    {
      label: 'Total Premium Members',
      value: stats.totalPremium,
      icon: Crown,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-100 dark:border-yellow-800',
      href: '/dashboard/admin/users?role=premium',
    },
    {
      label: 'Total Reports',
      value: stats.totalReports,
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-100 dark:border-red-800',
      href: '/dashboard/admin/reports',
    },
  ];

  return (
    <div className="p-4 sm:p-6 pt-8 max-w-6xl mx-auto space-y-6">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Welcome back, {adminUser?.name}! Here&apos;s an overview of your platform.
        </p>
      </motion.div>

      {/* ── Loading ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-[#F5726B] animate-spin" />
        </div>
      ) : (
        <>
          {/* ── Stats Grid ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={i}
                  href={stat.href}
                  className={`bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border ${stat.border} shadow-sm hover:shadow-md transition-all hover:scale-[1.02] group`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs text-[#F5726B] opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </motion.div>

          {/* ── Quick Actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Link
              href="/dashboard/admin/users"
              className="bg-white dark:bg-[#1a1d24] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all text-center hover:border-[#F5726B] group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">Manage Users</p>
            </Link>

            <Link
              href="/dashboard/admin/recipes"
              className="bg-white dark:bg-[#1a1d24] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all text-center hover:border-[#F5726B] group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">Manage Recipes</p>
            </Link>

            <Link
              href="/dashboard/admin/reports"
              className="bg-white dark:bg-[#1a1d24] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all text-center hover:border-[#F5726B] group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">Review Reports</p>
              {stats.totalReports > 0 && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  {stats.totalReports} pending
                </span>
              )}
            </Link>

            <Link
              href="/dashboard/admin"
              className="bg-white dark:bg-[#1a1d24] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all text-center hover:border-[#F5726B] group"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Crown className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">Premium Members</p>
              <p className="text-xs text-gray-400 mt-0.5">{stats.totalPremium} total</p>
            </Link>
          </motion.div>
        </>
      )}
    </div>
  );
}