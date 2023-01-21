import {
  AmcatQuery,
  Articles,
  Amcat,
  AmcatIndexName,
  AmcatUser,
} from "../../amcat4react";
import { Dispatch, SetStateAction, useState } from "react";
import { Menu } from "semantic-ui-react";
import AggregateResultPanel from "../Aggregate/AggregateResultPanel";
import Summary from "./Summary";
import TagsPane from "./TagsPane";

export interface ResultsProps {
  user: AmcatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
  setQuery: Dispatch<SetStateAction<AmcatQuery>>;
}

export default function Results({
  user,
  index,
  query,
  setQuery,
}: ResultsProps) {
  let items = ["Summary", "Articles", "Graph/Table", "Tags"];
  const [selected, setSelected] = useState<string>(items[0]);

  const fields = Amcat.useFields(user, index);
  if (index == null) return null;
  if (
    fields != null &&
    fields.filter((f) => f.type === "geo_point").length > 0
  ) {
    items.push("Location");
  }

  const get_content = (what: string) => {
    switch (what) {
      case "Summary":
        return <Summary user={user} index={index} query={query} />;
      case "Articles":
        return <Articles user={user} index={index} query={query} />;
      case "Graph/Table":
        return <AggregateResultPanel user={user} index={index} query={query} />;
      case "Tags":
        return (
          <TagsPane
            user={user}
            index={index}
            query={query}
            setQuery={setQuery}
          />
        );
    }
  };

  return (
    <>
      <Menu pointing secondary style={{ marginBottom: "1em" }}>
        {items.map((name, i) => (
          <Menu.Item
            key={i}
            active={index != null && selected === name}
            disabled={!index}
            onClick={() => setSelected(name)}
          >
            {name}
          </Menu.Item>
        ))}
      </Menu>
      {get_content(selected)}
    </>
  );
}
