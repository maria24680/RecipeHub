"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart, FaUser } from "react-icons/fa";

const BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000').replace(/\/$/, '');

const PopularRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/recipes/popular`);
                if (!res.ok) throw new Error('Failed to fetch popular recipes');
                const data = await res.json();
                setRecipes(data.slice(0, 6)); // ensure max 6
            } catch (err) {
                console.error(err);
                setError('Could not load popular recipes');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPopular();
    }, []);

    if (isLoading) {
        return (
            <section className="w-full py-20 bg-white dark:bg-zinc-950">
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
            <section className="w-full py-20 bg-white dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    if (recipes.length === 0) {
        return null;
    }

    return (
        <section className="w-full py-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-12">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#AE514B] dark:text-[#F5726B]">
                        Trending Now
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white mt-1">
                        Most <span className="text-[#F5726B]">Liked Recipes</span>
                    </h2>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {recipes.map((recipe) => (
                        <motion.div
                            key={recipe._id}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
                            }}
                            whileHover={{ y: -6 }}
                            className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                        >
                            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                <Image
                                    src={recipe.recipeImage || '/recipe-placeholder.jpg'}
                                    alt={recipe.recipeName}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                                    <FaHeart className="text-[#F5726B]" />
                                    <span>{recipe.likesCount || 0}</span>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#F5726B] transition-colors duration-300 line-clamp-2 leading-snug">
                                    {recipe.recipeName}
                                </h3>

                                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <div className="w-5 h-5 rounded-full bg-[#DFD0BD]/40 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-[#AE514B] dark:text-[#F5726B] shrink-0">
                                            <FaUser />
                                        </div>
                                        <span className="truncate">{recipe.authorName || 'Anonymous'}</span>
                                    </div>
                                    <Link
                                        href={`/recipes/${recipe._id}`}
                                        className="bg-[#F5726B]/10 text-[#F5726B] dark:bg-zinc-800 dark:text-gray-200 px-3 py-1.5 rounded-md font-bold hover:bg-[#F5726B] hover:text-white dark:hover:bg-[#F5726B] dark:hover:text-white transition-all shrink-0"
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

export default PopularRecipes;