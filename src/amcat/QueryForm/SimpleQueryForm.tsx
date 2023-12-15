import { useFields } from "@/amcat/api/fields";
import { queriesFromString, queriesToString } from "./libQuery";
import AddFilterButton, { fieldOptions } from "./AddFilterButton";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, Filter, Loader, Search } from "lucide-react";
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

export default function SimpleQueryForm({
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

  function handleKeydown(e: any) {
    if (e.key === "Enter") {
      updateQuery(query, 0);
    }
  }
  const options = fieldOptions(fields, query);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 p-1">
        <div className="relative  min-w-[50%] flex-auto w-auto">
          <Input
            className="pl-10"
            placeholder="search"
            value={queriesToString(query.queries || [], false)}
            onChange={(e) => {
              updateQuery(
                {
                  ...query,
                  queries: queriesFromString(e.target.value),
                },
                2000
              );
            }}
            onKeyDown={handleKeydown}
          />
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-2 pointer-events-none">
            {debouncing ? (
              <Loader className="animate-[spin_2000ms_linear_infinite]" />
            ) : (
              <Search />
            )}
          </div>
        </div>
        <ChevronsUpDown
          onClick={switchAdvanced}
          className="p-1 w-8 h-8 cursor-pointer"
        />
        <AddFilterButton
          options={options}
          value={query}
          onSubmit={(value) => updateQuery(value, 0)}
        >
          <Filter
            className={
              options.length === 0 ? "text-gray-400" : "cursor-pointer"
            }
          />
        </AddFilterButton>
      </div>
      <div className="Filters flex justify-start flex-wrap items-center gap-1 p-1">
        {children}
      </div>
    </div>
  );
}
