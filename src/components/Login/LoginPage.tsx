import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Header, Input, List } from "semantic-ui-react";
import { getUsersFromHistory } from "../../lib/login";

export default function LoginPage() {
  const [hostname, setHostname] = useState("");
  const history = getUsersFromHistory();
  let navigate = useNavigate();

  const link = (host: string) =>
    `/x/${encodeURIComponent(host.replace(/^https:\/\//, ""))}`;

  return (
    <>
      <Header>Welcome to AmCAT</Header>
      <Header as="h3">Login to an AmCAT server:</Header>
      <Form onSubmit={() => navigate(link(hostname))}>
        <Input
          value={hostname}
          onChange={(e) => setHostname(e.target.value)}
          placeholder="https://server.example.com"
        ></Input>
      </Form>
      {history.length === 0 ? null : (
        <>
          <Header as="h3">Recent logins:</Header>
          <List divided relaxed>
            {history.map((u) => {
              return (
                <List.Item key={u.host}>
                  <List.Header>
                    <Link to={link(u.host)}>
                      {u.host.replace(/^https:\/\//, "")}
                    </Link>
                  </List.Header>
                  <List.Description>
                    Last logged in as {u.email}{" "}
                    {u.last_used && `at ${u.last_used}`}
                  </List.Description>
                </List.Item>
              );
            })}
          </List>
        </>
      )}
    </>
  );
}
