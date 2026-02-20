import { NextRequest, NextResponse } from "next/server";
import { defaultSession, getClientConfig, getSession, SessionData } from "../../../components/Auth/auth_server_lib";
import * as client from "openid-client";
import { IronSession } from "iron-session";

export async function POST(req: NextRequest) {
  const session = await getSession();

  console.log(req.headers.get("X-CSRF-TOKEN"), session.csrf_token);
  if (session.csrf_token && req.headers.get("X-CSRF-TOKEN") !== session.csrf_token) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const clientUrl = req.nextUrl.origin;
  const currentUrl = req.headers.get("referer") || "";

  const authConfig = await getClientConfig(clientUrl);

  // OIDC logout
  if (authConfig.type === "oidc") {
    const endSessionUrl = client.buildEndSessionUrl(authConfig.configuration, {
      post_logout_redirect_uri: currentUrl,
      id_token_hint: session.access_token!,
    });
    await closeSession(session);
    return NextResponse.json({ logout_url: endSessionUrl.href });

    // Middlecat logout
  } else {
    const tokenEndpoint = authConfig.configuration.serverMetadata().token_endpoint;
    const res = await fetch(tokenEndpoint!, {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "kill_session",
        refresh_token: session.refresh_token || "",
      }),
    });
    if (res.ok || res.status === 500) {
      await closeSession(session);
    }
    return NextResponse.json({});
  }
}

async function closeSession(session: IronSession<SessionData>) {
  session.access_token = defaultSession.access_token;
  session.userInfo = defaultSession.userInfo;
  session.code_verifier = defaultSession.code_verifier;
  session.state = defaultSession.state;
  session.rd = defaultSession.rd;
  await session.save();
}
