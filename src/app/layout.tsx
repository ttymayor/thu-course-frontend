import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  authors: {
    name: "tantuyu",
    url: "https://github.com/ttymayor",
  },
  keywords: [
    "東海課程資訊",
    "東海選課",
    "東海",
    "東海大學選課資訊",
    "東海大學選課",
    "東海大學",
    "THU",
    "選課資訊查詢",
    "選課模擬器",
    "排課系統",
    "選課清單",
    "校園地圖",
    "剩餘名額",
    "選課人數",
    "選課時間",
  ],
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
