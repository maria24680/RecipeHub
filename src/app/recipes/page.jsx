import { notFound } from 'next/navigation';
import RecipesClient from './RecipesClient';

export const metadata = {
    title: 'Explore Recipes | RecipeHub',
    description: 'Browse delicious culinary creations curated by expert chefs.',
};

export default async function RecipesPage() {
    // Fetches all recipes from your backend API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
        cache: 'no-store'
    });

    if (!res.ok) return notFound();

    const recipes = await res.json();

    return <RecipesClient initialRecipes={recipes} />;
}