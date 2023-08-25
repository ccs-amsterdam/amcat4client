import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useMiddlecat, AuthForm } from "middlecat-react";
import { link_host } from "../functions/links";

const StyleWrapper = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr;
  //grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  .AuthForm {
    padding-top: 2rem;
    font-size: 0.8rem;
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
  const { user } = useMiddlecat();

  if (user) {
    router.push(link_host(user.resource));
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
          <div className="AuthForm">
            {user ? null : (
              <AuthForm resourceSuggestion={"http://localhost:5000"} />
            )}
          </div>
        </StyleWrapper>
      </main>
    </>
  );
}
