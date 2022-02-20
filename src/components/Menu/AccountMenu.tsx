import { Menu, Dropdown, Modal } from "semantic-ui-react";
import { Amcat, AmcatIndex, AmcatUser, LoginForm } from "amcat4react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  logout,
  selectAmcatUser,
  selectIndex,
  setIndex,
  setLogin,
} from "./LoginSlice";
import { addIndexToHistory, selectIndexHistory } from "./RecentIndicesSlice";

export default function AccountMenu() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);

  const user = useAppSelector(selectAmcatUser);
  const index = useAppSelector(selectIndex);
  const history = useAppSelector(selectIndexHistory);

  const dispatch = useAppDispatch();

  const handleLogin = (user: AmcatUser) => {
    setLoginOpen(false);
    setIndexOpen(true);
    dispatch(setLogin(user));
  };

  const handleSelectIndex = (index: AmcatIndex) => {
    setIndexOpen(false);
    dispatch(setIndex(index));
    dispatch(addIndexToHistory(index));
  };

  useEffect(() => {
    // On starting the app, try to refresh the token and update or log out as needed
    // WvA Is this the best way of doing this? i.e. with a []-dependent useEffect?
    if (user?.host && user?.email && user?.token) {
      Amcat.refreshToken(user)
        .then((d) => {
          if (index?.index)
            dispatch(setIndex({ ...index, token: d.data.token }));
          else dispatch(setLogin({ ...user, token: d.data.token }));
        })
        .catch((e) => {
          console.error("Error on refreshing token, logging out");
          dispatch(logout());
        });
    }
  }, []);

  return (
    <>
      {user != null ? (
        <Dropdown item text="Account">
          <Dropdown.Menu>
            <Menu.Item disabled>
              Signed in as <br />
              <b>{user.email}</b>
            </Menu.Item>
            <Menu.Item onClick={() => dispatch(logout())}>Sign out</Menu.Item>
            {history.length == 0 ? null : (
              <>
                <Dropdown.Divider />
                {history.map((ix, i) => (
                  <Menu.Item key={i}>
                    {ix.index} ({ix.email}@{ix.host.replace(/https?:\/\//, "")})
                  </Menu.Item>
                ))}
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Menu.Item onClick={() => setLoginOpen(true)}>Sign in</Menu.Item>
      )}
      <Modal open={loginOpen} onClose={() => setLoginOpen(false)}>
        <Modal.Content>
          <LoginForm value={user} onLogin={handleLogin} />
        </Modal.Content>
      </Modal>
      {user != null ? (
        <Modal open={indexOpen} onClose={() => setIndexOpen(false)}>
          <Modal.Content>
            <IndexPicker
              value={index}
              user={user}
              onChange={handleSelectIndex}
            />
          </Modal.Content>
        </Modal>
      ) : null}
    </>
  );
}

interface IndexPickerProps {
  user: AmcatUser;
  value?: AmcatIndex;
  onChange: (index: AmcatIndex) => void;
}

interface Index {
  name: string;
  role: string;
}
export function useIndexList(user?: AmcatUser): Index[] | undefined {
  const [indices, setIndices] = useState<Index[]>();
  useEffect(() => {
    if (user == null) return;
    Amcat.getIndices(user)
      .then((data) => setIndices(data.data))
      .catch((error) => {
        console.error(error);
        setIndices(undefined);
      });
  }, [user, setIndices]);
  return indices;
}

function IndexPicker({ user, value, onChange }: IndexPickerProps) {
  const indices = useIndexList(user);
  if (indices == null || indices.length == 0) return null;
  const options = indices.map((ix, i) => ({
    key: ix.name,
    value: ix.name,
    text: ix.name,
    description: ix.role,
    selected: ix.name === value?.index,
  }));
  return (
    <>
      <Dropdown
        placeholder="select index"
        fluid
        search
        selection
        value={value?.index}
        options={options}
        onChange={(e, d) => onChange({ ...user, index: d.value as string })}
      />
    </>
  );
}
