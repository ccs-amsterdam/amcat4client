import { AggregatePane, Articles } from "amcat4react";
import { useState } from "react";
import { Menu } from "semantic-ui-react";
import { useAppSelector } from "../app/hooks";
import { selectIndex } from "../Menu/LoginSlice";
import Aggregation from "../Aggregate/AggregateResultOptions";
import { selectQuery } from "./QuerySlice";
import Summary from "./Summary";
import AggregateResultPanel from "../Aggregate/AggregateResultPanel";

export default function Results() {
  const index = useAppSelector(selectIndex);
  const query = useAppSelector(selectQuery);
  const items = ["Summary", "Articles", "Graph/Table"];
  const [selected, setSelected] = useState<string>(items[0]);
  if (index == null) return null;

  const get_content = (what: string) => {
    switch (what) {
      case "Summary":
        return <Summary />;
      case "Articles":
        return <Articles index={index} query={query} />;
      case "Graph/Table":
        return <AggregateResultPanel />;
    }
  };

  return (
    <>
      <Menu pointing secondary style={{ marginBottom: "1em" }}>
        {items.map((name, i) => (
          <Menu.Item
            key={i}
            active={index && selected === name}
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
