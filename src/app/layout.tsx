import ClientProviders from "@/components/ClientProviders";
import Navbar from "@/components/Menu/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { getSession } from "@/components/Auth/auth_server_lib";
import { SessionData } from "@/components/Auth/AuthProvider";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const sessionData: SessionData | null = session.access_token
    ? {
        email: session.userInfo?.email || "",
        name: session.userInfo?.name || "",
        csrf_token: session.csrf_token || "",
        access_token: session.access_token,
        exp: session.exp || 0,
      }
    : null;

  return (
    <html lang="en" className={font.className} suppressHydrationWarning>
      <body className="no-scrollbar relative flex min-h-screen flex-col scroll-smooth ">
        <ClientProviders sessionData={sessionData}>
          <Navbar />
          {children}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
