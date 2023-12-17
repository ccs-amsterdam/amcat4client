import { useFields } from "@/amcat/api/fields";
import { queriesFromString, queriesToString } from "./libQuery";
import AddFilterButton, { fieldOptions } from "./AddFilterButton";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, Filter, Loader, Search } from "lucide-react";
import { AmcatQuery, AmcatIndexName } from "@/amcat/interfaces";
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
        <div className="relative  w-auto min-w-[50%] flex-auto">
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
                2000,
              );
            }}
            onKeyDown={handleKeydown}
          />
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 flex items-center pl-2">
            {debouncing ? <Loader className="animate-[spin_2000ms_linear_infinite]" /> : <Search />}
          </div>
        </div>
        <ChevronsUpDown onClick={switchAdvanced} className="h-8 w-8 cursor-pointer p-1" />
        <AddFilterButton options={options} value={query} onSubmit={(value) => updateQuery(value, 0)}>
          <Filter className={options.length === 0 ? "text-gray-400" : "cursor-pointer"} />
        </AddFilterButton>
      </div>
      <div className="Filters flex flex-wrap items-center justify-start gap-1 p-1">{children}</div>
    </div>
  );
}
