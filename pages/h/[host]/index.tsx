import { useRouter } from "next/router";
import { Indices, useAmcatIndices } from "../../../amcat4react";
import { useMiddlecat } from "middlecat-react";

import CreateIndex from "../../../amcat4react/components/Indices/CreateIndex";
import { useHasGlobalRole, useMyGlobalRole } from "../../../amcat4react/hooks/useCurrentUserDetails";
import { link_query } from "../../../functions/links";
import { useServerConfig } from "../../../amcat4react/hooks/useServerConfig";
import { Loader, Message } from "semantic-ui-react";

export default function IndexSelection() {
  const router = useRouter();
  const { user } = useMiddlecat();
  const indices = useAmcatIndices();
  const is_writer = useHasGlobalRole(user, "WRITER");
  const my_role = useMyGlobalRole(user);
  const config = useServerConfig(user);

  function onSelectIndex(index: string) {
    if (!user) return;
    router.push(link_query(user.resource, index));
  }
  if (!user) return;
  if (my_role == null && config.data?.authorization === "authorized_users_only")
    return <Message error header="Access Denied" content="This server can only be accessed by authorized users" />;

  if (indices.isLoading) return <Loader content="Loading server indexes" />;
  if (indices.error) return <h1>Error on fetching indices: {`${indices.error}`}</h1>;
  if (!user || !indices.data) return;
  console.log(user);

  return (
    <>
      <div>{!is_writer ? null : <CreateIndex user={user} onCreate={() => indices.refetch()} />}</div>
      <h2>{indices.data.length > 0 ? "Select index" : "No indices available"}</h2>
      <Indices user={user} onSelect={onSelectIndex} />
    </>
  );
}
