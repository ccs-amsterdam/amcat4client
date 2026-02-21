import { NextRequest } from "next/server";
import { getClientConfig, getSession, clientConfig } from "@/components/Auth/auth_server_lib";
import * as client from "openid-client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const clientUrl = getBaseUrl(req);
  const currentUrl = searchParams.get("returnTo") || req.headers.get("referer") || clientUrl;
  console.log(currentUrl);
  const config = clientConfig();

  const session = await getSession();
  const code_verifier = client.randomPKCECodeVerifier();
  const code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
  const parameters: Record<string, string> = {
    redirect_uri: `${clientUrl}/auth/callback`,
    resource: config.amcat_url,
    scope: config.scope!,
    code_challenge,
    code_challenge_method: config.code_challenge_method,
  };
  let state!: string;

  const authConfig = await getClientConfig(clientUrl);
  const oidcConfig = authConfig.configuration; // same for oidc and middlecat
  if (!oidcConfig.serverMetadata().supportsPKCE()) {
    state = client.randomState();
    parameters.state = state;
  }
  const redirectTo = client.buildAuthorizationUrl(oidcConfig, parameters);

  session.code_verifier = code_verifier;
  session.state = state;
  session.rd = currentUrl;

  await session.save();
  return Response.redirect(redirectTo.href);
}

const getBaseUrl = (req: NextRequest) => {
  const host = req.headers.get("x-forwarded-host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;

  const origin = req.headers.get("origin");
  if (origin) return origin;

  return req.nextUrl.origin;
};
