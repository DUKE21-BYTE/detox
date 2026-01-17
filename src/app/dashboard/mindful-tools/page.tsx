"use client";

import { useState } from "react";
import { Wind, Book, Footprints } from "lucide-react";
import { clsx } from "clsx";

const TOOLS = [
    { id: "breathe", title: "Box Breathing", icon: Wind, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "journal", title: "Journal Prompt", icon: Book, color: "text-amber-500", bg: "bg-amber-50" },
    { id: "walk", title: "Take a Walk", icon: Footprints, color: "text-green-500", bg: "bg-green-50" },
];

export default function MindfulToolsPage() {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Mindful Tools</h1>
                <p className="text-muted-foreground">Quick activities to reset your mind instead of scrolling.</p>
            </div>

            {!activeTool ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TOOLS.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTool(tool.id)}
                                className="group p-6 rounded-3xl bg-card border border-border/50 text-left hover:border-primary/50 hover:shadow-lg transition-all"
                            >
                                <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", tool.bg, tool.color)}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {tool.id === 'breathe' && "Calm your nervous system in 60 seconds."}
                                    {tool.id === 'journal' && "A quick reflection to clear your head."}
                                    {tool.id === 'walk' && "Step away from the screen."}
                                </p>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <button
                        onClick={() => setActiveTool(null)}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1"
                    >
                        ← Back to tools
                    </button>

                    <div className="bg-card rounded-3xl p-8 border border-border shadow-sm min-h-[400px] flex items-center justify-center">
                        {activeTool === 'breathe' && <BreathingTool />}
                        {activeTool === 'journal' && <JournalTool />}
                        {activeTool === 'walk' && <WalkTool />}
                    </div>
                </div>
            )}
        </div>
    );
}

function BreathingTool() {
    const [phase, setPhase] = useState('Inhale');

    // This is a visual-only CSS animation component
    // In a real app we'd drive phases with JS for precision
    return (
        <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center w-64 h-64">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-[ping_4s_ease-in-out_infinite] opacity-50" />
                <div className="w-48 h-48 bg-blue-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-200 z-10 animate-[pulse_4s_ease-in-out_infinite]">
                    <span className="text-2xl font-medium text-blue-700">Breathe</span>
                </div>
            </div>
            <p className="mt-8 text-muted-foreground">Inhale... Hold... Exhale... Hold...</p>
        </div>
    );
}

function JournalTool() {
    return (
        <div className="max-w-lg w-full">
            <h3 className="text-2xl font-serif font-medium mb-6 text-center">"What is occupying your mind right now?"</h3>
            <textarea
                className="w-full h-48 p-4 rounded-xl border border-border bg-background/50 focus:ring-2 ring-primary/20 outline-none resize-none"
                placeholder="Write it out here..."
            />
            <button className="mt-4 w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80">
                Save & Clear
            </button>
        </div>
    )
}

function WalkTool() {
    return (
        <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Footprints className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Time to Move</h3>
            <p className="text-muted-foreground mb-8 text-lg">
                Leave your phone here. Walk to the nearest window or door found in your room. Look outside for 1 minute.
            </p>
            <div className="p-4 bg-muted rounded-xl text-sm">
                <strong>Why?</strong> Resetting your visual focus prevents eye strain and reduces mental fatigue.
            </div>
        </div>
    )
}
