import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AmcatIndexName,
  AmcatQuery,
  AmcatUser,
  AmcatFilter,
} from "@/amcat/interfaces";
import MultilineQueryForm from "./MultilineQueryForm";
import SimpleQueryForm from "./SimpleQueryForm";
import FilterPicker from "./FilterPicker";
import { useFields, getField } from "@/amcat/api/fields";

export interface Props {
  user: AmcatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
  setQuery: Dispatch<SetStateAction<AmcatQuery>>;
}

export default function QueryForm({ user, index, query, setQuery }: Props) {
  const [queryDebounced, setQueryDebounced] = useState<AmcatQuery>(query);
  const debounceTimer = useRef<any>();

  if (!index) return null;

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
      debounceTimer.current = setTimeout(() => {
        setQuery((current) => {
          if (JSON.stringify(current) === JSON.stringify(newQuery))
            return current;
          return newQuery;
        });
        debounceTimer.current = undefined;
      }, Number(executeAfter) || 0);
    },
    [setQuery]
  );

  const queryChanged = JSON.stringify(query) !== JSON.stringify(queryDebounced);
  const debouncing = queryChanged && debounceTimer.current != null;

  return (
    <DebouncedQueryForm
      user={user}
      index={index}
      query={queryDebounced}
      updateQuery={updateQuery}
      debouncing={debouncing}
      queryChanged={queryChanged}
    />
  );
}

interface DebouncedQueryFormProps {
  user: AmcatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
  updateQuery: (query: AmcatQuery, executeAfter: number | "never") => void;
  debouncing: boolean;
  queryChanged: boolean;
}

function DebouncedQueryForm({
  user,
  index,
  query,
  updateQuery,
  debouncing,
  queryChanged,
}: DebouncedQueryFormProps) {
  const { data: fields } = useFields(user, index);
  const [advanced, setAdvanced] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function setHeight() {
      if (!containerRef?.current || !formRef?.current) return;
      const newHeight = formRef.current.scrollHeight + "px";
      containerRef.current.style.gridTemplateRows = newHeight;
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
      2000
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
      <div
        ref={containerRef}
        className={`grid grid-rows-1 transition-all overflow-hidden`}
      >
        <div>
          <div ref={formRef}>
            {" "}
            <QForm
              user={user}
              index={index}
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
                  index={index}
                  field={getField(fields, f)}
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
