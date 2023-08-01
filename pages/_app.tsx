import "../styles/globals.css";
import "fomantic-ui-css/semantic.min.css";

import type { AppProps } from "next/app";
import { MiddlecatWrapper } from "../amcat4react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import TopMenu from "../components/Menu/TopMenu";
import { MiddlecatProvider } from "middlecat-react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MiddlecatProvider bff="/api/bffAuth">
        <TopMenu />
        <div className="Container">
          <Component {...pageProps} />
        </div>
      </MiddlecatProvider>
    </QueryClientProvider>
  );
}
