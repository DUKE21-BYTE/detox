"use client";

import { useStore } from "@/store/useStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const DATA = [
    { name: 'Mon', minutes: 30 },
    { name: 'Tue', minutes: 45 },
    { name: 'Wed', minutes: 25 },
    { name: 'Thu', minutes: 60 },
    { name: 'Fri', minutes: 90 },
    { name: 'Sat', minutes: 45 },
    { name: 'Sun', minutes: 80 },
];

export default function InsightsPage() {
    const { dailyScreenFreeGoal } = useStore();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Weekly Insights</h1>
                <p className="text-muted-foreground">See how your focus habits are building up.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Main Chart */}
                <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm col-span-1 md:col-span-2">
                    <h3 className="font-semibold mb-6 flex items-center justify-between">
                        <span>Focus Minutes</span>
                        <span className="text-sm font-normal text-muted-foreground">Last 7 Days</span>
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.2 }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderRadius: '12px',
                                        border: '1px solid hsl(var(--border))',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Bar dataKey="minutes" radius={[6, 6, 0, 0]} maxBarSize={50}>
                                    {DATA.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.minutes >= dailyScreenFreeGoal ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.5)'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
                    <h3 className="text-muted-foreground text-sm font-medium mb-1">Total Focus Time</h3>
                    <p className="text-4xl font-bold text-foreground">5h 35m</p>
                    <div className="flex items-center gap-2 mt-4 text-sm text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full">
                        <span>+12% vs last week</span>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
                    <h3 className="text-muted-foreground text-sm font-medium mb-1">Most Productive Time</h3>
                    <p className="text-4xl font-bold text-foreground">Morning</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        You complete 60% of your sessions before 11 AM.
                    </p>
                </div>

            </div>
        </div>
    );
}
