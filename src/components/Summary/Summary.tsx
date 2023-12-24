import Articles from "../Articles/Articles";
import { MiddlecatUser } from "middlecat-react";
import { AmcatQuery } from "@/interfaces";
import { useFields } from "@/api/fields";
import { useFieldValues } from "@/api/fieldValues";
import { useFieldStats } from "@/api/fieldStats";

interface Props {
  user: MiddlecatUser;
  index: string;
  query: AmcatQuery;
}

export default function Summary({ user, index, query }: Props) {
  const { data: fields } = useFields(user, index);

  //const { data: date } = useFieldStats(user, index, "date");
  //const { data: president } = useFieldValues(user, index, "president");

  return (
    <div className="grid grid-cols-2">
      <div></div>
      <Articles user={user} index={index} query={query} />
    </div>
  );
}
