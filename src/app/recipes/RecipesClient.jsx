'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, authClient } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Clock, Users, Star, Flame, Utensils, Shield,
    X, Plus, Minus, ChefHat, Heart, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// Theme Configurations matched to recipe classification
const CATEGORY_CONFIG = {
    breakfast: { icon: Utensils, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
    lunch: { icon: ChefHat, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    dinner: { icon: Flame, color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
    dessert: { icon: Sparkles, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400' },
};

// Interactive Order/Reserve Modal matching the ticket infrastructure
function OrderModal({ recipe, onClose }) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Dynamic cost calculators
    const subtotal = (recipe.price || 0) * quantity;
    const serviceFee = Math.round(subtotal * 0.03); // 3% service charge platform fee
    const total = subtotal + serviceFee;

    const isDisabled = recipe.availableQuantity === 0;

    const handleOrder = async () => {
        setIsLoading(true);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;
            const user = session?.data?.user;

            if (!user) {
                toast.error('Please sign in to order');
                return;
            }

            const orderData = {
                recipeId: recipe._id,
                recipeTitle: recipe.title,
                image: recipe.image,
                category: recipe.category,
                price: recipe.price,
                quantity: quantity,
                vendorEmail: recipe.vendorEmail || recipe.authorEmail,
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                totalAmount: total,
            };

            // Backend API Connection
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (data.insertedId) {
                toast.success('Order confirmed successfully! 🎉');
                onClose();
                router.push('/dashboard/user/booked-tickets'); // Kept intact to match your route architecture
            } else {
                toast.error(data.message || 'Order compilation failed. Try again.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong communicating with backend servers');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 w-full max-w-md bg-white dark:bg-[#1a1d24] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative h-28 bg-gradient-to-r from-orange-500 to-amber-600 p-5 flex flex-col justify-end">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <h3 className="text-white font-bold text-lg">{recipe.title}</h3>
                    <p className="text-white/80 text-xs capitalize">Category: {recipe.category}</p>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                            Select Servings / Quantity
                        </label>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="w-9 h-9 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-orange-400 transition-all"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => Math.min(recipe.availableQuantity || 10, q + 1))}
                                className="w-9 h-9 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-orange-400 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">{recipe.availableQuantity || 0} batches remaining</p>
                    </div>

                    <div className="space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>৳{(recipe.price || 0).toLocaleString()} × {quantity}</span>
                            <span>৳{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Platform Service fee (3%)</span>
                            <span>৳{serviceFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span>Total Cost</span>
                            <span className="text-orange-600 dark:text-orange-400">৳{total.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleOrder}
                        disabled={isDisabled || isLoading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isDisabled ? (
                            'Out of Stock'
                        ) : (
                            <>Confirm Order — ৳{total.toLocaleString()}</>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" /> Secure Purchase — Safe Culinary Processing
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function RecipesClient({ initialRecipes = [] }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedRecipeForModal, setSelectedRecipeForModal] = useState(null);

    const { data: session } = useSession();
    const user = session?.user;
    const isUser = user?.role === 'user';

    // Compiling global operational categories dynamically
    const baseCategories = ['All', ...new Set(initialRecipes.map(r => r.category).filter(Boolean))];

    const filteredRecipes = initialRecipes.filter(recipe => {
        const matchesSearch = recipe.title?.toLowerCase().includes(search.toLowerCase()) ||
                             recipe.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || recipe.category?.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Search & Dynamic Category Navigation Hub */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1a1d24] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search recipes, chefs, tags..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-all"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                        {baseCategories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                                    selectedCategory === category
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recipes Grid Array Display */}
                {filteredRecipes.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800">
                        <p className="text-gray-400">No delicious recipes match your filter options.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecipes.map((recipe, index) => {
                            const config = CATEGORY_CONFIG[recipe.category?.toLowerCase()] || CATEGORY_CONFIG.breakfast;
                            const ModeIcon = config.icon;
                            const isOutOfStock = recipe.availableQuantity === 0;

                            return (
                                <motion.div
                                    key={recipe._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full relative"
                                >
                                    {/* Image Container with Badges */}
                                    <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                        <Image
                                            src={recipe.image || '/recipe-placeholder.jpg'}
                                            alt={recipe.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        
                                        {/* Dynamic Category Pill Badge */}
                                        <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} border border-white/20 backdrop-blur-md`}>
                                            <ModeIcon className={`w-3 h-3 ${config.text}`} />
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${config.text}`}>{recipe.category || 'General'}</span>
                                        </div>
                                    </div>

                                    {/* Recipe Meta Info Body */}
                                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start gap-2">
                                                <Link href={`/recipes/${recipe._id}`} className="block">
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 hover:text-orange-500 transition-colors">
                                                        {recipe.title}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold shrink-0 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                                                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                    <span>{recipe.rating || '4.5'}</span>
                                                    <span className="text-gray-400 font-normal text-[10px]">({recipe.totalReviews || 12})</span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-gray-400">By {recipe.authorName || recipe.operatorName || 'Master Chef'}</p>

                                            {/* Micro-Metrics Row */}
                                            <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 pt-1">
                                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-orange-500" /> {recipe.cookTime || 20} mins</span>
                                                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-red-500" /> {recipe.calories || 310} kcal</span>
                                            </div>
                                        </div>

                                        {/* Price display and Order Trigger Footer */}
                                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] block text-gray-400 uppercase font-medium">Price</span>
                                                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                                    ৳{(recipe.price || 0).toLocaleString()}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (!user) {
                                                        toast.error('Please sign in to make a purchase');
                                                        return;
                                                    }
                                                    if (!isUser) {
                                                        toast.error('Only customers can place recipe orders');
                                                        return;
                                                    }
                                                    setSelectedRecipeForModal(recipe);
                                                }}
                                                disabled={isOutOfStock}
                                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                {isOutOfStock ? 'Sold Out' : 'Order Now'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Actionable Modal Animate Context */}
            <AnimatePresence>
                {selectedRecipeForModal && (
                    <OrderModal
                        recipe={selectedRecipeForModal}
                        onClose={() => setSelectedRecipeForModal(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}