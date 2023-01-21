import Link from "next/link";
import { useRouter } from "next/router";
import { Dropdown, Menu } from "semantic-ui-react";
import useIndices from "../../amcat4react/hooks/useAmcatIndices";
import { link_index } from "../../functions/links";
import useUser from "../../hooks/useUser";

export default function IndexMenu({}) {
  const user = useUser();
  const router = useRouter();
  const index = router.query.i as string;
  const indices = useIndices(user);

  if (user == null) return null;
  return (
    <Dropdown item text={`⛃ ${index || "(select index)"}`}>
      <Dropdown.Menu>
        <Menu.Item disabled>
          {index == null ? (
            <>No index selected</>
          ) : (
            <>
              Current index: <br />
              <b>{index}</b>
            </>
          )}
        </Menu.Item>
        <Dropdown.Divider />
        {indices.data == null
          ? null
          : indices.data.map((index, i) => (
              <Menu.Item key={i}>
                <Link
                  style={{ color: "var(--secondary)" }}
                  href={`${link_index(user.resource, index?.name)}/query`}
                >
                  {index.name}
                </Link>
              </Menu.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
