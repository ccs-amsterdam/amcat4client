import { useNavigate } from "react-router-dom";
import { Dropdown, Menu } from "semantic-ui-react";
import { getUsersFromHistory } from "../../lib/login";
import { link_host } from "../../lib/navigation";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectAmcatUser } from "./LoginSlice";

export default function AccountMenu() {
  const user = useAppSelector(selectAmcatUser);
  console.log(user);
  const history = getUsersFromHistory();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {user != null ? (
        <Dropdown item text={`👤 ${user.email}@${new URL(user.host).hostname}`}>
          <Dropdown.Menu>
            <Menu.Item disabled>
              Signed in as <br />
              <b>{user.email}</b>
            </Menu.Item>
            <Menu.Item onClick={handleLogout}>Sign out</Menu.Item>
            {history.length === 0 ? null : (
              <>
                <Dropdown.Divider />
                {history.map((ix, i) => (
                  <Menu.Item
                    key={i}
                    onClick={() => navigate(link_host(ix.host))}
                  >
                    {ix.email}@{ix.host.replace(/https?:\/\//, "")}
                  </Menu.Item>
                ))}
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Menu.Item onClick={() => navigate("/")}>Sign in</Menu.Item>
      )}
    </>
  );
}
