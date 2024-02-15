import Articles from "../Articles/Articles";
import { MiddlecatUser } from "middlecat-react";
import { AmcatIndexId, AmcatQuery } from "@/interfaces";
import { useFields } from "@/api/fields";
import { useFieldValues } from "@/api/fieldValues";
import { useFieldStats } from "@/api/fieldStats";
import { Button } from "../ui/button";

interface Props {
  user: MiddlecatUser;
  indexName: AmcatIndexId;
  query: AmcatQuery;
}

export default function Summary({ user, indexName, query }: Props) {
  //const { data: fields } = useFields(user, indexName);
  //const { data: date } = useFieldStats(user, index, "date");
  //const { data: president } = useFieldValues(user, index, "president");

  return (
    <div className="grid snap-x snap-mandatory grid-cols-[100%,100%] overflow-auto sm:grid-cols-2">
      <div className=" max-h-screen snap-center overflow-auto rounded-l border-y border-foreground/30">
        <Articles user={user} indexName={indexName} query={query} />
      </div>
      <div className=" snap-center"></div>
    </div>
  );
}
