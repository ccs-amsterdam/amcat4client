import axios from "axios";
import { toast } from "sonner";

interface AccessToken {
  access_token: string;
  exp: number;
}

/**
 * Creates an axios instance for making api requests to the AmCAT server.
 * The tokens are stored in the closure, and are automatically refreshed
 * when a request is made and the access token is about to expire.
 *
 * @param middlecat
 * @param resource
 * @param access_token
 * @param refresh_token
 * @returns
 */
export default function AxiosWithAuth(access_token?: AccessToken, closeSession?: () => void) {
  const api = axios.create();

  const guest = !access_token;
  let currentAccessToken = access_token;
  let getTokensPromise: Promise<AccessToken> | undefined;

  async function requestInterceptor(config: any) {
    // ensure that resource is the base url, so that its not easy to
    // to send a request with the tokens somewhere else
    config.baseURL = process.env.NEXT_PUBLIC_AMCAT_SERVER;
    if (guest) return config;

    // check if token still valid
    try {
      if (!currentAccessToken) throw new Error("No access token");

      // to prevent parallel calls to the refresh token endpoint, we store the
      // promise in getTokensPromise and return that promise if it exists.
      if (!getTokensPromise) getTokensPromise = refreshToken(currentAccessToken);
      currentAccessToken = await getTokensPromise;
      getTokensPromise = undefined;

      config.headers.Authorization = `Bearer ${currentAccessToken.access_token}`;
    } catch (e) {
      closeSession?.();
      toast.error("Failed to refresh session, please sign in again.");
    }

    return config;
  }

  api.interceptors.request.use(requestInterceptor, function (error) {
    Promise.reject(error);
  });

  return api;
}

/**
 * Checks if access token is about to expire. If so, we first refresh the tokens.
 */
async function refreshToken(access_token: AccessToken): Promise<AccessToken> {
  // We need to prevent multiple calls to the refresh token endpoint. So if
  // there is already a call to the refresh token endpoint ongoing, we return
  // that promise.
  const now = Date.now() / 1000;
  const nearfuture = now + 10; // refresh x seconds before expires
  if (access_token.exp < nearfuture) {
    const tokens = await axios.post("/auth/refresh");
    const { access_token, exp } = tokens.data;
    return { access_token, exp };
  }
  return access_token;
}
