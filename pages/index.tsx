import Head from "next/head";
import { useMiddlecatContext, Indices } from "../amcat4react";
import { useRouter } from "next/router";
import styled from "styled-components";

const StyleWrapper = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr;
  //grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  .AuthForm {
    padding-top: 2rem;
    font-size: 0.8rem;
  }
  .Indices {
  }
  .LoginRedirect {
    margin: auto;

    span {
      font-weight: bold;
    }
  }
`;

export default function Home() {
  const router = useRouter();
  const login_host = router.query.login_host as string;
  const login_redirect = router.query.login_redirect as string;

  const { user, AuthForm } = useMiddlecatContext();

  function onSelectIndex(index: string) {
    if (!user) return;
    router.push(`/h/${encodeURIComponent(user.resource)}/i/${index}/query`);
  }

  if (user && login_redirect) {
    router.push(login_redirect);
    return null;
  }

  return (
    <>
      <Head>
        <title>AmCAT 4 client</title>
        <meta name="description" content="AmCAT 4 client" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/amcat-logo.svg" />
      </Head>
      <main>
        <StyleWrapper>
          <div className="LoginRedirect">
            {login_redirect ? (
              <p>
                To open <span>{decodeURIComponent(login_redirect)}</span> you
                first need to login to <span>{login_host}</span>
              </p>
            ) : null}
          </div>
          <div className="AuthForm">
            <AuthForm
              resourceFixed={login_host || undefined}
              resourceSuggestion={
                login_host ? undefined : "http://localhost:5000"
              }
            />
          </div>
          <div className="Indices">
            <Indices user={user} onSelect={onSelectIndex} />
          </div>
        </StyleWrapper>
      </main>
    </>
  );
}
