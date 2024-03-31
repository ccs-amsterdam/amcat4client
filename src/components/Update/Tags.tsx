import { AggregationOptions, AmcatIndexId, AmcatQuery } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import AggregateResult from "../Aggregate/AggregateResult";
import { useFields } from "@/api/fields";
import { useFieldValues } from "@/api/fieldValues";
import { ChevronDown, Tag } from "lucide-react";
import { Loading } from "../ui/loading";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { useMutateTags } from "@/api/tags";
import { FormEvent, useState } from "react";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  query: AmcatQuery;
}

const TagGraphOptions: AggregationOptions = {
  axes: [{ name: "tag", field: "tag" }],
  display: "barchart",
  title: "Tags",
};

export default function Tags({ user, indexId, query }: Props) {
  const { data: fields, isLoading: fieldsLoading } = useFields(user, indexId);
  const { data: fieldValues, isLoading: fieldValuesLoading } = useFieldValues(user, indexId, "tag");
  const [newTag, setNewTag] = useState<string>("");
  const { mutate } = useMutateTags(user, indexId);
  if (fieldsLoading || fieldValuesLoading) return <Loading />;
  if (!fields) return null;
  const hasTags = fields.some((field) => field.name === "tag");

  function onSubmitAddTags(e: FormEvent) {
    e.preventDefault();
    console.log("Add tag");
    mutate({ tag: newTag, action: "add", field: "tags", query });
  }

  return (
    <div>
      <div>
        <h3>Assign tags to query resuls</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h4>Existing tags</h4>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2">
                Select tags <ChevronDown className="h-5 w-5" />{" "}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div>
                  {fieldValues?.map((tag) => (
                    <div key={tag}>
                      <Tag className="h-4 w-4" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <h4>Assign tags</h4>
            <form className=" " onSubmit={onSubmitAddTags}>
              <Input placeholder="Add tag" onChange={(e) => setNewTag(e.target.value)} />
              <button>Add tag</button>
            </form>
          </div>
        </div>
      </div>
      {hasTags ? <TagGraph user={user} indexId={indexId} query={query} /> : null}
    </div>
  );
}

function TagGraph({ user, indexId, query }: Props) {
  return (
    <div>
      <AggregateResult user={user} indexId={indexId} query={query} options={TagGraphOptions} />
    </div>
  );
}
