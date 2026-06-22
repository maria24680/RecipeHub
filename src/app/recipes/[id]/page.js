"use client";

import { useState } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RecipeDetailsPage() {
  const [recipe] = useState({
    id: 1,
    title: "Chicken Biryani",
    category: "Lunch",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=1200",
    cookingTime: "45 mins",
    rating: 4.9,
    likes: 125,
    price: 5.99,
    description:
      "Aromatic rice dish cooked with chicken, spices, herbs and premium ingredients. Perfect for lunch and family gatherings.",
    ingredients: [
      "Chicken",
      "Basmati Rice",
      "Onion",
      "Garlic",
      "Ginger",
      "Biryani Masala",
      "Yogurt",
    ],
    instructions: [
      "Marinate chicken with yogurt and spices.",
      "Cook rice until 70% done.",
      "Layer rice and chicken.",
      "Cook on low heat for 25 minutes.",
      "Serve hot and enjoy.",
    ],
  });

  const [likeCount, setLikeCount] = useState(recipe.likes);
  const [liked, setLiked] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");

  const handleLike = () => {
    setLiked(!liked);

    setLikeCount((prev) =>
      liked ? prev - 1 : prev + 1
    );

    toast.success(liked ? "Like removed" : "Recipe liked!");
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
    toast.success(
      !favorite
        ? "Added to favorites"
        : "Removed from favorites"
    );
  };

  const handlePurchase = () => {
    toast.success("Stripe integration coming soon!");
  };

  const handleReport = (e) => {
    e.preventDefault();
    toast.success("Report submitted!");
    setShowReportModal(false);
    setReportText("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-black dark:text-white py-12 px-5">
      <ToastContainer />

      <div className="max-w-6xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-lg overflow-hidden">

        <div className="grid md:grid-cols-2 gap-8 p-8">

          {/* IMAGE */}
          <div className="relative h-[350px] md:h-full rounded-3xl overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* DETAILS */}
          <div className="space-y-5">

            <span className="bg-[#F5726B]/10 text-[#F5726B] px-4 py-1 rounded-full text-sm font-bold">
              {recipe.category}
            </span>

            <h1 className="text-4xl font-black">
              {recipe.title}
            </h1>

            <div className="flex gap-6 text-gray-700 dark:text-gray-300">
              <span>⏱️ {recipe.cookingTime}</span>
              <span>⭐ {recipe.rating}</span>
              <span>❤️ {likeCount}</span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {recipe.description}
            </p>

            {/* INGREDIENTS */}
            <div>
              <h3 className="font-bold text-xl mb-2">
                Ingredients
              </h3>

              <ul className="list-disc ml-5 space-y-1 text-gray-700 dark:text-gray-300">
                {recipe.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* INSTRUCTIONS */}
            <div>
              <h3 className="font-bold text-xl mb-2">
                Instructions
              </h3>

              <ol className="list-decimal ml-5 space-y-2 text-gray-700 dark:text-gray-300">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            {/* PRICE */}
            <div className="bg-gray-100 dark:bg-zinc-800 p-5 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Premium Recipe Price
                </p>
                <h2 className="text-3xl font-black text-[#F5726B]">
                  ${recipe.price}
                </h2>
              </div>

              <button
                onClick={handlePurchase}
                className="bg-[#F5726B] hover:bg-[#e45b54] text-white px-6 py-3 rounded-xl font-bold"
              >
                Purchase
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3">

              <button
                onClick={handleLike}
                className="px-5 py-3 rounded-xl bg-blue-500 text-white font-semibold"
              >
                👍 Like ({likeCount})
              </button>

              <button
                onClick={handleFavorite}
                className="px-5 py-3 rounded-xl bg-yellow-500 text-white font-semibold"
              >
                {favorite ? "★ Favorited" : "☆ Favorite"}
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="px-5 py-3 rounded-xl bg-red-500 text-white font-semibold"
              >
                🚩 Report
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              Report Recipe
            </h2>

            <form onSubmit={handleReport}>
              <textarea
                rows={4}
                required
                value={reportText}
                onChange={(e) =>
                  setReportText(e.target.value)
                }
                placeholder="Write your report..."
                className="w-full border rounded-xl p-3 bg-white dark:bg-zinc-800 text-black dark:text-white"
              />

              <div className="flex justify-end gap-3 mt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowReportModal(false)
                  }
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Submit
                </button>

              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}