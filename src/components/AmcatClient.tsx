import { QueryForm } from "amcat4react";
import { useIndex } from "../lib/navigation";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectQuery, setQuery } from "./Query/QuerySlice";
import Results from "./Query/Results";

export default function AmcatClient() {
  const index = useIndex();
  const query = useAppSelector(selectQuery);
  const dispatch = useAppDispatch();
  if (index == null) return null;
  return (
    <>
      <QueryForm
        index={index}
        value={query}
        onSubmit={(q) => dispatch(setQuery(q))}
      />
      <Results />
    </>
  );
}
