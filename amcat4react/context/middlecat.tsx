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

export const MiddlecatContext = createContext<ContextProps>({
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
    <MiddlecatContext.Provider value={{ user, loading, AuthForm, loginRoute }}>{children}</MiddlecatContext.Provider>
  );
}

export function useMiddlecatContext() {
  return useContext(MiddlecatContext);
}
