import axios from "axios";
import { toast } from "sonner";
import { SessionData } from "./AuthProvider";

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
export default function AxiosWithAuth(sessionData: SessionData | null, closeSession?: () => void) {
  const api = axios.create();

  let currentSession: SessionData | null = null;
  if (sessionData) {
    currentSession = { ...sessionData };
    sessionData.access_token = "scrubbed";
  }
  let currentSessionPromise: Promise<SessionData> | undefined;

  async function requestInterceptor(config: any) {
    // ensure that resource is the base url, so that its not easy to
    // to send a request with the tokens somewhere else
    config.baseURL = process.env.NEXT_PUBLIC_AMCAT_SERVER;

    if (!currentSession) return config; // not authenticated

    // check if token still valid
    try {
      // Storing the promise outside of the intercepter makes parallel requests await the same promise
      if (!currentSessionPromise) currentSessionPromise = refreshToken(currentSession);
      currentSession = await currentSessionPromise;
      currentSessionPromise = undefined;

      config.headers.Authorization = `Bearer ${currentSession.access_token}`;
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
async function refreshToken(sessionData: SessionData): Promise<SessionData> {
  // We need to prevent multiple calls to the refresh token endpoint. So if
  // there is already a call to the refresh token endpoint ongoing, we return
  // that promise.
  const now = Date.now() / 1000;
  const nearfuture = now + 10; // refresh x seconds before expires
  if (sessionData.exp < nearfuture) {
    const tokens = await axios.post("/auth/refresh", {}, { headers: { "X-CSRF-TOKEN": sessionData.csrf_token } });
    const { access_token, csrf_token, exp } = tokens.data;
    return { ...sessionData, access_token, csrf_token, exp };
  }
  return sessionData;
}
