import { Dropdown, Menu } from "semantic-ui-react";
import { useIndex } from "../../lib/navigation";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useIndexList } from "./AccountMenu";
import { selectAmcatUser, setIndexName } from "./LoginSlice";

export default function IndexMenu() {
  const user = useAppSelector(selectAmcatUser);
  const index = useIndex();
  const indices = useIndexList(user);
  const dispatch = useAppDispatch();

  if (user == null) return null;
  return (
    <Dropdown item text={index?.index}>
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
