import Link from "next/link";
import { useRouter } from "next/router";
import { Dropdown, Menu } from "semantic-ui-react";
import { AmcatIndex, useMiddlecatContext } from "../../amcat4react";
import useIndices from "../../amcat4react/hooks/useAmcatIndices";
import { link_host, link_index, link_query } from "../../functions/links";

function getIndexName(id: string, indices: AmcatIndex[]) {
  const index = indices.find((ix) => ix.id === id);
  return index == null ? id : index.name;
}

export default function IndexMenu({}) {
  const { user } = useMiddlecatContext();
  const router = useRouter();
  const index = router.query.i as string;
  const indices = useIndices(user);
  const indexName = indices.data == null ? index : getIndexName(index, indices.data);

  if (user == null) return null;
  return (
    <Dropdown item text={`⛃ ${indexName || "(select index)"}`}>
      <Dropdown.Menu>
        <Menu.Item>
          <Link style={{ color: "var(--secondary)" }} href={link_host(user.resource)}>
            Index overview
          </Link>
        </Menu.Item>
        <Dropdown.Divider />
        {indices.data == null
          ? null
          : indices.data.map((index, i) => (
              <Menu.Item key={i}>
                <Link style={{ color: "var(--secondary)" }} href={link_query(user.resource, index?.id)}>
                  {index.name}
                </Link>
              </Menu.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
