import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import RecipeDetailsClient from './RecipeDetailsClient';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${id}`);
    if (!res.ok) return { title: 'Recipe Details | RecipeHub' };
    const recipe = await res.json();
    return { title: `${recipe.title} Recipe | RecipeHub` };
}

export default async function RecipeDetailsPage({ params }) {
    const { id } = await params;

    // Optional user authentication fallback setup
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        redirect(`/auth/signin?redirect=/recipes/${id}`);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) return notFound();

    const recipe = await res.json();
    if (!recipe) return notFound();

    return <RecipeDetailsClient recipe={recipe} />;
}