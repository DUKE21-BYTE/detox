"use client";

import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
    const store = useStore();
    const [name, setName] = useState("");
    const [dailyGoal, setDailyGoal] = useState(60);

    useEffect(() => {
        setName(store.name);
        setDailyGoal(store.dailyScreenFreeGoal);
    }, [store.name, store.dailyScreenFreeGoal]);

    const handleSave = () => {
        store.updatePreferences({ name, dailyScreenFreeGoal: dailyGoal });
        alert("Settings saved!");
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
            store.resetProgress();
            router.push("/");
        }
    };

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your preferences and goals.</p>
            </div>

            <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm space-y-6">

                <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-xl border border-border bg-background"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium">Daily Screen-Free Goal (minutes)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="15"
                            max="240"
                            step="15"
                            value={dailyGoal}
                            onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                            className="flex-1 accent-primary"
                        />
                        <span className="w-16 text-right font-mono font-medium">{dailyGoal}m</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
                    >
                        Save Changes
                    </button>
                </div>

            </div>

            <div className="bg-destructive/5 p-6 rounded-3xl border border-destructive/10">
                <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">Resetting your account will erase all streaks and history.</p>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 border border-destructive/30 text-destructive rounded-lg text-sm hover:bg-destructive/10 transition-colors"
                >
                    Reset Progress
                </button>
            </div>
        </div>
    );
}
