"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Magic Link Login
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;

            setMessage({
                type: 'success',
                text: 'Magic link sent! Check your email to log in.',
            });
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-secondary/10">
            <div className="w-full max-w-md bg-card border border-border/50 shadow-xl shadow-primary/5 rounded-3xl p-8 md:p-12">
                <div className="text-center mb-10">
                    <Link href="/" className="text-2xl font-bold flex items-center justify-center gap-2 text-primary mb-4">
                        MindfulScreen
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to save your progress across devices.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium ml-1">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded-xl border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Magic Link"}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/onboarding" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        New here? <span className="underline decoration-primary/50 underline-offset-4 font-medium text-foreground">Create a plan</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
