'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Crown, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';
import { auth } from '@/lib/auth';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    
    const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
    const [message, setMessage] = useState('Confirming your purchase...');
    const [retryCount, setRetryCount] = useState(0);
    const [purchaseData, setPurchaseData] = useState(null);
    const [user, setUser] = useState(null);
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 3000;

    useEffect(() => {
        // Redirect if no session ID
        if (!sessionId) {
            router.push('/dashboard');
            return;
        }

        // Get current user
        const getUser = async () => {
            try {
                const session = await auth.api.getSession();
                if (session?.user) {
                    setUser(session.user);
                } else {
                    router.push('/login');
                }
            } catch (err) {
                console.error('Failed to get user:', err);
                router.push('/login');
            }
        };
        getUser();
    }, [sessionId, router]);

    useEffect(() => {
        if (user && sessionId) {
            confirmPurchase();
        }
    }, [user, sessionId]);

    const confirmPurchase = async () => {
        try {
            setStatus('processing');
            setMessage('Confirming your purchase...');

            const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';
            
            const response = await fetch(`${SERVER_URL}/api/payments/confirm-purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-email': user.email,
                },
                body: JSON.stringify({ sessionId }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatus('success');
                setMessage('Purchase confirmed successfully! 🎉');
                setPurchaseData(data.data);
                
                // Update user context if premium
                if (data.data?.isPremium) {
                    // Trigger any UI updates needed
                    window.dispatchEvent(new Event('userUpdated'));
                }
            } else {
                // If payment is not completed yet or server error, retry
                if (retryCount < MAX_RETRIES) {
                    setRetryCount(prev => prev + 1);
                    setMessage(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                    setTimeout(() => {
                        confirmPurchase();
                    }, RETRY_DELAY);
                } else {
                    setStatus('error');
                    setMessage('Unable to confirm purchase. Please contact support or try again later.');
                }
            }
        } catch (err) {
            console.error('Confirm error:', err);
            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
                setMessage(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                setTimeout(() => {
                    confirmPurchase();
                }, RETRY_DELAY);
            } else {
                setStatus('error');
                setMessage('Network error. Please check your connection and try again.');
            }
        }
    };

    const handleManualRetry = () => {
        setRetryCount(0);
        confirmPurchase();
    };

    // Get type from session (we can try to get it from the response or from URL)
    const isPremium = purchaseData?.isPremium || false;
    const recipeId = purchaseData?.recipeId || searchParams.get('recipe_id');

    // Loading state
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    const isSuccess = status === 'success';
    const isError = status === 'error';
    const isProcessing = status === 'processing';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center px-4">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 text-center">
                {/* Icon */}
                <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-500 ${
                    isSuccess 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 shadow-emerald-500/10'
                        : isError
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 shadow-red-500/10'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800 shadow-yellow-500/10 animate-pulse'
                }`}>
                    {isSuccess ? (
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                    ) : isError ? (
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    ) : (
                        <RefreshCw className="w-10 h-10 text-yellow-500 animate-spin" />
                    )}
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {isSuccess 
                        ? 'Payment Successful! 🎉'
                        : isError
                        ? 'Confirmation Issue'
                        : 'Processing Payment...'
                    }
                </h1>
                
                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    {isSuccess
                        ? isPremium
                            ? 'You are now a Premium member! Enjoy unlimited recipe sharing and exclusive benefits.'
                            : 'Your recipe purchase is complete. You can now access the full recipe content.'
                        : isError
                        ? 'Your payment was successful but we\'re having trouble confirming it with our servers.'
                        : message
                    }
                </p>

                {/* Transaction Details */}
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-6 text-left space-y-2 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-xs truncate max-w-[160px]">
                            {sessionId || 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Status</span>
                        <span className={`font-medium text-xs px-2 py-1 rounded-full ${
                            isSuccess 
                                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                                : isError
                                ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                                : 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                        }`}>
                            {isSuccess ? 'Confirmed' : isError ? 'Failed' : 'Processing'}
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
                            {user?.email || 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Status Message */}
                <div className="mb-4">
                    {isProcessing && retryCount > 0 && (
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            ⏳ {message}
                            <br />
                            <span className="text-[10px] text-gray-400">Please don't close this page.</span>
                        </p>
                    )}
                    {isError && (
                        <>
                            <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                                ⚠️ {message}
                            </p>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleManualRetry}
                                    className="text-xs text-orange-500 hover:text-orange-600 underline font-medium"
                                >
                                    Try Again
                                </button>
                                <p className="text-[10px] text-gray-400">
                                    If this persists, please contact support with your transaction ID.
                                </p>
                            </div>
                        </>
                    )}
                    {isSuccess && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            ✅ Your purchase has been recorded and your account is updated.
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {isSuccess ? (
                        isPremium ? (
                            <Link
                                href="/dashboard/user"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02]"
                            >
                                <Crown className="w-4 h-4" />
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={`/recipes/${recipeId}?purchased=true&_t=${Date.now()}`}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02]"
                            >
                                <BookOpen className="w-4 h-4" />
                                View Recipe
                            </Link>
                        )
                    ) : isError ? (
                        <button
                            onClick={handleManualRetry}
                            disabled={isProcessing}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                            {isProcessing ? 'Processing...' : 'Retry Confirmation'}
                        </button>
                    ) : (
                        <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Processing...
                        </div>
                    )}
                    
                    <Link
                        href="/recipes"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                        Browse More Recipes
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Support link */}
                    {isError && (
                        <Link
                            href="/support"
                            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            Need help? Contact Support
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}