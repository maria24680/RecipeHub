"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaRegClock, FaGlobe, FaUtensils } from "react-icons/fa";

const BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000').replace(/\/$/, '');

const FeaturedRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/recipes/featured`);
                if (!res.ok) throw new Error('Failed to fetch featured recipes');
                const data = await res.json();
                setRecipes(data.slice(0, 6)); // ensure max 6
            } catch (err) {
                console.error(err);
                setError('Could not load featured recipes');
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 70, damping: 14 }
        }
    };

    if (isLoading) {
        return (
            <section className="w-full py-20 bg-gray-50/50 dark:bg-zinc-950/40">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-4 border-[#F5726B] border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full py-20 bg-gray-50/50 dark:bg-zinc-950/40">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    if (recipes.length === 0) {
        return null; // or show a message like "No featured recipes yet"
    }

    return (
        <section className="w-full py-20 bg-gray-50/50 dark:bg-zinc-950/40 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#AE514B] dark:text-[#F5726B]">
                            Admins Pick
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white mt-1">
                            Featured <span className="text-[#F5726B]">Recipes</span>
                        </h2>
                    </div>
                    <Link
                        href="/recipes"
                        className="text-sm font-bold text-[#AE514B] dark:text-[#F5726B] hover:text-[#F5726B] dark:hover:text-white transition-colors group flex items-center gap-1"
                    >
                        Browse All Recipes
                        <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {recipes.map((recipe) => (
                        <motion.div
                            key={recipe._id}
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                            className="bg-white dark:bg-zinc-900 border border-[#DFD0BD]/40 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                        >
                            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                <Image
                                    src={recipe.recipeImage || '/recipe-placeholder.jpg'}
                                    alt={recipe.recipeName}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute top-4 left-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-gray-800 dark:text-gray-200 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-1">
                                    <FaUtensils className="text-[#F5726B] text-[10px]" />
                                    {recipe.category || 'General'}
                                </span>
                            </div>

                            <div className="p-6 flex flex-col flex-grow justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#F5726B] transition-colors duration-300 line-clamp-2">
                                        {recipe.recipeName}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        by {recipe.authorName || 'Anonymous'}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm font-semibold">
                                    <div className="flex items-center gap-1.5">
                                        <FaGlobe className="text-[#DFD0BD] dark:text-zinc-600" />
                                        <span>{recipe.cuisineType || 'Various'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FaRegClock className="text-[#AE514B] dark:text-[#F5726B]" />
                                        <span>{recipe.preparationTime || 30} min</span>
                                    </div>
                                    <Link
                                        href={`/recipes/${recipe._id}`}
                                        className="text-xs bg-[#DFD0BD]/30 dark:bg-zinc-800 text-[#AE514B] dark:text-gray-200 px-3 py-2 rounded-lg font-bold hover:bg-[#F5726B] hover:text-white dark:hover:bg-[#F5726B] dark:hover:text-white transition-all"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedRecipes;