import { ThemeProvider } from "@/components/ui/theme-provider";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { setupGlobalErrorHandling } from "@/utils/errorHandling";
import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Inter,
  Lato,
} from "next/font/google";
import Head from "next/head";
import { Toaster } from "sonner";
import "./globals.css";
import "@/components/common/ErrorBoundary.css";


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


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "TWIQ AI Coaches – Content Creation Powered by Storytelling",
  description:
    "Supercharge your content with AI coaches trained in the TWIQ Method. Generate carousels, scripts, captions, headlines, and LinkedIn posts tailored to your industry and audience—effortlessly.",
  keywords: [
    "TWIQ Method",
    "AI content creation",
    "AI carousel generator",
    "AI script writer",
    "LinkedIn AI assistant",
    "AI captions",
    "Instagram carousels",
    "video scripts",
    "Reels and TikToks",
    "content marketing tools",
    "AI storytelling",
    "thought leadership content"
  ],
  openGraph: {
    title: "TWIQ AI Coaches – Scroll-Stopping Content, Instantly",
    description:
      "7 expert AI coaches. One TWIQ framework. Build content that hooks, converts, and connects—carousels, captions, scripts, and more.",
    url: "https://yourdomain.com", // replace with your domain
    siteName: "TWIQ AI Coaches",
    images: [
      {
        url: "https://yourdomain.com/og-image.png", // Add your social sharing image
        width: 1200,
        height: 630,
        alt: "TWIQ AI Coaches – Powered by Storytelling",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TWIQ AI Coaches",
    description:
      "AI-powered carousel, video, and caption generators built for creators using the TWIQ storytelling method.",
    images: ["https://yourdomain.com/og-image.png"], // Add your social image
    creator: "@yourTwitterHandle", // optional
  },
  metadataBase: new URL("https://yourdomain.com"), // replace with your domain
};


export default function RootLayout({ children }) {
  // Setup global error handling on client side
  if (typeof window !== 'undefined') {
    setupGlobalErrorHandling();
  }

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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${lato.variable} ${cormorant.variable} antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider defaultTheme="light">
            {children}
          </ThemeProvider>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
