import { useRouter } from "next/router";
import { useEffect } from "react";
import { Menu } from "semantic-ui-react";
import Link from "next/link";

import styled from "styled-components";
import { useMiddlecatContext } from "../../amcat4react";
import { encodeHostname, link_index } from "../../functions/links";

import AccountMenu from "./AccountMenu";
import IndexMenu from "./IndexMenu";
import { useHasGlobalRole } from "../../amcat4react/hooks/useCurrentUserDetails";
import { useHasIndexRole } from "../../amcat4react/hooks/useIndexDetails";

const StyledMenu = styled(Menu)`
  border-radius: 0 !important;
  box-shadow: 4px 0px 5px black !important;

  .item {
    color: white !important;
  }
`;

export default function TopMenu() {
  const { loading, user, loginRoute } = useMiddlecatContext();
  const router = useRouter();
  const host = router.query.host;
  const index = router.query.i as string;
  const isAdmin = useHasIndexRole(index, "ADMIN");

  // Check if we need to login or logout
  useEffect(() => {
    if (loading || !host) return;

    const url = new URL(window.location.href);
    if (user) {
      // if logged in, see if there is a login_redirect to go to
      const redirect = url.searchParams.get("login_redirect");
      if (redirect) window.location.href = redirect;
      return;
    }

    if (loginRoute != null && url.pathname !== loginRoute) {
      // if not logged in, and not yet on loginRoute, redirect
      window.location.href = `${loginRoute}?login_host=${host}&login_redirect=${encodeURIComponent(url.pathname)}`;
    }
  });

  // If opening a url with a specific host, and the host does
  // not match the host of the current middleCat session, kill
  // the session so that the user can log in with the correct host
  if (user && host) {
    const resource = encodeHostname(user.resource);
    if (resource !== host) {
      user.killSession(true);
    }
  }
  const index_href = user && link_index(user.resource, index);
  return (
    <StyledMenu inverted>
      <Menu.Menu position="left">
        {user == null || index == null ? null : (
          <>
            <Menu.Item
              href={`${index_href}/query`}
              active={router.pathname === "/h/[host]/i/[i]/query"}
              content="Query"
              icon="search"
              as={Link}
            />
            {!isAdmin ? null : (
              <Menu.Item
                icon="settings"
                content="Settings"
                href={`${index_href}/settings`}
                as={Link}
                active={router.pathname === "/h/[host]/i/[i]/settings"}
              />
            )}
            {!isAdmin ? null : (
              <Menu.Item
                icon="users"
                content="Users"
                href={`${index_href}/users`}
                as={Link}
                active={router.pathname === "/h/[host]/i/[i]/users"}
              />
            )}
            <Menu.Item
              href={`${index_href}/fields`}
              icon="columns"
              as={Link}
              content="Fields"
              active={router.pathname === "/h/[host]/i/[i]/fields"}
            />
          </>
        )}
      </Menu.Menu>
      <Menu.Menu position="right">
        <IndexMenu />
        <AccountMenu />
      </Menu.Menu>
    </StyledMenu>
  );
}
