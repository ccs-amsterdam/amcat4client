import { useRouter } from "next/router";
import { Indices, useAmcatIndices, useMiddlecatContext } from "../../../amcat4react";
import CreateIndex from "../../../amcat4react/components/Indices/CreateIndex";
import { useHasGlobalRole } from "../../../amcat4react/hooks/useCurrentUserDetails";
import { link_query } from "../../../functions/links";
import useUser from "../../../hooks/useUser";

export default function IndexSelection() {
  const router = useRouter();
  const user = useUser();
  const is_writer = useHasGlobalRole(user, "WRITER");
  const indices = useAmcatIndices(user);

  function onSelectIndex(index: string) {
    if (!user) return;
    router.push(link_query(user.resource, index));
  }
  if (!user || !indices.data) return;
  return (
    <>
      {!is_writer ? null : <CreateIndex user={user} onCreate={() => indices.refetch()} />}
      <h2>{indices.data.length > 0 ? "Select index" : "No indices available"}</h2>

      <Indices user={user} onSelect={onSelectIndex} />
    </>
  );
}
