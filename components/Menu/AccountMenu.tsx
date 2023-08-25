import { useRouter } from "next/router";
import { Dropdown, DropdownDivider, Image } from "semantic-ui-react";
import { useMiddlecat } from "middlecat-react";
import {
  useHasGlobalRole,
  useMyGlobalRole,
} from "../../amcat4react/hooks/useCurrentUserDetails";
import { titleCase } from "../../functions/lib";
import { expandHostname, link_host } from "../../functions/links";
import { Loading } from "../../amcat4react/styled/Style";
import { useEffect } from "react";

interface IndexMenuProps {
  as_items?: boolean;
}

export default function AccountMenu({ as_items }: IndexMenuProps) {
  const router = useRouter();
  const { user, signIn, signOut, loading } = useMiddlecat();
  const is_admin = useHasGlobalRole(user, "ADMIN");
  const my_role = useMyGlobalRole(user);

  const profileImage = (
    <Image
      alt={user?.email || ""}
      avatar
      style={{ fontSize: "1rem", border: "1px solid var(--color)" }}
      src={
        user?.image ||
        "https://upload.wikimedia.org/wikipedia/commons/6/63/Man_Silhouette2.jpg"
      }
    />
  );

  function settings() {
    if (!is_admin) return null;
    if (!user?.resource) return null;
    return (
      <Dropdown.Item href={`${link_host(user?.resource)}/serversettings`}>
        Server settings & users
      </Dropdown.Item>
    );
  }

  function userOrSignin(image?: boolean) {
    if (user?.authenticated)
      return (
        <>
          <Dropdown.Header>
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                {user?.name}
              </div>
              <div style={{ width: "2rem", paddingBottom: "0.5rem" }}>
                {image && profileImage}
              </div>
            </div>
            {my_role ? <div>Global role: {titleCase(my_role)}</div> : null}
          </Dropdown.Header>
          <DropdownDivider />
        </>
      );

    return (
      <Dropdown.Item onClick={() => user?.resource && signIn(user?.resource)}>
        Sign in
      </Dropdown.Item>
    );
  }

  function signout() {
    return (
      <Dropdown.Item
        onClick={() => signOut(false).then(() => router.push("/logout"))}
      >
        Sign out
      </Dropdown.Item>
    );
  }

  if (as_items)
    return (
      <>
        {userOrSignin(true)}
        {settings()}
        {signout()}
      </>
    );

  return (
    <>
      {user != null ? (
        <Dropdown item trigger={profileImage}>
          <Dropdown.Menu
            style={{
              width: "max-content",
              minWidth: "10rem",
              maxWidth: "90vw",
            }}
          >
            {userOrSignin()}
            {settings()}
            {signout()}
          </Dropdown.Menu>
        </Dropdown>
      ) : null}
    </>
  );
}
