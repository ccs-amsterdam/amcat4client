import {
  getClientConfig,
  getSession,
  clientConfig,
  AmcatSessionUserInfo,
  SessionData,
} from "@/components/Auth/auth_server_lib";
import { IronSession } from "iron-session";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import * as client from "openid-client";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const clientUrl = request.nextUrl.origin;
  const redirectBack = session.rd || clientUrl;

  const headerList = headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "localhost";
  const protocol = headerList.get("x-forwarded-proto") || "https";
  const currentUrl = new URL(`${protocol}://${host}${request.nextUrl.pathname}${request.nextUrl.search}`);

  const config = await getClientConfig(clientUrl);
  if (config.type === "oidc") {
    return oidcCodeGrant({ session, currentUrl, redirectBack, config });
  } else {
    return middlecatCodeGrant({ session, currentUrl, redirectBack, config });
  }
}

async function oidcCodeGrant({
  session,
  currentUrl,
  redirectBack,
  config,
}: {
  session: IronSession<SessionData>;
  currentUrl: URL;
  redirectBack: string;
  config: { type: "oidc"; configuration: client.Configuration };
}) {
  const oidcConfig = config.configuration;

  const tokenSet = await client.authorizationCodeGrant(oidcConfig, currentUrl, {
    pkceCodeVerifier: session.code_verifier,
    expectedState: session.state,
  });

  const { access_token, refresh_token } = tokenSet;
  const claims = tokenSet.claims()!;

  const { sub, exp } = claims;
  const userinfo = await client.fetchUserInfo(oidcConfig, access_token, sub);

  session.access_token = access_token;
  session.exp = exp;
  session.userInfo = {
    sub: userinfo.sub,
    name: userinfo.given_name!,
    email: userinfo.email_verified ? userinfo.email! : "",
  };
  await session.save();

  return Response.redirect(redirectBack);
}

async function middlecatCodeGrant({
  session,
  currentUrl,
  redirectBack,
  config,
}: {
  session: IronSession<SessionData>;
  currentUrl: URL;
  redirectBack: string;
  config: { type: "middlecat"; configuration: client.Configuration };
}) {
  const middlecatConfig = config.configuration;
  const tokenEndpoint = middlecatConfig.serverMetadata().token_endpoint || "";

  const res = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      // URLSearchParams automatically sets content-type to application/x-www-form-urlencoded
      // But explicitly adding it never hurts
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: currentUrl.searchParams.get("code") || "",
      code_verifier: session.code_verifier || "",
    }),
  });
  const tokenSet: Record<string, string> = await res.json();

  const claims = JSON.parse(Buffer.from(tokenSet.access_token.split(".")[1], "base64").toString("utf-8"));
  const { name, email, exp } = claims;

  session.access_token = tokenSet.access_token;
  session.refresh_token = tokenSet.refresh_token;
  session.exp = exp;
  session.userInfo = {
    sub: email,
    name,
    email,
  };
  await session.save();

  return Response.redirect(redirectBack);
}
