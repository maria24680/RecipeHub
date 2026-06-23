"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DUMMY_RECIPES = [
  {
    id: 1,
    title: "Pancake Delight",
    category: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=1200",
    cookingTime: "20 mins",
    rating: 4.8,
    likes: 90,
    price: 3.99,
    description: "Fluffy pancakes served with syrup and fruits.",
    ingredients: ["Flour", "Milk", "Eggs", "Sugar"],
    instructions: ["Mix ingredients", "Cook on pan", "Serve hot"],
  },
  {
    id: 2,
    title: "Chicken Biryani",
    category: "Lunch",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=1200",
    cookingTime: "45 mins",
    rating: 4.9,
    likes: 125,
    price: 5.99,
    description:
      "Aromatic rice dish cooked with chicken, spices, herbs.",
    ingredients: ["Chicken", "Rice", "Onion", "Spices"],
    instructions: ["Marinate chicken", "Cook rice", "Layer & steam"],
  },
  {
    id: 3,
    title: "Grilled Steak",
    category: "Dinner",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200",
    cookingTime: "35 mins",
    rating: 4.7,
    likes: 60,
    price: 8.99,
    description: "Juicy grilled steak with herbs.",
    ingredients: ["Beef", "Salt", "Pepper"],
    instructions: ["Season meat", "Grill", "Serve"],
  },
];

export default function RecipeDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  const recipe = DUMMY_RECIPES.find((r) => r.id === id);

  const [likeCount, setLikeCount] = useState(recipe?.likes || 0);
  const [liked, setLiked] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");

  if (!recipe) {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Recipe not found
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    toast.success(liked ? "Like removed" : "Liked!");
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
    toast.success(!favorite ? "Added to favorites" : "Removed");
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

            <span className="text-sm text-pink-500 font-bold">
              {recipe.category}
            </span>

            <h1 className="text-4xl font-black">
              {recipe.title}
            </h1>

            <div className="flex gap-4 text-gray-600">
              <span>⏱️ {recipe.cookingTime}</span>
              <span>⭐ {recipe.rating}</span>
              <span>❤️ {likeCount}</span>
            </div>

            <p>{recipe.description}</p>

            {/* PRICE */}
            <div className="flex justify-between items-center bg-gray-100 dark:bg-zinc-800 p-5 rounded-2xl">
              <h2 className="text-3xl font-bold text-pink-500">
                ${recipe.price}
              </h2>

              <button
                onClick={handlePurchase}
                className="bg-pink-500 text-white px-6 py-3 rounded-xl"
              >
                Purchase
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button onClick={handleLike} className="bg-blue-500 px-4 py-2 rounded text-white">
                👍 Like ({likeCount})
              </button>

              <button onClick={handleFavorite} className="bg-yellow-500 px-4 py-2 rounded text-white">
                ⭐ Favorite
              </button>

              <button onClick={() => setShowReportModal(true)} className="bg-red-500 px-4 py-2 rounded text-white">
                🚩 Report
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={handleReport} className="bg-white p-5 rounded-xl w-96">
            <textarea
              className="w-full border p-2"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Write report..."
              required
            />
            <div className="flex justify-end gap-2 mt-3">
              <button type="button" onClick={() => setShowReportModal(false)}>
                Cancel
              </button>
              <button type="submit" className="bg-red-500 text-white px-3 py-1 rounded">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}