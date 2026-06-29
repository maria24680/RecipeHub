"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  CreditCard,
  TrendingUp,
  Calendar,
  FileText,
  Crown,
  UtensilsCrossed,
} from "lucide-react";

const BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000').replace(/\/$/, '');

export default function TransactionsClient({ user: initialUser }) {
  const { data: session } = useSession();
  const adminUser = session?.user || initialUser;

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // ── Fetch transactions ──
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        perPage,
      });
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);

      const res = await fetch(`${BASE_URL}/api/payments?${params.toString()}`, {
        headers: { 'user-email': adminUser.email },
      });

      if (res.ok) {
        const data = await res.json();
        setTransactions(data.payments || []);
        setTotal(data.total || 0);
      } else {
        const text = await res.text();
        toast.error(`Server error ${res.status}: ${text}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, [page, search, statusFilter, typeFilter]);

  // ── Format date ──
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ── Status badge ──
  const getStatusBadge = (status) => {
    const configs = {
      completed: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-700',
        text: 'text-green-700 dark:text-green-400',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
      },
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        border: 'border-yellow-200 dark:border-yellow-700',
        text: 'text-yellow-700 dark:text-yellow-400',
        icon: <Clock className="w-3.5 h-3.5" />,
      },
      failed: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-200 dark:border-red-700',
        text: 'text-red-700 dark:text-red-400',
        icon: <XCircle className="w-3.5 h-3.5" />,
      },
    };
    const config = configs[status?.toLowerCase()] || configs.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.border} ${config.text}`}>
        {config.icon}
        {status || 'pending'}
      </span>
    );
  };

  // ── Type badge ──
  const getTypeBadge = (type) => {
    const configs = {
      premium: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-400',
        // eslint-disable-next-line react/jsx-no-undef
        icon: <Crown className="w-3 h-3" />,
      },
      recipe: {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-700 dark:text-orange-400',
        // eslint-disable-next-line react/jsx-no-undef
        icon: <UtensilsCrossed className="w-3 h-3" />,
      },
    };
    const config = configs[type] || configs.recipe;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.icon}
        {type || 'recipe'}
      </span>
    );
  };

  const totalPages = Math.ceil(total / perPage);

  // ── Stats summary ──
  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const completedCount = transactions.filter(t => t.paymentStatus === 'completed').length;
  const pendingCount = transactions.filter(t => t.paymentStatus === 'pending').length;

  return (
    <div className="p-4 sm:p-6 pt-8 max-w-7xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            View all payment transactions across the platform.
          </p>
        </motion.div>
        <button
          onClick={fetchTransactions}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* ── Stats Summary ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-[#1a1d24] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <CreditCard className="w-4 h-4" />
            <span className="text-xs">Total Transactions</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{total}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1d24] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs">Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{completedCount}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1d24] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1d24] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Total Amount</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">৳{totalAmount.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white dark:bg-[#1a1d24] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by user email or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5726B]/40 focus:border-[#F5726B] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F5726B]/40 transition-all w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F5726B]/40 transition-all w-full sm:w-auto"
          >
            <option value="all">All Types</option>
            <option value="premium">Premium</option>
            <option value="recipe">Recipe Purchase</option>
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#F5726B] animate-spin" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <CreditCard className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">User</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm truncate max-w-[150px]">
                          {transaction.userEmail || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getTypeBadge(transaction.type)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ৳{(transaction.amount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(transaction.paymentStatus)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(transaction.paidAt || transaction.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                          {transaction.transactionId || 'N/A'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-[#F5726B] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === i + 1
                      ? 'bg-[#F5726B] text-white shadow-md'
                      : 'bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#F5726B]'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-[#F5726B] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}