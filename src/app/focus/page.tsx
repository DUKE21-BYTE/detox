"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DURATIONS = [25, 45, 60];

const QUOTES = [
    "Wherever you are, be all there.",
    "Deep measures of time for deep measures of thought.",
    "Focus is the art of knowing what to ignore.",
    "Silence is a source of great strength.",
    "Almost everything will work again if you unplug it for a few minutes.",
];

export default function FocusPage() {
    const router = useRouter();
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(25); // minutes
    const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
    const [quote, setQuote] = useState(QUOTES[0]);


    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && !isPaused && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);

            // Save session to Supabase
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) {
                    supabase.from('focus_sessions').insert({
                        user_id: session.user.id,
                        duration_minutes: duration,
                        completed: true
                    }).then(({ error }) => {
                        if (error) console.error("Error saving session:", error);
                    });
                }
            });

            // Play a sound or notify? (Future feature)
            alert("Session Completed! Great job.");
            router.push("/dashboard");
        }

        return () => clearInterval(interval);
    }, [isActive, isPaused, timeLeft, duration, router]);

    useEffect(() => {
        if (!isActive) {
            setTimeLeft(duration * 60);
            setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        }
    }, [duration, isActive]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const handleStop = () => {
        if (confirm("Are you sure you want to exit Focus Mode?")) {
            setIsActive(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000">

            {/* Background Ambience */}
            <div
                className={clsx(
                    "absolute inset-0 transition-opacity duration-1000 pointer-events-none",
                    isActive ? "opacity-100 bg-primary/5" : "opacity-0"
                )}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            </div>

            {/* Header / Exit */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors pt-2">
                    Oasis
                </Link>
                {isActive && (
                    <button
                        onClick={handleStop}
                        className="p-2 rounded-full bg-secondary/50 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Exit Focus Mode"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            <main className="z-10 flex flex-col items-center text-center max-w-md w-full">

                {!isActive ? (
                    <div className="animate-in fade-in zoom-in-95 duration-500 w-full">
                        <h1 className="text-4xl font-bold mb-2">Focus Mode</h1>
                        <p className="text-muted-foreground mb-12">Choose a duration to disconnect.</p>

                        <div className="grid grid-cols-3 gap-4 mb-12">
                            {DURATIONS.map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={clsx(
                                        "py-4 rounded-2xl border-2 font-semibold text-xl transition-all",
                                        duration === d
                                            ? "border-primary bg-primary/10 text-primary scale-105 shadow-lg shadow-primary/10"
                                            : "border-border text-muted-foreground hover:border-primary/50"
                                    )}
                                >
                                    {d}m
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleStart}
                            className="w-full py-5 rounded-full bg-primary text-primary-foreground text-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3"
                        >
                            <Play className="w-6 h-6 fill-current" /> Start Session
                        </button>
                    </div>
                ) : (
                    <div className="animate-in fade-in zoom-in-95 duration-1000 flex flex-col items-center">

                        {/* Breathing / Pulse visual */}
                        <div className="relative mb-12">
                            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-20 duration-[3000ms]" />
                            <div className="w-64 h-64 rounded-full border-4 border-primary/20 flex items-center justify-center bg-background/50 backdrop-blur-sm relative z-10 shadow-2xl shadow-primary/10">
                                <span className="text-6xl font-bold font-mono tracking-wider tabular-nums text-foreground">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        </div>

                        <p className="text-xl text-muted-foreground italic max-w-sm leading-relaxed mb-12 animate-pulse">
                            "{quote}"
                        </p>

                        <div className="flex gap-6">
                            <button
                                onClick={() => setIsPaused(!isPaused)}
                                className="p-4 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                                {isPaused ? <Play className="w-6 h-6 ml-1" /> : <Pause className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
