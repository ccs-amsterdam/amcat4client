import { useRouter } from "next/router";
import { Menu } from "semantic-ui-react";
import styled from "styled-components";
import { link_index } from "../../functions/links";
import useUser from "../../hooks/useUser";

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
  const user = useUser();
  const router = useRouter();
  const index = router.query.i as string;

  return (
    <StyledMenu inverted>
      <Menu.Menu position="left">
        {user == null || index == null ? null : (
          <>
            <Menu.Item
              onClick={() =>
                router.push(`${link_index(user.resource, index)}/query`)
              }
              content="Query"
              icon="search"
            />
            <Menu.Item icon="tags" content="Tags" />
            <Menu.Item
              icon="columns"
              content="Fields"
              onClick={() =>
                router.push(`${link_index(user.resource, index)}/fields`)
              }
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
