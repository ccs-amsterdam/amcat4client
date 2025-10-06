import { AmcatFilter, AmcatIndexId, AmcatQuery } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import FilterPicker from "./FilterPicker";
import MultilineQueryForm from "./MultilineQueryForm";
import SimpleQueryForm from "./SimpleQueryForm";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  query: AmcatQuery;
  setQuery: Dispatch<SetStateAction<AmcatQuery>>;
}

export default function QueryForm({ user, indexId, query, setQuery }: Props) {
  const [queryDebounced, setQueryDebounced] = useState<AmcatQuery>(query);
  const debounceTimer = useRef<any>();

  if (!indexId) return null;

  const updateQuery = useCallback(
    (newQuery: AmcatQuery, executeAfter: number | "never") => {
      // more controll over state updates.
      // if executeAfter is "never", only update the debounced query
      // (as visible in the UI) but don't execute the query yet.
      // if executeAfter is defined, it is a number for the delay in ms.
      // can be 0 to execute immediately.

      setQueryDebounced(newQuery);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (executeAfter === "never") return;
      debounceTimer.current = setTimeout(
        () => {
          setQuery((current) => {
            if (JSON.stringify(current) === JSON.stringify(newQuery)) return current;
            return newQuery;
          });
          debounceTimer.current = undefined;
        },
        Number(executeAfter) || 0,
      );
    },
    [setQuery],
  );

  const queryChanged = JSON.stringify(query) !== JSON.stringify(queryDebounced);
  const debouncing = queryChanged && debounceTimer.current != null;

  return (
    <DebouncedQueryForm
      user={user}
      indexId={indexId}
      query={queryDebounced}
      updateQuery={updateQuery}
      debouncing={debouncing}
      queryChanged={queryChanged}
    />
  );
}

interface DebouncedQueryFormProps {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  query: AmcatQuery;
  updateQuery: (query: AmcatQuery, executeAfter: number | "never") => void;
  debouncing: boolean;
  queryChanged: boolean;
}

function DebouncedQueryForm({ user, indexId, query, updateQuery, debouncing, queryChanged }: DebouncedQueryFormProps) {
  const [advanced, setAdvanced] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function setHeight() {
      if (!containerRef?.current || !formRef?.current) return;
      const newHeight = Math.max(0, formRef.current.scrollHeight);
      containerRef.current.style.gridTemplateRows = newHeight + "px";
    }

    setHeight();
    const interval = setInterval(setHeight, 1000);
    return () => clearInterval(interval);
  }, [query, advanced, containerRef, formRef]);

  const onChangeFilter = (filter: AmcatFilter, name: string) => {
    updateQuery(
      {
        ...query,
        filters: { ...query?.filters, [name]: filter },
      },
      2000,
    );
  };

  const switchAdvanced = () => setAdvanced(!advanced);

  const onDeleteFilter = (name: string) => {
    const f = { ...query.filters };
    delete f[name];
    updateQuery({ ...query, filters: f }, 2000);
  };

  const QForm = advanced ? MultilineQueryForm : SimpleQueryForm;

  return (
    <div className="flex flex-col gap-3">
      <div ref={containerRef} className={`grid grid-rows-1 overflow-hidden transition-all`}>
        <div>
          <div ref={formRef}>
            <QForm
              user={user}
              indexId={indexId}
              query={query}
              updateQuery={updateQuery}
              switchAdvanced={switchAdvanced}
              debouncing={debouncing}
              queryChanged={queryChanged}
            >
              {Object.keys(query?.filters || {}).map((f, i) => (
                <FilterPicker
                  key={f + i}
                  className="w-full"
                  user={user}
                  indexId={indexId}
                  fieldName={f}
                  value={query?.filters?.[f]}
                  onChange={(newval) => onChangeFilter(newval, f)}
                  onDelete={() => onDeleteFilter(f)}
                />
              ))}
            </QForm>
          </div>
        </div>
      </div>
    </div>
  );
}
