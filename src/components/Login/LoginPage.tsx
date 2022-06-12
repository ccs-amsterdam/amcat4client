import { AmcatUser, LoginForm } from "amcat4react";
import { Link, useNavigate } from "react-router-dom";
import { Header, List } from "semantic-ui-react";
import { getUsersFromHistory } from "../../lib/login";
import { link_host } from "../../lib/navigation";
import { useAppDispatch } from "../app/hooks";
import { setLogin } from "../Menu/LoginSlice";

export default function LoginPage() {
  const history = getUsersFromHistory();
  let navigate = useNavigate();
  const dispatch = useAppDispatch();

  const link = (host: string) =>
    `/x/${encodeURIComponent(host.replace(/^https:\/\//, ""))}`;
  const handleLogin = (u: AmcatUser) => {
    dispatch(setLogin(u));
    navigate(link_host(u.host));
  };
  return (
    <>
      <Header>Welcome to AmCAT</Header>
      <Header as="h3">Login to an AmCAT server:</Header>
      <LoginForm onLogin={handleLogin} />

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
