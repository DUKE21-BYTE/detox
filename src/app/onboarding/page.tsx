"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, GoalType, RiskTime } from "@/store/useStore";
import { ArrowRight, Check, ChevronLeft, Moon, Sun, Laptop, Coffee } from "lucide-react";
import { clsx } from "clsx";
import { supabase } from "@/lib/supabase";

const GOALS: { id: GoalType; label: string; icon: string }[] = [
    { id: "focus", label: "Deep Focus", icon: "🎯" },
    { id: "sleep", label: "Better Sleep", icon: "🌙" },
    { id: "anxiety", label: "Reduce Anxiety", icon: "😌" },
    { id: "productivity", label: "Productivity", icon: "⚡" },
    { id: "presence", label: "Be Present", icon: "🌿" },
];

const PROBLEM_APPS = [
    "Instagram", "TikTok", "Twitter/X", "YouTube", "Facebook", "Reddit", "News", "Email"
];

const RISK_TIMES: { id: RiskTime; label: string; icon: any }[] = [
    { id: "morning", label: "Morning Doomscroll", icon: Sun },
    { id: "work", label: "Work Distractions", icon: Laptop },
    { id: "evening", label: "Evening Chill", icon: Coffee },
    { id: "late-night", label: "Bedtime Revenge", icon: Moon },
];

export default function OnboardingPage() {
    const router = useRouter();
    const { completeOnboarding } = useStore();

    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
    const [selectedApps, setSelectedApps] = useState<string[]>([]);
    const [selectedRisks, setSelectedRisks] = useState<RiskTime[]>([]);
    const [dailyGoal, setDailyGoal] = useState(60);

    const totalSteps = 4;


    const handleNext = async () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            // Finish
            completeOnboarding({
                name,
                primaryGoal: selectedGoal,
                problemApps: selectedApps,
                riskTimes: selectedRisks,
                dailyScreenFreeGoal: dailyGoal,
            });

            // Try to sync with Supabase if logged in
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    await supabase.from('profiles').upsert({
                        id: session.user.id,
                        full_name: name,
                        primary_goal: selectedGoal,
                        risk_times: selectedApps, // Note: Schema expects text[], ensure this matches
                        daily_goal_minutes: dailyGoal,
                        updated_at: new Date().toISOString(),
                    });
                }
            } catch (error) {
                console.error("Failed to sync profile:", error);
            }

            router.push("/dashboard");
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const isStepValid = () => {
        if (step === 1) return name.trim().length > 0;
        if (step === 2) return !!selectedGoal;
        if (step === 3) return selectedApps.length > 0;
        return true;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-secondary/10">
            <div className="w-full max-w-lg">
                {/* Progress */}
                <div className="mb-8 flex gap-2">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "h-2 flex-1 rounded-full transition-colors duration-300",
                                i + 1 <= step ? "bg-primary" : "bg-muted"
                            )}
                        />
                    ))}
                </div>

                {/* Card */}
                <div className="bg-card border border-border/50 shadow-xl shadow-primary/5 rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col">

                    <div className="flex-1">
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-3xl font-bold mb-4 text-foreground">Let's get to know you.</h2>
                                <p className="text-muted-foreground mb-8 text-lg">What should we call you?</p>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full text-2xl border-b-2 border-border focus:border-primary bg-transparent py-2 outline-none transition-colors placeholder:text-muted/50"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-3xl font-bold mb-4">What's your primary goal?</h2>
                                <p className="text-muted-foreground mb-8">Choose one main focus for now.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {GOALS.map((g) => (
                                        <button
                                            key={g.id}
                                            onClick={() => setSelectedGoal(g.id)}
                                            className={clsx(
                                                "p-4 rounded-xl text-left border transition-all duration-200 flex items-center gap-3",
                                                selectedGoal === g.id
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                    : "border-border hover:border-primary/50 hover:bg-secondary/20"
                                            )}
                                        >
                                            <span className="text-2xl">{g.icon}</span>
                                            <span className="font-medium">{g.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-2xl font-bold mb-2">Identify your kryptonite.</h2>
                                <p className="text-muted-foreground mb-6">Which apps drain your energy?</p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {PROBLEM_APPS.map((app) => {
                                        const isSelected = selectedApps.includes(app);
                                        return (
                                            <button
                                                key={app}
                                                onClick={() => {
                                                    setSelectedApps(prev =>
                                                        isSelected ? prev.filter(a => a !== app) : [...prev, app]
                                                    );
                                                }}
                                                className={clsx(
                                                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-transparent border-border hover:border-black/20"
                                                )}
                                            >
                                                {app}
                                            </button>
                                        );
                                    })}
                                </div>

                                <h3 className="font-semibold mb-3 text-lg">When are you most at risk?</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {RISK_TIMES.map((rt) => {
                                        const Icon = rt.icon;
                                        const isSelected = selectedRisks.includes(rt.id);
                                        return (
                                            <button
                                                key={rt.id}
                                                onClick={() => {
                                                    setSelectedRisks(prev =>
                                                        isSelected ? prev.filter(t => t !== rt.id) : [...prev, rt.id]
                                                    );
                                                }}
                                                className={clsx(
                                                    "p-3 rounded-lg border text-sm flex items-center gap-2 transition-all",
                                                    isSelected
                                                        ? "bg-secondary border-secondary-foreground/20 text-secondary-foreground"
                                                        : "border-border opacity-70 hover:opacity-100"
                                                )}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {rt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-3xl font-bold mb-4">One Daily Commitment</h2>
                                <p className="text-muted-foreground mb-10">
                                    How many minutes of <strong>pure focus</strong> do you want to achieve daily?
                                </p>

                                <div className="flex flex-col items-center">
                                    <div className="text-6xl font-bold text-primary mb-4 tabular-nums">
                                        {dailyGoal}
                                        <span className="text-xl text-muted-foreground font-normal ml-2">min</span>
                                    </div>

                                    <input
                                        type="range"
                                        min="15"
                                        max="240"
                                        step="15"
                                        value={dailyGoal}
                                        onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                                        className="w-full max-w-xs accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                    />

                                    <div className="mt-8 p-4 bg-muted/50 rounded-xl text-sm text-center max-w-xs">
                                        "Small steps lead to big changes. Start easy."
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Nav */}
                    <div className="mt-8 flex justify-between items-center pt-6 border-t border-border/40">
                        <button
                            onClick={handleBack}
                            className={clsx(
                                "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors",
                                step === 1 && "invisible"
                            )}
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!isStepValid()}
                            className={clsx(
                                "h-12 px-8 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg",
                                isStepValid()
                                    ? "bg-foreground text-background hover:bg-primary hover:text-primary-foreground hover:scale-105"
                                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            )}
                        >
                            {step === totalSteps ? "Create Plan" : "Next"}
                            {step !== totalSteps && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
