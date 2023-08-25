import "../styles/globals.css";
import "fomantic-ui-css/semantic.min.css";

import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import TopMenu from "../components/Menu/TopMenu";
import { MiddlecatProvider } from "middlecat-react";
import { useRouter } from "next/router";
import { expandHostname } from "../functions/links";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const host = router.query.host
    ? expandHostname(router.query.host as string)
    : "";
  const [performCleanup, setPerformCleanup] = useState(false);

  if (performCleanup && router.isReady) {
    setPerformCleanup(false);
    delete router.query.code;
    delete router.query.state;
    router.push({ query: router.query }, undefined, { shallow: true });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MiddlecatProvider
        bff="/api/bffAuth"
        resourceRequired={!!host}
        fixedResource={host}
        cleanupParams={() => setPerformCleanup(true)}
      >
        <TopMenu />
        <div className="Container">
          <Component {...pageProps} />
        </div>
      </MiddlecatProvider>
    </QueryClientProvider>
  );
}
