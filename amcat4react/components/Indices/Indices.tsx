import { Card } from "semantic-ui-react";
import { AmcatUser, Response, useAmcatIndices } from "../../../amcat4react";

interface Props {
  user: AmcatUser | undefined;
  onSelect: (index: string) => void;
}

export default function Indices({ onSelect }: Props) {
  const indices = useAmcatIndices();
  if (indices.isLoading) return <Response.LoadingScreen />;
  if (indices.isError) return <Response.ErrorScreen />;

  if (indices.data == null) return null;
  return (
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
  );
}
