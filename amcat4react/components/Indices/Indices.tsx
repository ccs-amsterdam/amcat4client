import { Card } from "semantic-ui-react";
import { AmcatUser, Response, useAmcatIndices } from "../../../amcat4react";
import { useHasGlobalRole } from "../../hooks/useCurrentUserDetails";
import { useServerConfig } from "../../hooks/useServerConfig";
import CreateIndex from "./CreateIndex";

interface Props {
  user: AmcatUser | undefined;
  onSelect: (index: string) => void;
}

export default function Indices({ user, onSelect }: Props) {
  const indices = useAmcatIndices(user);
  const is_writer = useHasGlobalRole(user, "WRITER");
  if (indices.isLoading) return <Response.LoadingScreen />;
  if (indices.isError) return <Response.ErrorScreen />;

  if (user == null || indices.data == null) return null;
  return (
    <>
      {!is_writer ? null : <CreateIndex user={user} onCreate={() => indices.refetch()} />}
      <h2>{indices.data.length > 0 ? "Select index" : "No indices available"}</h2>

      <Card.Group>
        {indices.data.map((i) => (
          <Card key={i.id} onClick={() => onSelect(i.id)}>
            <Card.Content>
              <Card.Header>{i.name || i.id}</Card.Header>
              <Card.Description>{i.description}</Card.Description>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </>
  );
}
