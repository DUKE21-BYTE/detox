import { Navigation } from "@/components/Navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Navigation />
            <main className="flex-1 md:ml-0 pb-20 md:pb-0 overflow-y-auto">
                <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
