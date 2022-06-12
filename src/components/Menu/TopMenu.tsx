import { useNavigate } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { link_index, useIndex } from "../../lib/navigation";

import AccountMenu from "./AccountMenu";
import IndexMenu from "./IndexMenu";

export default function TopMenu() {
  const navigate = useNavigate();
  const index = useIndex();
  return (
    <Menu inverted fixed="top">
      <Menu.Menu position="left">
        {index == null ? null : (
          <>
            <Menu.Item
              onClick={() => navigate(link_index(index))}
              content="Query"
              icon="search"
            />
            <Menu.Item icon="tags" content="Tags" />
            <Menu.Item
              icon="columns"
              content="Fields"
              onClick={() => navigate(`${link_index(index)}/fields`)}
            />
          </>
        )}
      </Menu.Menu>
      <Menu.Menu position="right">
        <IndexMenu />
        <AccountMenu />
      </Menu.Menu>
    </Menu>
  );
}
