import {
  Geist,
  Geist_Mono,
  Inter,
  Lato,
  Source_Sans_3,
} from "next/font/google";
import Head from "next/head";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"], // Include all necessary weights
  variable: "--font-inter",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"], // Include all necessary weights
  variable: "--font-lato",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-source-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TWIQ – AI-Powered Scriptwriting Research Assistant",
  description:
    "TWIQ helps content creators and video scriptwriters turn ideas into compelling video scripts using the T/W/I/Q Method – Thought, Wisdom, Insight, and Questions.",
  keywords: [
    "video scriptwriting",
    "content creation AI",
    "storytelling assistant",
    "TWIQ method",
    "script planning tool",
    "creative research AI",
    "scriptwriting SaaS",
    "AI for YouTube creators",
    "content strategy AI",
  ],
  authors: [{ name: "Your Company Name", url: "https://yourdomain.com" }],
  creator: "Your Company Name",
  openGraph: {
    title: "TWIQ – AI-Powered Scriptwriting Research Assistant",
    description:
      "Plan, research, and structure compelling video scripts faster with TWIQ. Built for content creators using the T/W/I/Q storytelling framework.",
    url: "https://yourdomain.com",
    siteName: "TWIQ",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TWIQ – AI Scriptwriting Assistant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TWIQ – AI Scriptwriting Assistant",
    description:
      "TWIQ is built for creators. Structure your ideas and research into powerful scripts using the T/W/I/Q Method.",
    creator: "@yourhandle",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  metadataBase: new URL("https://yourdomain.com"),
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Standard Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />

        {/* PNG Favicons */}
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />

        {/* Apple Touch Icon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Android Chrome Icon */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon-192x192.png"
        />

        {/* Manifest (Optional for PWA) */}
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${lato.variable} ${sourceSans3.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
