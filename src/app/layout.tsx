import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital Detox & Well-Being Coach",
  description: "Reclaim your time and attention with a calm, supportive coach.",
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
