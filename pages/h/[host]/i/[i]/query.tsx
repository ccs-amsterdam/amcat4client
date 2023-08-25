import { useRouter } from "next/router";
import { useState } from "react";
import { QueryForm, AmcatQuery } from "../../../../../amcat4react";
import Results from "../../../../../components/Query/Results";
import { useMiddlecat } from "middlecat-react";

export default function QueryPage() {
  const [query, setQuery] = useState<AmcatQuery>({});
  const { user } = useMiddlecat();
  const router = useRouter();
  const index = router.query.i as string;

  if (index === null || !user) return null;

  return (
    <>
      <QueryForm user={user} index={index} value={query} onSubmit={setQuery} />
      <Results user={user} index={index} query={query} setQuery={setQuery} />
    </>
  );
}
