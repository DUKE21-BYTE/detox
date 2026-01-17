import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oasis | Digital Detox & Well-Being",
  description: "Reclaim your time from screen addiction. A calm, supportive companion for digital well-being.",
  applicationName: "Oasis",
  keywords: ["digital detox", "screen time", "wellbeing", "focus app", "oasis", "phone addiction"],
  openGraph: {
    title: "Oasis - Reclaim Your Time",
    description: "Your calm companion for digital well-being.",
    siteName: "Oasis",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.className} antialiased bg-background text-foreground flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
