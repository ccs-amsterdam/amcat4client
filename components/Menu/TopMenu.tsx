import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Dropdown, Menu } from "semantic-ui-react";

import styled from "styled-components";
import { useMiddlecat } from "middlecat-react";
import { expandHostname, link_index } from "../../functions/links";

import { useHasIndexRole } from "../../amcat4react/hooks/useIndexDetails";
import AccountMenu from "./AccountMenu";
import IndexMenu from "./IndexMenu";

const StyledMenu = styled(Menu)`
  border-radius: 0 !important;
  box-shadow: 4px 0px 5px black !important;

  .item {
    color: white !important;
  }
`;

export default function TopMenu() {
  const { user } = useMiddlecat();
  const router = useRouter();
  const host = router.query.host;
  const index = router.query.i as string;
  const isAdmin = useHasIndexRole(index, "ADMIN");
  const isSmallDevice = useBetterMediaQuery("(max-width: 1024px)");

  if (user && host) {
    const requested_host = expandHostname(host as string);
    if (user.resource !== requested_host) {
      user.killSession(true);
    }
  }
  let index_menu = null;
  if (user != null && index != null) {
    const index_href = link_index(user.resource, index);
    index_menu = (
      <>
        <Menu.Item
          href={`${index_href}/query`}
          active={router.pathname === "/h/[host]/i/[i]/query"}
          content="Query"
          icon="search"
          as={Link}
        />
        <Menu.Item
          href={`${index_href}/fields`}
          icon="columns"
          as={Link}
          content="Fields"
          active={router.pathname === "/h/[host]/i/[i]/fields"}
        />
        {!isAdmin ? null : (
          <>
            <Menu.Item
              icon="settings"
              content="Settings"
              href={`${index_href}/settings`}
              as={Link}
              active={router.pathname === "/h/[host]/i/[i]/settings"}
            />
            <Menu.Item
              icon="users"
              content="Users"
              href={`${index_href}/users`}
              as={Link}
              active={router.pathname === "/h/[host]/i/[i]/users"}
            />
          </>
        )}
      </>
    );
  }

  if (isSmallDevice)
    return (
      <StyledMenu inverted>
        {index_menu == null ? null : (
          <Menu.Menu position="left">
            <Dropdown item text="Index Menu">
              <Dropdown.Menu>{index_menu}</Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        )}
        <Menu.Menu position="right">
          <Dropdown item text="Account Menu">
            <Dropdown.Menu>
              <AccountMenu as_items />
              <Dropdown.Divider />
              <IndexMenu as_items />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </StyledMenu>
    );
  return (
    <StyledMenu inverted>
      <Menu.Menu position="left">{index_menu}</Menu.Menu>
      <Menu.Menu position="right">
        <IndexMenu />
        <AccountMenu />
      </Menu.Menu>
    </StyledMenu>
  );
}

// From https://github.com/chakra-ui/chakra-ui/issues/3580#issuecomment-1374622623
function useBetterMediaQuery(mediaQueryString: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQueryString);
    const listener = () => setMatches(!!mediaQueryList.matches);
    listener();
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [mediaQueryString]);

  return matches;
}
