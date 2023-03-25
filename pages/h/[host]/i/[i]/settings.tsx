import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { Form } from "semantic-ui-react";
import { AmcatIndex, useMiddlecatContext } from "../../../../../amcat4react";
import { getIndex } from "../../../../../amcat4react/Amcat";

export default function Settings() {
  const { user } = useMiddlecatContext();
  const router = useRouter();
  const id = router.query.i as string;
  const [index, setIndex] = useState<AmcatIndex | void>(undefined);

  const indexresults = useQuery(["index", id], async () => user && (await getIndex(user, id)).data, {
    enabled: user != null && id != null,
    staleTime: 600000,
  });
  console.log(indexresults);
  if (indexresults.isSuccess) setIndex(indexresults.data);
  if (!user || !index) return null;

  return (
    <Form>
      <Form.Group>
        <Form.Input
          label="Index name"
          value={index.name}
          onChange={(_, { value }) => setIndex({ ...index, name: value })}
        />
        <Form.TextArea
          label="Index description"
          value={index.description}
          onChange={(_, { value }) => setIndex({ ...index, description: value as string })}
        />
      </Form.Group>
    </Form>
  );
}
