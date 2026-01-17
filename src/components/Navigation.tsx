"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, BarChart3, Coffee, Settings } from "lucide-react";
import { clsx } from "clsx";

const LINKS = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/focus", label: "Focus", icon: Zap },
    { href: "/dashboard/insights", label: "Insights", icon: BarChart3 },
    { href: "/dashboard/mindful-tools", label: "Breath", icon: Coffee },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Navigation() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar - Left side */}
            <nav className="hidden md:flex flex-col w-64 border-r border-border h-screen sticky top-0 bg-secondary/10 p-4">
                <div className="flex items-center gap-2 px-4 py-6 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                        M
                    </div>
                    <span className="font-bold text-lg tracking-tight">MindfulScreen</span>
                </div>

                <div className="space-y-1">
                    {LINKS.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                                        : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto p-4 bg-card rounded-xl border border-border/50 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-2">Today's Goal</p>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[45%]" />
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border flex justify-around p-2 pb-safe z-50">
                {LINKS.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "flex flex-col items-center justify-center p-2 rounded-xl transition-colors w-16",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={clsx("w-6 h-6 mb-1", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
