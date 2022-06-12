import { ArticleModal, Articles, LocationPane } from "amcat4react";
import { ArticlesProps } from "amcat4react/dist/Articles/Articles";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { link_doc, useIndex } from "../../lib/navigation";
import AggregateResultPanel from "../Aggregate/AggregateResultPanel";
import { useAppSelector } from "../app/hooks";
import { selectQuery } from "./QuerySlice";
import Summary from "./Summary";

export default function Results() {
  const index = useIndex();
  const query = useAppSelector(selectQuery);
  const items = ["Summary", "Articles", "Graph/Table", "Location"];
  const [selected, setSelected] = useState<string>(items[0]);
  if (index == null) return null;

  const get_content = (what: string) => {
    switch (what) {
      case "Summary":
        return <Summary />;
      case "Articles":
        return <ArticlesPanel index={index} query={query} />;
      case "Graph/Table":
        return <AggregateResultPanel />;
      case "Location":
        return <LocationPane index={index} query={query} />;
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

function ArticlesPanel({ index, query }: ArticlesProps) {
  const [id, setId] = useState<string>();
  const path = useLocation().pathname;
  return (
    <>
      <Articles index={index} query={query} onClick={(row) => setId(row._id)} />
      {id == null ? null : (
        <ArticleModal
          index={index}
          query={query}
          id={id}
          link={window.location.href.replace(path, link_doc(index, id))}
          changeArticle={(x) => setId(x as any)}
        />
      )}
    </>
  );
}
