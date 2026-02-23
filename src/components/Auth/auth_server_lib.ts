// Server-side functions for authentication handling

import { IronSession, SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import * as client from "openid-client";

export const clientConfig = () => {
  const amcat_url = process.env.AMCAT4_API;
  if (!amcat_url) throw new Error("Missing AMCAT4_API environment variable");

  return {
    amcat_url,
    scope: "openid profile email",
    response_type: "code",
    grant_type: "authorization_code",
    code_challenge_method: "S256",
  };
};

export type AuthConfig =
  | {
      type: "oidc";
      configuration: client.Configuration;
    }
  | {
      type: "middlecat";

      configuration: client.Configuration;
    };

export interface SessionData {
  access_token?: string;
  refresh_token?: string;
  csrf_token?: string;
  exp?: number;
  code_verifier?: string;
  state?: string;
  userInfo?: {
    sub: string;
    name: string;
    email: string;
  };
  rd?: string;
}

export const defaultSession: SessionData = {};

export const sessionOptions: () => SessionOptions = () => {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) throw new Error("Missing COOKIE_SECRET environment variable");
  if (secret.length < 32) throw new Error("COOKIE_SECRET must be at least 32 characters long");

  return {
    password: secret,
    cookieName: "next_js_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
    ttl: 60 * 60 * 24 * 7, // 1 week
  };
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookiesList = await cookies();
  const session = await getIronSession<SessionData>(cookiesList, sessionOptions());
  return session;
}

export async function getClientConfig(clientUrl: string): Promise<AuthConfig> {
  // discover OIDC or Middlecat configuration
  const amcat_url = process.env.AMCAT4_SERVER_API || process.env.AMCAT4_API;
  if (!amcat_url) throw new Error("Missing AMCAT4_API environment variable");

  const res = await fetch(`${amcat_url}/config`);
  const amcatInfo = await res.json();

  // manually construct Middlecat configuration
  if (amcatInfo.middlecat_url) {
    const issuer = amcatInfo.middlecat_url;
    const server: client.ServerMetadata = {
      issuer: issuer,
      authorization_endpoint: new URL("/authorize", issuer).href,
      token_endpoint: new URL("/api/token", issuer).href,
      response_types_supported: ["code"],
      subject_types_supported: ["public"],
      id_token_signing_alg_values_supported: ["RS256"],
    };
    const clientId = clientUrl;
    const clientSecret = clientUrl;
    return {
      type: "middlecat",
      configuration: new client.Configuration(server, clientId, clientSecret),
    };

    // OIDC discovery
  } else if (amcatInfo.oidc_url) {
    const oidc_client_id = process.env.OIDC_CLIENT_URL;
    const oidc_client_secret = process.env.OIDC_CLIENT_SECRET;
    if (!oidc_client_id) throw new Error("Missing OIDC_CLIENT_ID environment variable");
    if (!oidc_client_secret) throw new Error("Missing OIDC_CLIENT_SECRET environment variable");
    // const conf = await client.discovery(new URL(amcatInfo.oidc_url), oidc_client_id, oidc_client_secret, undefined, {
    //   execute: process.env.NODE_ENV === "production" ? [] : [client.allowInsecureRequests], // insecure only in dev
    // });
    const conf = await client.discovery(new URL(amcatInfo.oidc_url), oidc_client_id, oidc_client_secret);
    return {
      type: "oidc",
      configuration: conf,
    };
  } else {
    throw new Error("No valid authentication configuration found on Amcat server");
  }
}

export function AmcatSessionUserInfo(access_token: string) {
  const claims = JSON.parse(Buffer.from(access_token.split(".")[1], "base64").toString("utf-8"));
  return {
    sub: claims.sub,
    name: claims.name,
    email: claims.email,
  };
}
