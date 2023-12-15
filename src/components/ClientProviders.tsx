"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MiddlecatProvider } from "middlecat-react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MiddlecatProvider bff="/api/bffAuth">{children}</MiddlecatProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
