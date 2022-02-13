import { Menu } from "semantic-ui-react";

import AccountMenu from "./AccountMenu";
import IndexMenu from "./IndexMenu";

export default function TopMenu() {
  return (
    <Menu inverted fixed="top">
      <Menu.Menu position="right">
        <IndexMenu />
        <AccountMenu />
      </Menu.Menu>
    </Menu>
  );
}
