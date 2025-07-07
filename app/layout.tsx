import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootProvider from "@/components/provider/RootProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IRIS - Intelligent Response & Information System",
  description: "A powerful AI assistant with multi-modal capabilities including chat, image generation, weather information, diagram creation, and YouTube transcription.",
  keywords: [
    "AI assistant",
    "IRIS",
    "image generation",
    "DALL-E",
    "weather information",
    "diagram creation",
    "mermaid diagrams",
    "YouTube transcription",
    "Next.js",
    "AI chat",
    "Amardeep Lakshkar"
  ],
  authors: [{ name: "Amardeep Lakshkar", url: "https://github.com/amardeeplakshkar" }],
  creator: "Amardeep Lakshkar",
  publisher: "Amardeep Lakshkar",
  robots: "index, follow",
  metadataBase: new URL("https://iris.amardeep.space"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://iris.amardeep.space",
    title: "IRIS - Intelligent Response & Information System",
    description: "A powerful AI assistant with multi-modal capabilities including chat, image generation, weather information, diagram creation, and YouTube transcription.",
    siteName: "IRIS AI Assistant",
    images: [
      {
        url: "https://iris.amardeep.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "IRIS AI Assistant"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "IRIS - Intelligent Response & Information System",
    description: "A powerful AI assistant with multi-modal capabilities including chat, image generation, weather information, diagram creation, and YouTube transcription.",
    images: ["https://iris.amardeep.space/og-image.png"],
    creator: "@amardeeplakshkar"
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <RootProvider>
        {children}
        </RootProvider>
      </body>
    </html>
  );
}
