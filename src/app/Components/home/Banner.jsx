"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HomePage() {
  const featuredRecipes = [
    { id: 1, name: "Spaghetti Carbonara", category: "Dinner", cuisine: "Italian", time: "25 mins" },
    { id: 2, name: "Avocado Toast", category: "Breakfast", cuisine: "American", time: "10 mins" },
    { id: 3, name: "Chicken Tikka Masala", category: "Lunch", cuisine: "Indian", time: "40 mins" },
  ];

  const popularRecipes = [
    { id: 1, name: "Chocolate Lava Cake", likes: 245, author: "John Doe" },
    { id: 2, name: "Sushi Roll", likes: 189, author: "Jane Smith" },
    { id: 3, name: "Greek Salad", likes: 156, author: "Alex Carrel" },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-800 overflow-x-hidden">
      
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Share Your Recipes, <br />
            <span className="text-[#F5726B]">Inspire the World</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            RecipeHub is a decentralized space for food enthusiasts to create, share, discover, and manage delicious recipes from all around the globe.
          </p>
          <div>
            <Link 
              href="/browse" 
              className="inline-block bg-[#F5726B] text-white font-bold px-8 py-4 rounded-full hover:bg-[#e05f58] transition-all shadow-md hover:shadow-lg"
            >
              Explore Recipes
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full flex justify-center">
          <div className="relative w-full max-w-md h-[400px] bg-gradient-to-tr from-orange-100 to-rose-100 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center text-8xl">
            🍲
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 bg-gray-50/50 rounded-3xl my-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Featured Recipes</h2>
          <p className="text-gray-500 mt-2">Handpicked masterpieces curated specially by our administrators</p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {featuredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#F5726B] bg-orange-50 inline-block px-3 py-1 rounded-full mb-4">
                  {recipe.category}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#F5726B] transition-colors">{recipe.name}</h3>
                <p className="text-gray-500 text-sm">Cuisine: {recipe.cuisine}</p>
              </div>
              <div className="border-t border-gray-50 mt-6 pt-4 flex justify-between items-center text-sm text-gray-400">
                <span className="flex items-center gap-1">⏱️ {recipe.time}</span>
                <Link href={`/recipe/${recipe.id}`} className="text-[#F5726B] font-semibold hover:underline">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Popular Recipes</h2>
          <p className="text-gray-500 mt-2">Most liked recipes highly recommended by our culinary community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-rose-50 text-[#F5726B] px-4 py-1.5 rounded-bl-xl font-bold text-sm flex items-center gap-1">
                ❤️ {recipe.likes}
              </div>
              <div className="pt-4">
                <h3 className="text-lg font-bold mb-4 pr-12">{recipe.name}</h3>
              </div>
              <div className="border-t border-gray-50 pt-4 flex justify-between items-center text-sm">
                <span className="text-gray-500">By <span className="font-medium text-gray-700">{recipe.author}</span></span>
                <Link href={`/recipe/${recipe.id}`} className="text-gray-400 hover:text-[#F5726B] font-medium transition-colors">
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20 bg-gradient-to-br from-[#F5726B]/5 to-transparent rounded-3xl my-12 flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-4">
          <span className="text-[#F5726B] font-bold uppercase tracking-widest text-sm">Join the Elite</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Unlock Unlimited Creation with Premium</h2>
          <p className="text-gray-500">
            Standard users can publish up to 2 recipes. Upgrade to our Premium membership today to unlock unlimited uploads, a premium profile badge, and exclusive community highlights.
          </p>
          <div className="pt-2">
            <Link href="/dashboard" className="inline-block bg-gray-900 text-white font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
              Go Premium Now
            </Link>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">⭐</div>
            <h4 className="font-bold">Premium Badge</h4>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">♾️</div>
            <h4 className="font-bold">Unlimited Uploads</h4>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-extrabold text-[#F5726B] mb-2">10k+</h3>
            <p className="text-gray-500 font-medium text-sm">Published Recipes</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-[#F5726B] mb-2">5k+</h3>
            <p className="text-gray-500 font-medium text-sm">Active Chefs</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-[#F5726B] mb-2">120+</h3>
            <p className="text-gray-500 font-medium text-sm">Cuisine Types</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-[#F5726B] mb-2">500k+</h3>
            <p className="text-gray-500 font-medium text-sm">Monthly Tastings</p>
          </div>
        </div>
      </section>

    </div>
  );
}