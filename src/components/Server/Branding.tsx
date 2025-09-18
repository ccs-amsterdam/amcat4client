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
