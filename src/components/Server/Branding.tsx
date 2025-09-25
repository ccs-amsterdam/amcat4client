"use client";

import { useMiddlecat } from "middlecat-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { ArrowRight } from "lucide-react";
import Markdown from "react-markdown";
import { AmcatBranding, AmcatConfig } from "@/interfaces";

export function Branding({
  serverConfig,
  serverBranding,
}: {
  serverConfig?: AmcatConfig;
  serverBranding?: AmcatBranding;
}) {
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
    <section className="bg-gradient-to-r from-primary to-primary/80 text-background ">
      {/*<div className="flex items-center justify-center gap-1 whitespace-nowrap pl-9 pt-3">
        <ServerNameAndLink serverBranding={serverBranding} />
      </div>*/}
      <div className="container prose-xl mx-auto max-w-6xl px-4 py-10 text-center dark:prose-invert prose-a:underline md:py-32">
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
              <Button size="lg" variant="secondary">
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServerNameAndLink({ serverBranding }: { serverBranding: AmcatBranding }) {
  if (serverBranding == null) return null;
  const logo = (
    <Button className="flex items-center gap-1 whitespace-nowrap text-lg" variant="ghost">
      {serverBranding.server_icon ? (
        <img alt="Server icon" src={serverBranding.server_icon} className="mr-2 inline h-8" />
      ) : null}
      {serverBranding.server_name}
    </Button>
  );
  return serverBranding.server_url ? (
    <Link href={serverBranding.server_url} className="">
      {logo}
    </Link>
  ) : (
    logo
  );
}

export function BrandingFooter({ serverBranding }: { serverBranding?: AmcatBranding } = {}) {
  if (serverBranding == null) return null;
  const links = serverBranding.client_data?.information_links;
  const n_cols = 2 + (links == null ? 0 : links.length);
  return (
    <footer className="mt-auto pt-4">
      <div className="container py-6">
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
