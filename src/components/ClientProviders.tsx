"use client";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MiddlecatProvider } from "middlecat-react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { ThemeProvider } from "next-themes";

const defaultOptions = {
  queries: {
    retry: (failureCount: number, e: Error) => {
      if (failureCount >= 2) return false;
      // const unauthorized = e.response?.status == 401;
      // const forbidden = e.response?.status == 403;
      const zodError = e.name === "ZodError";
      const doRetry = !zodError;
      return doRetry;
    },
  },
};

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const mutationCache = new MutationCache({
    onError: (e) => {
      console.error(e);
    },
  });
  const queryCache = new QueryCache({
    onError: (e) => {
      console.error(e);
    },
  });
  const [queryClient] = useState(() => new QueryClient({ mutationCache, queryCache, defaultOptions }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <MiddlecatProvider bff="/api/bffAuth" fixedResource={process.env.NEXT_PUBLIC_AMCAT_SERVER}>
          {children}
        </MiddlecatProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
