import Articles from "../Articles/Articles";
import { MiddlecatUser } from "middlecat-react";
import { AmcatIndexName, AmcatQuery } from "@/interfaces";
import { useFields } from "@/api/fields";
import { useFieldValues } from "@/api/fieldValues";
import { useFieldStats } from "@/api/fieldStats";

interface Props {
  user: MiddlecatUser;
  indexName: AmcatIndexName;
  query: AmcatQuery;
}

export default function Summary({ user, indexName, query }: Props) {
  //const { data: fields } = useFields(user, indexName);
  //const { data: date } = useFieldStats(user, index, "date");
  //const { data: president } = useFieldValues(user, index, "president");

  return (
    <div className="grid grid-cols-2">
      <div></div>
      <Articles user={user} indexName={indexName} query={query} />
    </div>
  );
}
