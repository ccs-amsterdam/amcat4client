import { absoluteUrl } from "@/lib/utils";
import "./globals.css";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Poppins, Roboto } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";

const font = Poppins({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "VU Verkiezingsonderzoek 2023",
    template: "%s | VU Verkiezingsonderzoek 2023",
  },
  description: "Resultaten en achtergrondinformatie van het VU Verkiezingsonderzoek 2023",

  openGraph: {
    title: "VU Verkiezingsonderzoek 2023",
    description: "Resultaten en achtergrondinformatie van het VU Verkiezingsonderzoek 2023",
    url: absoluteUrl("/"),
    locale: "nl_NL",
    type: "website",
  },
  icons: {
    icon: [{ url: "/favicon/favicon-32x32.png" }],
    apple: [{ url: "/favicon/apple-touch-icon.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className}>
      <body className="relative flex min-h-screen flex-col scroll-smooth ">
        <ClientProviders>
          <Navbar />
          <div className="flex h-full w-full flex-auto flex-col pt-6 md:pt-12">{children}</div>
        </ClientProviders>
      </body>
    </html>
  );
}
