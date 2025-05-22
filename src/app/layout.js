import {
  Geist,
  Geist_Mono,
  Inter,
  Lato,
  Source_Sans_3,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import Head from "next/head";

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
  title: "ScaleWorks - The First AI Legal Assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <Head>
      {/* Standard Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />

      {/* PNG Favicons */}
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />


      {/* Apple Touch Icon */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {/* Android Chrome Icon */}
      <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />

      {/* Manifest (Optional for PWA) */}
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${lato.variable} ${sourceSans3.variable} antialiased`}
      >
        <SidebarProvider>
          {children}
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
