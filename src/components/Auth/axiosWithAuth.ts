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
export default function AxiosWithAuth(
  sessionData: SessionData | null,
  closeSession: () => void,
  updateCSRF: (csrf: string) => void,
  amcat_url: string
) {
  const api = axios.create();

  let currentSession = sessionData || null;
  let currentSessionPromise: Promise<SessionData> | undefined;

  async function requestInterceptor(config: any) {
    // ensure that resource is the base url, so that its not easy to
    // to send a request with the tokens somewhere else
    config.baseURL = amcat_url

    if (!currentSession) return config; // not authenticated

    // check if token still valid
    try {
      // Storing the promise outside of the intercepter makes parallel requests await the same promise
      if (!currentSessionPromise) currentSessionPromise = refreshToken(currentSession);
      currentSession = await currentSessionPromise;
      currentSessionPromise = undefined;

      updateCSRF(currentSession.csrf_token);
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
 * Makes sure the access_token is set and valid.
 */
async function refreshToken(sessionData: SessionData): Promise<SessionData> {
  const now = Date.now() / 1000;
  const nearfuture = now + 10; // refresh x seconds before expires
  if (!sessionData.access_token || sessionData.exp < nearfuture) {
    const tokens = await axios.post("/auth/refresh", {}, { headers: { "X-CSRF-TOKEN": sessionData.csrf_token } });
    const { access_token, csrf_token, exp } = tokens.data;
    return { ...sessionData, access_token, csrf_token, exp };
  }
  return sessionData;
}
