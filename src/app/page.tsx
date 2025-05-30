"use client";

import { useMiddlecat } from "middlecat-react";
import Link from "next/link";

import { useAmcatConfig } from "@/api/config";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useAmcatBranding } from "@/api/branding";
import { ArrowRight, BarChart2, Search, Zap } from "lucide-react";
import Markdown from "react-markdown";

export default function Index() {
  return (
    <>
      <main className="flex-grow">
        <BigBanner />
        <FeatureCards />
        <ReadyBanner />
        <SplashFooter />
      </main>
    </>
  );
}

function BigBanner() {
  const { user, signIn } = useMiddlecat();
  const { data: serverConfig } = useAmcatConfig();
  const { data: serverBranding } = useAmcatBranding();
  const router = useRouter();
  if (user == null || serverConfig == null || serverBranding == null) return null;

  const message_md =
    serverBranding.welcome_text ??
    "# Unlock the Power of Text Analysis\n\nAmCAT is an open-source platform for advanced content analysis and text mining. Discover insights from your textual data with ease.";
  const require_login =
    serverConfig.authorization === "allow_authenticated_guests" ||
    serverConfig.authorization === "authorized_users_only";
  return (
    <section className="bg-primary/15 py-20">
      <div className="container prose-xl mx-auto max-w-6xl px-4 text-center dark:prose-invert">
        <Markdown>{message_md}</Markdown>
        <div className="space-x-4">
          {user.authenticated ? (
            <Link href="/indices">
              <Button size="lg">
                Enter Server
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <>
              <Button size="lg" onClick={() => signIn()}>
                Log in
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              &nbsp;
              {require_login ? null : (
                <Link href="/indices">
                  <Button size="lg">
                    Continue as Guest
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </>
          )}
          {(serverBranding.client_data?.welcome_buttons ?? []).map((action, i) => (
            <Link key={i} href={action.href}>
              <Button size="lg" variant="outline">
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCards() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-semibold text-gray-900">Key Features</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Search className="h-10 w-10 text-primary" />}
            title="Advanced Text Search"
            description="Powerful search capabilities to find relevant information quickly and efficiently."
          />
          <FeatureCard
            icon={<BarChart2 className="h-10 w-10 text-primary" />}
            title="In-depth Analysis"
            description="Comprehensive tools for content analysis, including sentiment analysis and topic modeling."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-primary" />}
            title="Fast Processing"
            description="High-performance algorithms to handle large volumes of text data with speed and accuracy."
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
}
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg bg-primary/15 p-6 shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
function ReadyBanner() {
  return (
    <section className="bg-primary py-20 text-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">AmCAT: Open, Accessible, Scalable</h2>
        <p className="mx-auto mb-8 max-w-3xl text-xl">
          AmCAT is a completely open and user friendly text storage and analysis system. Because it is built on
          ElasticSearch, it is highly scalable and extremely fast.
        </p>
        <Link href="https://amcat.nl/book/">
          <Button size="lg" variant="secondary">
            Learn more
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function SplashFooter() {
  const { data: serverBranding } = useAmcatBranding();
  if (serverBranding == null) return null;
  const links = serverBranding.client_data?.information_links;
  const n_cols = 2 + (links == null ? 0 : links.length);
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className={`grid gap-8 md:grid-cols-${n_cols}`}>
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">AmCAT</h3>
            <p className="text-sm text-gray-600">Open-source text analysis software for researchers and analysts.</p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://amcat.nl/book/" className="text-gray-600 hover:text-blue-600">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="https://github.com/ccs-amsterdam/amcat4" className="text-gray-600 hover:text-blue-600">
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
          {links == null
            ? null
            : links.map((link, i) => (
                <div key={i}>
                  <h3 className="mb-2 font-semibold text-gray-900">{link.title}</h3>
                  <ul className="space-y-2 text-sm">
                    {link.links.map((item, j) => (
                      <li key={j}>
                        <Link href={item.href as string} className="text-gray-600 hover:text-blue-600">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} AmCAT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
