import React, { createContext, useContext, useEffect } from "react";
import useMiddlecat from "middlecat-react";
import { AmcatUser } from "../interfaces";

// Use middlecat as a context provider. Wrap the app root in MiddlecatWrapper
// and use useMiddlecatContext to get the user and AuthForm. Set the
// route at which the AuthForm is used in MiddlecatContext to redirect
// to this route if a user is not logged in. The use will be redirected
// back automatically once logged in.

interface ContextProps {
  user: AmcatUser | undefined;
  loading: boolean;
  AuthForm: any;
  loginRoute: string | null;
}

const MiddlecatContext = createContext<ContextProps>({
  user: undefined,
  loading: false,
  AuthForm: null,
  loginRoute: null,
});

interface Props {
  children: React.ReactNode;
  loginRoute: string;
  fixedResource?: string;
  autoReconnect?: boolean;
  storeToken?: boolean;
  bff?: string | undefined;
}

export function MiddlecatWrapper({
  children,
  loginRoute,
  fixedResource,
  autoReconnect = true,
  storeToken = false,
  bff = undefined,
}: Props) {
  const useMiddlecatProps = {
    fixedResource,
    autoReconnect,
    storeToken,
    bff,
  };

  const { user, loading, AuthForm } = useMiddlecat(useMiddlecatProps);

  return (
    <MiddlecatContext.Provider value={{ user, loading, AuthForm, loginRoute }}>
      {children}
    </MiddlecatContext.Provider>
  );
}

export function useMiddlecatContext(host?: string) {
  let { user, loading, AuthForm, loginRoute } = useContext(MiddlecatContext);

  useEffect(() => {
    if (loading) return;
    const url = new URL(window.location.href);

    if (user) {
      // if logged in, see if there is a login_redirect to go to
      const redirect = url.searchParams.get("login_redirect");
      if (redirect) window.location.href = redirect;
      return;
    }

    if (loginRoute != null && url.pathname !== loginRoute) {
      // if not logged in, and not yet on loginRoute, redirect
      window.location.href = `${loginRoute}?login_host=${host}&login_redirect=${encodeURIComponent(
        url.pathname
      )}`;
    }
  });

  // If opening a url with a specific host, and the host does
  // not match the host of the current middleCat session, kill
  // the session so that the user can log in with the correct host
  if (user && host) {
    if (user.resource !== host) {
      user.killSession(false);
      user = undefined;
    }
  }

  return { user, loading, AuthForm };
}
