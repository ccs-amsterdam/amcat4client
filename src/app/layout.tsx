import { absoluteUrl } from "@/lib/utils";
import "./globals.css";
import { Metadata } from "next";
import Navbar from "@/components/Menu/Navbar";
import Link from "next/link";
import { Poppins, Roboto } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const font = Poppins({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "AmCAT",
    template: "%s | AmCAT",
  },
  description: "Amsterdam Content Analysis Toolkit",

  openGraph: {
    title: "AmCAT",
    description: "Amsterdam Content Analysis Toolkit",
    url: absoluteUrl("/"),
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [{ url: "/favicon/favicon.ico" }],
    apple: [{ url: "/favicon/apple-touch-icon.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className} suppressHydrationWarning>
      <body className="relative flex min-h-screen flex-col scroll-smooth ">
        <ClientProviders>
          <Navbar />
          {children}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
