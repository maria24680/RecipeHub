'use client';

import { stripe } from '@/lib/stripe';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Crown, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage({ searchParams }) {
    const router = useRouter();
    const [status, setStatus] = useState('confirming'); // confirming, success, error
    const [details, setDetails] = useState({
        amount: 0,
        type: 'recipe',
        recipeId: null,
        email: '',
        transactionId: ''
    });

    useEffect(() => {
        const handlePaymentSuccess = async () => {
            try {
                const sessionId = searchParams?.session_id;
                if (!sessionId) {
                    setStatus('error');
                    return;
                }

                // ─── STEP 1: Get session from client-side (retrieve metadata) ───
                const token = localStorage.getItem('auth_token') || '';
                const userEmail = localStorage.getItem('user_email') || '';

                if (!token || !userEmail) {
                    console.error('Missing auth info');
                    setStatus('error');
                    return;
                }

                const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

                // ─── STEP 2: Verify payment on Stripe (optional, just for metadata) ───
                let paymentMetadata = { type: 'recipe', amount: 0 };
                try {
                    const verifyRes = await fetch(
                        `${SERVER_URL}/api/payments/verify/${sessionId}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            }
                        }
                    );
                    if (verifyRes.ok) {
                        const verifyData = await verifyRes.json();
                        paymentMetadata = verifyData.metadata || paymentMetadata;
                    }
                } catch (err) {
                    console.warn('Verify endpoint unavailable, continuing...');
                }

                // ─── STEP 3: Confirm purchase (write to database) ───
                console.log('📝 Confirming purchase with sessionId:', sessionId);
                const confirmRes = await fetch(`${SERVER_URL}/api/payments/confirm-purchase`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ sessionId }),
                });

                const confirmData = await confirmRes.json();

                if (!confirmData.success) {
                    console.error('❌ Confirm failed:', confirmData.message);
                    setStatus('error');
                    return;
                }

                console.log('✅ Confirm response:', confirmData);

                // ─── STEP 4: Verify purchase exists in DB (with retries) ───
                let purchaseVerified = false;
                let retries = 0;
                const maxRetries = 5;
                const retryDelay = 500; // ms

                while (!purchaseVerified && retries < maxRetries) {
                    try {
                        console.log(`🔍 Checking purchases (attempt ${retries + 1}/${maxRetries})...`);
                        
                        const purchaseRes = await fetch(`${SERVER_URL}/api/purchases`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            }
                        });

                        if (purchaseRes.ok) {
                            const purchases = await purchaseRes.json();
                            console.log('📦 Purchases:', purchases);

                            // Check if the purchase we just made exists
                            const justPurchased = purchases.find(p => 
                                p.transactionId === confirmData.metadata?.transactionId ||
                                p.recipeId === paymentMetadata.recipeId
                            );

                            if (justPurchased || paymentMetadata.type === 'premium') {
                                purchaseVerified = true;
                                console.log('✅ Purchase verified in database!');
                            } else if (retries < maxRetries - 1) {
                                console.log('⏳ Purchase not found yet, retrying...');
                                await new Promise(r => setTimeout(r, retryDelay));
                                retries++;
                            } else {
                                console.warn('⚠️ Purchase not found after retries, continuing anyway');
                                purchaseVerified = true; // Continue anyway
                            }
                        } else if (retries < maxRetries - 1) {
                            await new Promise(r => setTimeout(r, retryDelay));
                            retries++;
                        } else {
                            purchaseVerified = true; // Continue anyway
                        }
                    } catch (err) {
                        console.error('Error checking purchases:', err);
                        if (retries < maxRetries - 1) {
                            await new Promise(r => setTimeout(r, retryDelay));
                            retries++;
                        } else {
                            purchaseVerified = true; // Continue anyway
                        }
                    }
                }

                // ─── STEP 5: Update UI with success details ───
                setDetails({
                    amount: Number(paymentMetadata.amount) || 0,
                    type: paymentMetadata.type || 'recipe',
                    recipeId: paymentMetadata.recipeId || null,
                    email: userEmail,
                    transactionId: sessionId
                });

                setStatus('success');

            } catch (err) {
                console.error('❌ Payment success handler error:', err);
                setStatus('error');
            }
        };

        handlePaymentSuccess();
    }, [searchParams]);

    const isPremium = details.type === 'premium';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center px-4">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 text-center">
                {/* ─── Loading state ─── */}
                {status === 'confirming' && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 border-4 border-blue-100 dark:border-blue-800 flex items-center justify-center mx-auto mb-6">
                            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Processing Payment
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            ⏳ Confirming your purchase...
                        </p>
                    </>
                )}

                {/* ─── Success state ─── */}
                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border-4 border-emerald-100 dark:border-emerald-800 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Payment Successful! 🎉
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            {isPremium
                                ? 'You are now a Premium member! Enjoy unlimited recipe sharing.'
                                : 'Your recipe purchase is complete. You can now access the full recipe.'}
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-6 text-left space-y-2 border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100 text-xs truncate max-w-[160px]">
                                    {details.transactionId.substring(0, 16)}...
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    ৳{details.amount.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Type</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                                    {isPremium ? 'Premium Membership' : 'Recipe Purchase'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Email</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100 text-xs truncate max-w-[160px]">
                                    {details.email}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-green-600 dark:text-green-400 mb-4 flex items-center justify-center gap-1">
                            <span>✅</span>
                            <span>Purchase recorded successfully</span>
                        </p>

                        <div className="space-y-3">
                            {isPremium ? (
                                <Link
                                    href="/dashboard/user"
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                                >
                                    <Crown className="w-4 h-4" />
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    // eslint-disable-next-line react-hooks/purity
                                    href={`/recipes/${details.recipeId}?purchased=true&_t=${Date.now()}`}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    View Recipe
                                </Link>
                            )}
                            <Link
                                href="/recipes"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                Browse More Recipes
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </>
                )}

                {/* ─── Error state ─── */}
                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 border-4 border-red-100 dark:border-red-800 flex items-center justify-center mx-auto mb-6">
                            <div className="text-3xl">⚠️</div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Something Went Wrong
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            We couldn&apos;t confirm your payment. Please check your email for a receipt or contact support.
                        </p>

                        <div className="space-y-3">
                            <Link
                                href="/dashboard"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                            >
                                Go to Dashboard
                            </Link>
                            <Link
                                href="/recipes"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                Browse Recipes
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}