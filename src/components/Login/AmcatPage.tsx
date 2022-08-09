import { AmcatUser, LoginForm } from "amcat4react";
import { refreshToken } from "amcat4react/dist/Amcat";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { Container, Header } from "semantic-ui-react";
import { getUserFromHistory } from "../../lib/login";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectAmcatUser, setLogin } from "../Menu/LoginSlice";
import TopMenu from "../Menu/TopMenu";
import LoginPage from "./LoginPage";

export default function AmcatPage() {
  const user = useAppSelector(selectAmcatUser);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  /* If the location has changed, check if we can log the user in,
     otherwise reset user and open login screen for this location. 
     If no location is given, show selection of recent locations */

  const host =
    params.host == null
      ? undefined
      : /^https?:\/\//.test(params.host)
      ? params.host
      : "https://" + params.host;

  useEffect(() => {
    if (loading) return;
    if (host == null) {
      console.log("logging out");
      if (user != null) dispatch(logout);
    } else if (user?.host !== host) {
      const u = getUserFromHistory(host);
      if (u == null) {
        setLoading(false);
      } else {
        console.debug(
          `Found existing token ${u.email}@${u.host}, refreshing...`
        );
        // We had an existing token, let's refresh it to ensure it is valid
        refreshToken(u)
          .then((r) => {
            console.debug(`Token was valid, storing in local storage`);
            setLoading(false);
            dispatch(
              setLogin({
                host: u.host,
                email: u.email,
                token: r.data.access_token,
              })
            );
          })
          .catch((e) => {
            console.warn(
              `Error on refreshing token for ${u.token}@${u.host}: ${e}`
            );
            setLoading(false);
            dispatch(logout);
          });
      }
    }
  }, [host, user, dispatch, loading]);

  const handleLogin = (u: AmcatUser) => dispatch(setLogin(u));

  let content;
  if (host == null) {
    content = <LoginPage />;
  } else if (loading) {
    content = <div>Logging in...</div>;
  } else if (user == null)
    content = (
      <Container>
        <Header>Log on to {host}</Header>
        <LoginForm fix_host={host} onLogin={handleLogin} />
      </Container>
    );
  else content = <Outlet />;
  return (
    <>
      <TopMenu />
      <Container style={{ paddingTop: "55px" }}>{content}</Container>
    </>
  );
}
