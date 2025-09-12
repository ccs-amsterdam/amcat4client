"use client";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MiddlecatProvider } from "middlecat-react";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { TooltipProvider } from "./ui/tooltip";

const defaultOptions = {
  queries: {
    retry: (failureCount: number, e: any) => {
      if (failureCount >= 2) return false;
      const unauthorized = e.response?.status == 401;
      const forbidden = e.response?.status == 403;
      const zodError = e.name === "ZodError";
      const doRetry = !zodError && !unauthorized && !forbidden;
      return doRetry;
    },
    cacheTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5, // the lower the better the UX, but the higher the server load
  },
};

function zodErrorToast(e: ZodError) {
  const zoderror = fromZodError(e);
  toast.error("Invalid payload", { description: String(zoderror) });
}

function defaultErrorToast(e: any) {
  const msg = e?.response?.data?.detail || e?.response?.data?.message || e.message;
  if (msg) {
    const description = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
    toast.error(description);
  } else {
    toast.error(e.message);
  }
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  //const params = useSearchParams();

  // allow signing in to local server on specific port. Useful for development,
  // or for running local amcat without having to run a new client
  //const [port] = useState(() => params?.get("port"));

  const [serverUrl, setServerUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the server URL from our API endpoint
    fetch("/api/config")
      .then((response) => response.json())
      .then((data) => {
        setServerUrl(data.amcatServer);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch server URL:", error);
        // Fallback to the public environment variable or default
        setServerUrl(process.env.NEXT_PUBLIC_AMCAT_SERVER || "http://localhost:5000");
        setIsLoading(false);
      });
  }, []);

  const mutationCache = new MutationCache({
    onError: (e: any) => {
      console.error(e);

      if (e instanceof ZodError) {
        zodErrorToast(e);
      } else {
        defaultErrorToast(e);
      }
    },
  });
  const queryCache = new QueryCache({
    onError: (e: any) => {
      console.error(e);

      if (e instanceof ZodError) {
        zodErrorToast(e);
      } else {
        defaultErrorToast(e);
      }
    },
  });
  const [queryClient] = useState(() => new QueryClient({ mutationCache, queryCache, defaultOptions }));

  function renderIfLoaded() {
    if (isLoading) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-6">
          <img src="/logo.png" alt="AmCAT" width={150} height={150} className="mx-2 animate-bounce px-1" />
        </div>
      );
    }
    return (
      <>
        <MiddlecatProvider bff="/api/bffAuth" fixedResource={serverUrl}>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </MiddlecatProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {renderIfLoaded()}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
