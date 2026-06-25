'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, Clock, Flame, Users, Star, Layers, CheckCircle2, 
    Play, X, AlertCircle, RefreshCcw, ChefHat 
} from 'lucide-react';

export default function RecipeDetailsClient({ recipe }) {
    const [checkedIngredients, setCheckedIngredients] = useState({});
    const [activeTimer, setActiveTimer] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState((recipe.cookTime || 15) * 60);
    const [timerRunning, setTimerRunning] = useState(false);

    // Active Timer Side Effects
    useEffect(() => {
        let interval = null;
        if (timerRunning && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
            setTimerRunning(false);
            alert(`⏰ Time is up! Your "${recipe.title}" is ready!`);
        }
        return () => clearInterval(interval);
    }, [timerRunning, secondsLeft, recipe.title]);

    const toggleIngredient = (idx) => {
        setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const formatTimer = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs > 0 ? hrs + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
            
            {/* Hero Image Block Banner */}
            <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                <Image
                    src={recipe.image || '/recipe-placeholder.jpg'}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0f1117] via-black/40 to-black/10" />
                
                <Link
                    href="/recipes"
                    className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-sm font-medium hover:bg-black/60 transition-all"
                >
                    <ChevronLeft className="w-4 h-4" /> Back to Recipes
                </Link>
            </div>

            {/* Layout Main Container */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 pb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Main Recipe Details Content Segment */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Summary Header Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{recipe.category}</span>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-1 mb-3">{recipe.title}</h1>
                            <p className="text-sm text-gray-400 mb-4">Recipe curated by <span className="text-gray-600 dark:text-gray-200 font-semibold">{recipe.authorName || recipe.vendorEmail}</span></p>
                            
                            <div className="grid grid-cols-4 gap-2 text-center border-t border-gray-100 dark:border-gray-800 pt-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Prep Time</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{recipe.prepTime || 10}m</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Cook Time</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{recipe.cookTime || 20}m</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Servings</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{recipe.servings || 2} pax</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Calories</p>
                                    <p className="font-bold text-orange-500 text-sm">{recipe.calories || 350} kcal</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Interactive Checklist Ingredients Section */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <ChefHat className="w-5 h-5 text-orange-500" /> Ingredients Checklist
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {recipe.ingredients?.map((ingredient, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => toggleIngredient(idx)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                                            checkedIngredients[idx] 
                                                ? 'bg-orange-50/50 dark:bg-orange-950/10 border-orange-200 dark:border-orange-900/40 opacity-60' 
                                                : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                        }`}
                                    >
                                        <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${checkedIngredients[idx] ? 'text-orange-500 fill-orange-505' : 'text-gray-300 dark:text-gray-600'}`} />
                                        <span className={`text-sm font-medium ${checkedIngredients[idx] ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>{ingredient}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Step By Step Instructions Timeline */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-orange-500" /> Preparation Instructions
                            </h2>
                            <div className="space-y-6 relative border-l-2 border-gray-100 dark:border-gray-800 ml-3 pl-5">
                                {recipe.instructions?.map((step, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-orange-500 border-4 border-white dark:border-[#1a1d24] shadow-sm" />
                                        <span className="text-xs font-bold text-orange-500">STEP {idx + 1}</span>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </div>

                    {/* Right Interactive Cooking Controls Sidebar */}
                    <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-500/10 sticky top-24 text-center space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Interactive Kitchen Companion</h3>
                                <p className="text-white/80 text-xs mt-1">Keep track of your cooking boundaries with our real-time visual companion helper.</p>
                            </div>
                            <button
                                onClick={() => setActiveTimer(true)}
                                className="w-full py-2.5 bg-white text-orange-600 font-bold text-sm rounded-xl shadow-md hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Play className="w-4 h-4 fill-orange-600" /> Launch Timer
                            </button>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Interactive Functional Timer Overlay Panel Modal */}
            <AnimatePresence>
                {activeTimer && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setActiveTimer(false)} />
                        
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-2xl text-center space-y-6">
                            <button onClick={() => setActiveTimer(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                            
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Kitchen Counter</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{recipe.title}</p>
                            </div>

                            <div className="text-4xl font-black tracking-widest bg-gray-50 dark:bg-gray-800/50 py-4 rounded-xl text-orange-500 font-mono">
                                {formatTimer(secondsLeft)}
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setTimerRunning(!timerRunning)} 
                                    className={`flex-1 py-2.5 text-white font-bold text-sm rounded-xl transition-all ${timerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                                >
                                    {timerRunning ? 'Pause' : 'Start Cooking'}
                                </button>
                                <button 
                                    onClick={() => { setTimerRunning(false); setSecondsLeft((recipe.cookTime || 15) * 60); }} 
                                    className="px-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                                >
                                    <RefreshCcw className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}