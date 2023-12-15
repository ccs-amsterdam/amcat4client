import { useFields } from "@/amcat/api/fields";
import AddFilterButton, { fieldOptions } from "./AddFilterButton";
import { queriesFromString, queriesToString } from "./libQuery";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronUp, PlusSquare, Loader } from "lucide-react";
import { AmcatQuery, AmcatIndexName, AmcatUser } from "../interfaces";

interface Props {
  user: AmcatUser;
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
    <div className="prose max-w-none grid grid-cols-1 md:grid-cols-[1fr,300px] gap-3 lg:gap-6">
      <form className="flex flex-col flex-auto w-full p-1">
        {/*       <form className="flex-auto w-full p-1">
         */}
        <div className="flex items-center gap-2 h-10">
          <div className="flex items-center">
            <b>Query</b>
            <ChevronUp
              onClick={switchAdvanced}
              className="p-1 mb-1  w-8 h-8 cursor-pointer"
            />
          </div>
        </div>
        <Textarea
          className="flex-auto min-h-[120px]"
          placeholder={`Enter multiple (labeled) queries:\n\nLabel1 = query1\nLabel2 = query2\netc.`}
          onChange={(e) => {
            updateQuery(
              { ...query, queries: queriesFromString(e.target.value) },
              "never"
            );
          }}
          onKeyDown={handleKeyDown}
          value={queriesToString(query?.queries || [], true)}
        />
        <Button
          className="bg-gray-200 border-2 w-full  h-8 mt-1"
          onClick={submitForm}
          disabled={!queryChanged}
        >
          <Loader
            className={`${
              debouncing ? "" : "invisible"
            } mr-2 animate-[spin_2000ms_linear_infinite] `}
          />
          Submit Query <i className="pl-2">(ctrl+Enter)</i>{" "}
        </Button>
      </form>

      <div className="flex  flex-col flex-auto w-full p-1">
        <div className="flex items-center gap-2 h-10">
          <b>Filters</b>
          <AddFilterButton
            options={options}
            value={query}
            onSubmit={(value) => updateQuery(value, 0)}
          >
            <PlusSquare
              className={
                options.length === 0
                  ? "text-gray-400 cursor-default"
                  : "cursor-pointer"
              }
            />
          </AddFilterButton>
        </div>

        <div className="Filters flex-auto">{children}</div>
      </div>
    </div>
  );
}
