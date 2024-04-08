import { AggregationOptions, AmcatIndexId, AmcatQuery } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import AggregateResult from "../Aggregate/AggregateResult";
import { useFields } from "@/api/fields";
import { useFieldValues } from "@/api/fieldValues";
import { ChevronDown, MessageCircle, Tag, Trash2 } from "lucide-react";
import { Loading } from "../ui/loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { useMutateTags } from "@/api/tags";
import { useState } from "react";
import { DynamicIcon } from "../ui/dynamic-icon";
import { Button } from "../ui/button";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  query: AmcatQuery;
}

export default function Tags({ user, indexId, query }: Props) {
  const { data: fields, isLoading: fieldsLoading } = useFields(user, indexId);
  const [field, setField] = useState("");
  if (fieldsLoading) return <Loading />;
  if (!fields) return null;
  const tagFields = fields.filter((f) => f.type === "tag");

  return (
    <div>
      <h4>Select tag field to update:</h4>
      {tagFields.length === 0 ? (
        <div>There are no tag fields in this index. Create a tag field in index setup</div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-full items-center justify-between gap-3 rounded border border-primary px-3 text-primary outline-none">
            {field || "Select field"}
            <ChevronDown className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={field} onValueChange={setField}>
              {tagFields.map((f) => (
                <DropdownMenuRadioItem key={f.name} value={f.name}>
                  <DynamicIcon type={f.type} />
                  {f.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {field == "" ? null : (
        <>
          <br />
          <TagDetails user={user} indexId={indexId} query={query} field={field} />
        </>
      )}
    </div>
  );
}

interface TagDetailsProps extends Props {
  field: string;
}

const NEW_TAG = "@@@new@@@";

function TagDetails({ user, indexId, query, field }: TagDetailsProps) {
  const { data: fields, isLoading: fieldsLoading } = useFields(user, indexId);
  const { data: fieldValues, isLoading: fieldValuesLoading } = useFieldValues(user, indexId, field);
  const [newTag, setNewTag] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>();

  const { mutate } = useMutateTags(user, indexId);

  if (fieldsLoading || fieldValuesLoading) return <Loading />;
  if (!fields) return null;
  const hasTags = fields.some((field) => field.name === "tag");

  const onSubmit = (action: "add" | "remove") => {
    const tag = selectedTag === NEW_TAG ? newTag : selectedTag;
    if (tag == null || tag == "") {
      alert("No tag?");
      return;
    }
    // TODO validate
    mutate({ tag, action, field, query });
  };

  const valid = selectedTag != null && (selectedTag !== NEW_TAG || newTag != "");
  return (
    <div>
      <div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
              {selectedTag == null
                ? "Select tag"
                : selectedTag === NEW_TAG
                  ? "Enter a new tag below or select a tag"
                  : `Selected tag: ${selectedTag}`}{" "}
              <ChevronDown className="h-5 w-5" />{" "}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={selectedTag} onValueChange={setSelectedTag}>
                <DropdownMenuRadioItem value={NEW_TAG} key={NEW_TAG}>
                  <Tag className="h-4 w-4" />
                  <span>Create a new tag</span>
                </DropdownMenuRadioItem>
                {fieldValues?.map((tag) => (
                  <DropdownMenuRadioItem value={tag} key={tag}>
                    <Tag className="h-4 w-4" />
                    <span>{tag}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {selectedTag !== NEW_TAG ? null : <Input placeholder="New tag" onChange={(e) => setNewTag(e.target.value)} />}
        <br />
        <Button disabled={!valid} onClick={() => onSubmit("add")}>
          <MessageCircle />
          Add tag to documents
        </Button>
        &nbsp;
        <Button variant="destructive" disabled={!valid} onClick={() => onSubmit("remove")}>
          <Trash2 />
          Remove tag from documents
        </Button>
      </div>
      <TagGraph user={user} indexId={indexId} query={query} field={field} />
    </div>
  );
}

function TagGraph({ user, indexId, query, field }: TagDetailsProps) {
  const TagGraphOptions: AggregationOptions = {
    axes: [{ name: "tag", field: field }],
    display: "barchart",
    title: "Tags",
  };
  return (
    <div>
      <h4>Tag distribution in all documents</h4>
      <AggregateResult user={user} indexId={indexId} query={{}} options={TagGraphOptions} />
    </div>
  );
}
