import Link from "next/link";
import { useRouter } from "next/router";
import { Dropdown, Menu } from "semantic-ui-react";
import { AmcatIndex, useAmcatIndices, useMiddlecatContext } from "../../amcat4react";
import { link_host, link_query } from "../../functions/links";

function getIndexName(id: string, indices: AmcatIndex[]) {
  const index = indices.find((ix) => ix.id === id);
  return index == null ? id : index.name;
}

export default function IndexMenu({}) {
  const { user } = useMiddlecatContext();
  const router = useRouter();
  const index = router.query.i as string;
  const indices = useAmcatIndices();
  const indexName = indices.data == null ? index : getIndexName(index, indices.data);
  if (user == null) return null;
  return (
    <Dropdown item text={`⛃ ${indexName || "(select index)"}`}>
      <Dropdown.Menu>
        <Menu.Item as={Link} href={link_host(user.resource)} content="Index overview" />
        <Dropdown.Divider />
        {indices.data == null
          ? null
          : indices.data.map((index) => (
              <Menu.Item key={index.id} as={Link} href={link_query(user.resource, index.id)} content={index.name} />
            ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
