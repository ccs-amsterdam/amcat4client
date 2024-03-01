import Articles from "../Articles/Articles";
import { MiddlecatUser } from "middlecat-react";
import { AmcatIndexId, AmcatQuery } from "@/interfaces";
import { useFields } from "@/api/fields";

interface Props {
  user: MiddlecatUser;
  indexName: AmcatIndexId;
  query: AmcatQuery;
}

export default function Summary({ user, indexName, query }: Props) {
  const { data: fields, isLoading: fieldsLoading } = useFields(user, indexName);

  return (
    <div className="grid snap-x snap-mandatory grid-cols-[100%,100%] overflow-auto sm:grid-cols-2">
      <div className=" border-foreground/31 snap-center overflow-auto  rounded-l">
        <Articles user={user} indexName={indexName} query={query} />
      </div>
      <div className=" snap-center ">
        {fields?.map((field) => {
          return (
            <div key={field.name} className="flex justify-between">
              <div>{field.name}</div>
              <div>{field.type}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
