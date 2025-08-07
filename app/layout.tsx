import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootProvider from "@/components/provider/RootProvider";
import Head from "next/head";
import { TRPCReactProvider } from "@/lib/trpc/client";

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
    <TRPCReactProvider>
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
    </TRPCReactProvider>
  );
}
