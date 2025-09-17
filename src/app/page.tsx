"use client";

import { useMiddlecat } from "middlecat-react";
import Link from "next/link";

import { useAmcatConfig } from "@/api/config";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useAmcatBranding } from "@/api/branding";
import { ArrowRight, BarChart2, HatGlasses, Search, Share, Zap } from "lucide-react";
import Markdown from "react-markdown";
import { AmcatBranding, AmcatConfig } from "@/interfaces";
import { Loading } from "@/components/ui/loading";

export default function Index() {
  const { user, signIn, loading: userLoading } = useMiddlecat();
  const { data: serverConfig, isLoading: configLoading } = useAmcatConfig();
  const { data: serverBranding, isLoading: brandingLoading } = useAmcatBranding();

  if (userLoading || configLoading || brandingLoading) return <Loading />;

  return (
    <>
      <main className="flex flex-grow flex-col">
        <BigBanner serverConfig={serverConfig} serverBranding={serverBranding} />
        <ReadyBanner />
        <SplashFooter serverBranding={serverBranding} />
      </main>
    </>
  );
}

function BigBanner({ serverConfig, serverBranding }: { serverConfig?: AmcatConfig; serverBranding?: AmcatBranding }) {
  const { user, signIn } = useMiddlecat();
  const router = useRouter();
  if (user == null || serverConfig == null || serverBranding == null) return null;

  const message_md =
    serverBranding.welcome_text ??
    "# Unlock the Power of Text Analysis\n\nAmCAT is an open-source platform for advanced content analysis and text mining. Discover insights from your textual data with ease.";
  const require_login =
    serverConfig.authorization === "allow_authenticated_guests" ||
    serverConfig.authorization === "authorized_users_only";
  const no_auth = serverConfig.authorization === "no_auth";
  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 py-20 text-background md:pb-32 md:pt-52">
      <div className="container prose-xl mx-auto max-w-6xl px-4 text-center dark:prose-invert">
        <Markdown>{message_md}</Markdown>
        <div className="space-x-4">
          {no_auth ? (
            <>
              <p>
                This server does not use authentication. This is indented for using AmCAT on your own computer, but
                please configure authentication if using AmCAT on a network or server.{" "}
                <a href="https://amcat.nl/book/04._sharing">
                  <b>More information</b>
                </a>
              </p>{" "}
              <Link href="/indices">
                <Button size="lg">
                  Enter server
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : user.authenticated ? (
            <Link href="/indices">
              <Button size="lg" className="">
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
    <div className="container mx-auto px-4">
      {/*<h2 className="mb-12 text-center text-3xl font-semibold">Key Features</h2>*/}
      <div className="grid gap-8 md:grid-cols-3">
        <FeatureCard
          icon={<Search className="h-10 w-10 " />}
          title="Search"
          description="Create searchable text and multimedia repositories"
        />
        <FeatureCard
          icon={<BarChart2 className="h-10 w-10" />}
          title="Process"
          description="
       Enrich content with advanced preprocessing and analysis tools
        "
        />
        <FeatureCard
          icon={<Share className="h-10 w-10 " />}
          title="Share"
          description="Fine-grained access control for collaboration and open-science"
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
}
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg bg-gradient-to-t from-primary to-primary/90 p-6 text-primary-foreground shadow-md">
      <div className="mb-4 flex items-center gap-6">
        {icon}
        <h3 className=" text-xl font-semibold ">{title}</h3>
      </div>
      <div className="mt-auto text-left">
        <p>{description}</p>
      </div>
    </div>
  );
}
function ReadyBanner() {
  return (
    <section className="pb-20 pt-44">
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
        <div className="mt-16">
          <FeatureCards />
        </div>
      </div>
    </section>
  );
}

function SplashFooter({ serverBranding }: { serverBranding?: AmcatBranding } = {}) {
  if (serverBranding == null) return null;
  const links = serverBranding.client_data?.information_links;
  const n_cols = 2 + (links == null ? 0 : links.length);
  return (
    <footer className="mx-4 mt-auto pt-4">
      <div className="py-6">
        <div className="mt-8 border-t border-foreground/20 pt-8" />
        <div className={`grid gap-8 md:grid-cols-${n_cols}`}>
          <div>
            <h3 className="mb-2 text-sm font-semibold">AmCAT</h3>
            <ul className="text-sm">
              <li>Open-source text analysis software for researchers and analysts.</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://amcat.nl/book/" className=" hover:text-blue-600">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="https://github.com/ccs-amsterdam/amcat4" className=" hover:text-blue-600">
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
          {links == null
            ? null
            : links.map((link, i) => (
                <div key={i}>
                  <h3 className="mb-2 font-semibold ">{link.title}</h3>
                  <ul className="space-y-2 text-sm">
                    {link.links.map((item, j) => (
                      <li key={j}>
                        <Link href={item.href as string} className=" hover:text-blue-600">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
        </div>
        <div className="mt-8 border-t border-foreground/20 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AmCAT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
