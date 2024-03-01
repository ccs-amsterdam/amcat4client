import { absoluteUrl } from "@/lib/utils";
import "./globals.css";
import { Metadata } from "next";
import Navbar from "@/components/Menu/Navbar";
import Link from "next/link";
import { Poppins, Roboto } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";
import { Toaster } from "@/components/ui/sonner";

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
    icon: [{ url: "/favicon/favicon-32x32.png" }],
    apple: [{ url: "/favicon/apple-touch-icon.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className} suppressHydrationWarning>
      <body className="relative flex min-h-screen flex-col scroll-smooth ">
        <ClientProviders>
          <Navbar />
          <div className="flex h-full w-full flex-auto flex-col pt-6 md:pt-6">
            <div className="flex justify-center">
              <div className="w-full max-w-[1500px] px-5 py-5 sm:px-10">{children}</div>
            </div>
          </div>
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
