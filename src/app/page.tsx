import Link from "next/link";
import { ArrowRight, Moon, Smartphone, BarChart3, Wind } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 font-semibold text-xl tracking-tight text-primary">
          <Wind className="w-6 h-6" />
          <span>Oasis</span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/login" className="text-foreground hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link
            href="/onboarding"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-6 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live intuitively, scroll less.
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Reclaim your time from <br className="hidden md:block" />
            <span className="text-primary italic">compulsive scrolling</span>.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            A supportive, calm companion that helps you build healthier digital habits without the guilt.
            Focus better, sleep deeper, and be present.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href="/onboarding"
              className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:translate-y-[-2px] transition-all shadow-lg shadow-primary/20"
            >
              Start Your Journey <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="h-12 px-8 rounded-full bg-secondary/30 text-secondary-foreground font-medium flex items-center gap-2 hover:bg-secondary/50 transition-colors"
            >
              How it works
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 px-6 bg-secondary/20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Moon className="w-8 h-8 text-primary" />}
              title="Sleep Better"
              description="Gentle nudges to disconnect before bed, helping you wake up refreshed and ready."
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8 text-primary" />}
              title="Focus Sessions"
              description="Dedicated distraction-free blocks with calming visuals and mindful pause reminders."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-primary" />}
              title="Gentle Insights"
              description="Understand your habits without shame. See patterns and celebrate small wins."
            />
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 text-center text-muted-foreground text-sm border-t border-border/40">
        <p>&copy; {new Date().getFullYear()} Oasis. Built for well-being.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 bg-secondary/30 rounded-xl w-fit">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
