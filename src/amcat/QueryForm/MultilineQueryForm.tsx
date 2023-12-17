import { useFields } from "@/amcat/api/fields";
import AddFilterButton, { fieldOptions } from "./AddFilterButton";
import { queriesFromString, queriesToString } from "./libQuery";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronUp, PlusSquare, Loader } from "lucide-react";
import { AmcatQuery, AmcatIndexName } from "../interfaces";
import { MiddlecatUser } from "middlecat-react";

interface Props {
  user: MiddlecatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
  updateQuery: (query: AmcatQuery, executeAfter: number | "never") => void;
  debouncing: boolean;
  queryChanged?: boolean;
  children?: React.ReactNode[]; // pass filters as children
  switchAdvanced?: () => void;
}

export default function MultilineQueryForm({
  children,
  user,
  index,
  query,
  debouncing,
  queryChanged,
  updateQuery,
  switchAdvanced,
}: Props) {
  const { data: fields } = useFields(user, index);

  if (!index || !fields) return null;

  function handleKeyDown(event: any) {
    if (event.key === "Enter" && event.ctrlKey) {
      updateQuery(query, 0);
    }
  }

  function submitForm(e: any) {
    e.preventDefault();
    updateQuery(query, 0);
  }

  const options = fieldOptions(fields, query);

  return (
    <div className="prose grid max-w-none grid-cols-1 gap-3 md:grid-cols-[1fr,300px] lg:gap-6">
      <form className="flex w-full flex-auto flex-col p-1">
        {/*       <form className="flex-auto w-full p-1">
         */}
        <div className="flex h-10 items-center gap-2">
          <div className="flex items-center">
            <b>Query</b>
            <ChevronUp onClick={switchAdvanced} className="mb-1 h-8  w-8 cursor-pointer p-1" />
          </div>
        </div>
        <Textarea
          className="min-h-[120px] flex-auto"
          placeholder={`Enter multiple (labeled) queries:\n\nLabel1 = query1\nLabel2 = query2\netc.`}
          onChange={(e) => {
            updateQuery({ ...query, queries: queriesFromString(e.target.value) }, "never");
          }}
          onKeyDown={handleKeyDown}
          value={queriesToString(query?.queries || [], true)}
        />
        <Button className="mt-1 h-8 w-full  border-2 bg-gray-200" onClick={submitForm} disabled={!queryChanged}>
          <Loader className={`${debouncing ? "" : "invisible"} mr-2 animate-[spin_2000ms_linear_infinite] `} />
          Submit Query <i className="pl-2">(ctrl+Enter)</i>{" "}
        </Button>
      </form>

      <div className="flex  w-full flex-auto flex-col p-1">
        <div className="flex h-10 items-center gap-2">
          <b>Filters</b>
          <AddFilterButton options={options} value={query} onSubmit={(value) => updateQuery(value, 0)}>
            <PlusSquare className={options.length === 0 ? "cursor-default text-gray-400" : "cursor-pointer"} />
          </AddFilterButton>
        </div>

        <div className="Filters flex-auto">{children}</div>
      </div>
    </div>
  );
}
