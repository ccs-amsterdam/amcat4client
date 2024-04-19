"use client";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MiddlecatProvider } from "middlecat-react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { toast } from "sonner";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { TooltipProvider } from "./ui/tooltip";
import { useSearchParams } from "next/navigation";

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
  const params = useSearchParams();

  // allow signing in to local server on specific port. Useful for development,
  // or for running local amcat without having to run a new client
  const [port] = useState(() => params?.get("port"));

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

  const host = port ? `http://localhost:${port}` : process.env.NEXT_PUBLIC_AMCAT_SERVER;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <MiddlecatProvider bff="/api/bffAuth" fixedResource={host}>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </MiddlecatProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
