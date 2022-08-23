import { AmcatUser, LoginForm } from "amcat4react";
import { refreshToken } from "amcat4react/dist/Amcat";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { Container, Header } from "semantic-ui-react";
import { getUserFromHistory } from "../../lib/login";
import { useIndex } from "../../lib/navigation";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectAmcatUser, setLogin } from "../Menu/LoginSlice";
import TopMenu from "../Menu/TopMenu";
import { tryLogin } from "./AmcatPage";
import IndexChoice from "./IndexChoice";
import LoginPage from "./LoginPage";

export default function AmcatPageFixedHost() {
  const user = useAppSelector(selectAmcatUser);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const index = useIndex();

  //TODO: This is now copypasta from AmcatPage, should refactor!

  const host = process.env.REACT_APP_FIXED_HOST;

  const handleLogin = (u: AmcatUser) => dispatch(setLogin(u));
  useEffect(tryLogin(loading, host, user, dispatch, setLoading), [
    host,
    user,
    dispatch,
    loading,
  ]);
  if (host == null) return null;
  let content;
  if (loading) {
    content = <div>Logging in...</div>;
  } else if (user == null)
    content = (
      <Container>
        <Header>Log on to {host}</Header>
        <LoginForm fix_host={host} onLogin={handleLogin} />
      </Container>
    );
  else if (index == null) {
    content = <IndexChoice />;
  } else content = <Outlet />;
  return (
    <>
      <TopMenu />
      <Container style={{ paddingTop: "55px" }}>{content}</Container>
    </>
  );
}
