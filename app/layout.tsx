import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sourceSerif4 = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif-4" });
export const metadata: Metadata = {
  title: {
    default: "DigiSafe AI",
    template: "%s | DigiSafe AI",
  },
  description:
    "A child-protection and digital-safety platform developed by AYVDI.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en" className={`${inter.variable} ${sourceSerif4.variable}`}>
    <html lang="en" className={`${sourceSerif4.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
