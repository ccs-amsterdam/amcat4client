import { NextRequest } from "next/server";
import { getClientConfig, getSession, clientConfig } from "@/components/Auth/auth_server_lib";
import * as client from "openid-client";

export async function GET(req: NextRequest) {
  const clientUrl = req.nextUrl.origin;
  const currentUrl = req.headers.get("referer") || "";

  const session = await getSession();
  const code_verifier = client.randomPKCECodeVerifier();
  const code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
  const parameters: Record<string, string> = {
    redirect_uri: `${clientUrl}/auth/callback`,
    resource: clientConfig.amcat_url,
    scope: clientConfig.scope!,
    code_challenge,
    code_challenge_method: clientConfig.code_challenge_method,
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
