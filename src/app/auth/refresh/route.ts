import { NextRequest, NextResponse } from "next/server";
import { SessionData, defaultSession, getClientConfig, getSession } from "@/components/Auth/auth_server_lib";
import * as client from "openid-client";
import { IronSession } from "iron-session";

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (session.csrf_token && request.headers.get("X-CSRF-TOKEN") !== session.csrf_token) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const clientUrl = request.nextUrl.origin;
  const config = await getClientConfig(clientUrl);

  if (config.type === "oidc") {
    await oidcRefreshTokenGrant({ session, config });
  } else {
    await middlecatRefreshTokenGrant({ session, config });
  }

  return NextResponse.json({
    exp: session.exp,
    access_token: session.access_token,
    csrf_token: session.csrf_token,
  });
}

async function oidcRefreshTokenGrant({
  session,
  config,
}: {
  session: IronSession<SessionData>;
  config: { type: "oidc"; configuration: client.Configuration };
}) {
  const tokenSet = await client.refreshTokenGrant(config.configuration, session.refresh_token || "");
  const claims = tokenSet.claims()!;
  const { exp } = claims;
  session.access_token = tokenSet.access_token;
  session.refresh_token = tokenSet.refresh_token;
  session.csrf_token = crypto.randomUUID();
  session.exp = exp;
  await session.save();
}

async function middlecatRefreshTokenGrant({
  session,
  config,
}: {
  session: IronSession<SessionData>;
  config: { type: "middlecat"; configuration: client.Configuration };
}) {
  const tokenEndpoint = config.configuration.serverMetadata().token_endpoint;

  const res = await fetch(tokenEndpoint!, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: session.refresh_token || "",
    }),
  });
  const tokenSet: Record<string, string> = await res.json();

  const claims = JSON.parse(Buffer.from(tokenSet.access_token.split(".")[1], "base64").toString("utf-8"));
  const { exp } = claims;

  session.access_token = tokenSet.access_token;
  session.refresh_token = tokenSet.refresh_token;
  session.csrf_token = crypto.randomUUID();
  session.exp = exp;
  await session.save();
}
