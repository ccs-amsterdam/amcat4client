"use client";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MiddlecatProvider } from "middlecat-react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

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
  const [queryClient] = useState(() => new QueryClient({ mutationCache, queryCache }));

  return (
    <QueryClientProvider client={queryClient}>
      <MiddlecatProvider bff="/api/bffAuth">{children}</MiddlecatProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
