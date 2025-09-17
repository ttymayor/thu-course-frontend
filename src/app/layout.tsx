import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import FirstLoadingAnimation from "@/components/FirstLoadingAnimation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thc.ttymayor.com"),
  title: {
    template: "%s • 東海課程資訊",
    default: "東海課程資訊",
  },
  description: "一個更好的東海課程資訊網站",
  openGraph: {
    title: "東海課程資訊",
    description: "一個更好的東海課程資訊網站",
    images: [
      {
        url: "https://thc.ttymayor.com/api/og",
        width: 1200,
        height: 630,
        alt: "東海課程資訊 - 一個更好的東海課程資訊網站",
      },
    ],
    type: "website",
    url: "https://thc.ttymayor.com",
    siteName: "東海課程資訊",
    locale: "zh-TW",
  },
  twitter: {
    card: "summary_large_image",
    title: "東海課程資訊",
    description: "一個更好的東海課程資訊網站",
    site: "@thc_ttymayor",
    creator: "@thc_ttymayor",
    images: [
      {
        url: "https://thc.ttymayor.com/api/og",
        alt: "東海課程資訊 - 一個更好的東海課程資訊網站",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics gaId="G-8CG8PZK1MJ" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirstLoadingAnimation />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
