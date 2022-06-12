import { useNavigate } from "react-router-dom";
import { Dropdown, Menu } from "semantic-ui-react";
import { useIndexList } from "../../lib/login";
import { link_index, useIndex } from "../../lib/navigation";
import { useAppSelector } from "../app/hooks";
import { selectAmcatUser } from "./LoginSlice";

export default function IndexMenu() {
  const user = useAppSelector(selectAmcatUser);
  const index = useIndex();
  const indices = useIndexList(user);
  const navigate = useNavigate();

  if (user == null) return null;
  return (
    <Dropdown item text={`⛃ ${index?.index || "(select index)"}`}>
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
                onClick={() =>
                  navigate(link_index({ index: index.name, ...user }))
                }
              >
                {index.name}
              </Menu.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
