import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CampusHub — Your Smart Campus Companion",
    template: "%s | CampusHub",
  },
  description:
    "Interactive campus navigation, real-time facility status, academic tools, and student life — all in one progressive web app.",
  keywords: [
    "campus map",
    "college navigation",
    "student app",
    "campus hub",
    "timetable",
    "notices",
    "campus facilities",
  ],
  authors: [{ name: "CampusHub Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CampusHub",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "CampusHub",
    title: "CampusHub — Your Smart Campus Companion",
    description: "Interactive campus map, academics & student life platform.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
