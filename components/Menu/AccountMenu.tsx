import { useRouter } from "next/router";
import { Dropdown, Menu, Image } from "semantic-ui-react";
import { useMiddlecatContext } from "../../amcat4react";
import { useHasGlobalRole, useMyGlobalRole } from "../../amcat4react/hooks/useCurrentUserDetails";
import { titleCase } from "../../functions/lib";
import { link_host } from "../../functions/links";

export default function AccountMenu() {
  const router = useRouter();
  const { user } = useMiddlecatContext();
  const is_admin = useHasGlobalRole(user, "ADMIN");
  const my_role = useMyGlobalRole(user);

  return (
    <>
      {user != null ? (
        <Dropdown
          item
          trigger={
            <Image
              avatar
              src={user.image || "https://upload.wikimedia.org/wikipedia/commons/6/63/Man_Silhouette2.jpg"}
            />
          }
        >
          <Dropdown.Menu>
            {!is_admin ? null : (
              <Menu.Item href={`${link_host(user.resource)}/serversettings`}>Server settings & users</Menu.Item>
            )}
            <Menu.Item disabled>
              Signed in as <br />
              <b>{user.email || "guest"}</b> <br />
              Global role: {titleCase(my_role)}
            </Menu.Item>
            <Menu.Item onClick={() => router.push("/logout")}>Sign out</Menu.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : null}
    </>
  );
}
