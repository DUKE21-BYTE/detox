"use client";

import { useStore } from "@/store/useStore";
import Link from "next/link";
import { Zap, Activity, Wind, ArrowRight, Flame } from "lucide-react";
import { useEffect, useState } from "react";

const MINDFUL_PROMPTS = [
    "Take three deep breaths right now.",
    "Look away from the screen for 20 seconds.",
    "Unclench your jaw and drop your shoulders.",
    "Notice 3 things you can hear around you.",
    "Drink a glass of water.",
];

import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
    const { name: localName, dailyScreenFreeGoal: localGoal } = useStore();
    const [name, setName] = useState(localName);
    const [dailyGoal, setDailyGoal] = useState(localGoal);
    const [screenFreeMinutes, setScreenFreeMinutes] = useState(0);
    const [streak, setStreak] = useState(0);
    const [prompt, setPrompt] = useState("");

    useEffect(() => {
        setPrompt(MINDFUL_PROMPTS[Math.floor(Math.random() * MINDFUL_PROMPTS.length)]);

        const loadData = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Fetch Profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, daily_goal_minutes')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    setName(profile.full_name || "Friend");
                    if (profile.daily_goal_minutes) setDailyGoal(profile.daily_goal_minutes);
                }

                // Fetch Today's Sessions
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const { data: sessions } = await supabase
                    .from('focus_sessions')
                    .select('duration_minutes')
                    .eq('user_id', session.user.id)
                    .gte('created_at', today.toISOString());

                if (sessions) {
                    const totalMinutes = sessions.reduce((acc, curr) => acc + curr.duration_minutes, 0);
                    setScreenFreeMinutes(totalMinutes);
                }

                // Simple Streak Logic (Mocked for MVP, but ready for real data)
                // In a real app, we'd query past days to calculate streaks.
                setStreak(session ? 1 : 0);
            }
        };

        loadData();
    }, [localName, localGoal]);

    const progress = Math.min((screenFreeMinutes / dailyGoal) * 100, 100);

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Good morning, <span className="text-primary capitalize">{name || "Friend"}</span>.
                    </h1>
                    <p className="text-muted-foreground mt-1">Ready to reclaim your focus today?</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent-foreground rounded-full font-medium">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                    {streak} Day Streak
                </div>
            </header>

            {/* Main stats card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-3xl border border-primary/10 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />

                    <div>
                        <div className="flex justify-between text-sm font-medium mb-2">
                            <span className="text-muted-foreground">Daily Screen-Free Goal</span>
                            <span className="text-primary">{screenFreeMinutes} / {dailyGoal} min</span>
                        </div>
                        <div className="h-4 w-full bg-background/50 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            You're doing great! Just {Math.max(0, dailyGoal - screenFreeMinutes)} mins to hit your target.
                        </p>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <Link href="/focus" className="flex-1 bg-primary text-primary-foreground h-12 rounded-xl flex items-center justify-center gap-2 font-medium shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                            <Zap className="w-5 h-5 fill-current" />
                            Focus Mode
                        </Link>
                        <Link href="/dashboard/insights" className="flex-1 bg-card text-foreground border border-border h-12 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-secondary/30 transition-colors">
                            <Activity className="w-5 h-5" />
                            Insights
                        </Link>
                    </div>
                </div>

                {/* Mindful Card */}
                <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                        <Wind className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">Mindful Moment</h3>
                    <p className="text-muted-foreground italic">&ldquo;{prompt}&rdquo;</p>
                    <Link href="/mindful-tools" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                        Start Breathing <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* Recent Activity / Suggestions */}
            <section>
                <h3 className="text-xl font-semibold mb-4">Up Next</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Gamification Challenge */}
                    <div className="p-4 rounded-2xl bg-card border border-border/50 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            🏆
                        </div>
                        <div>
                            <h4 className="font-medium group-hover:text-primary transition-colors">Evening Detox</h4>
                            <p className="text-sm text-muted-foreground">No social media after 8 PM.</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/50 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            📖
                        </div>
                        <div>
                            <h4 className="font-medium group-hover:text-primary transition-colors">Read a Book</h4>
                            <p className="text-sm text-muted-foreground">Replace scrolling with 10 pages.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
