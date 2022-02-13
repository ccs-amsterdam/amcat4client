import { Dropdown, Menu } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAmcatUser, selectIndex, setIndexName } from "./LoginSlice";
import { useIndexList } from "./AccountMenu";

export default function IndexMenu() {
  const user = useAppSelector(selectAmcatUser);
  const index = useAppSelector(selectIndex);
  const indices = useIndexList(user);
  const dispatch = useAppDispatch();

  if (user == null) return null;
  return (
    <Dropdown item text="Index">
      <Dropdown.Menu>
        <Menu.Item disabled>
          {index == null ? (
            <>No index selected</>
          ) : (
            <>
              Current index: <br />
              <b>{index.index}</b>
            </>
          )}
        </Menu.Item>
        <Dropdown.Divider />
        {indices == null
          ? null
          : indices.map((index, i) => (
              <Menu.Item
                key={i}
                onClick={() => dispatch(setIndexName(index.name))}
              >
                {index.name}
              </Menu.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
