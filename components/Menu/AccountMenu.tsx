import { useRouter } from "next/router";
import { Dropdown, Menu, Image } from "semantic-ui-react";
import { useMiddlecatContext } from "../../amcat4react";
import { useHasGlobalRole, useMyGlobalRole } from "../../amcat4react/hooks/useCurrentUserDetails";
import { titleCase } from "../../functions/lib";
import { link_host } from "../../functions/links";

interface IndexMenuProps {
  as_items?: boolean;
}

export default function AccountMenu({ as_items }: IndexMenuProps) {
  const router = useRouter();
  const { user } = useMiddlecatContext();
  const is_admin = useHasGlobalRole(user, "ADMIN");
  const my_role = useMyGlobalRole(user);

  if (user == null) return null;

  const menu_items = (
    <>
      {!is_admin ? null : (
        <Menu.Item href={`${link_host(user.resource)}/serversettings`}>Server settings & users</Menu.Item>
      )}
      <Menu.Item disabled>
        Signed in as <br />
        <b>{user.email || "guest"}</b> <br />
        Global role: {titleCase(my_role)}
      </Menu.Item>
      <Menu.Item onClick={() => router.push("/logout")}>Sign out</Menu.Item>
    </>
  );
  if (as_items) return menu_items;
  return (
    <>
      {user != null ? (
        <Dropdown
          item
          trigger={
            <Image
              alt={user.email}
              avatar
              src={user.image || "https://upload.wikimedia.org/wikipedia/commons/6/63/Man_Silhouette2.jpg"}
            />
          }
        >
          <Dropdown.Menu>{menu_items}</Dropdown.Menu>
        </Dropdown>
      ) : null}
    </>
  );
}
