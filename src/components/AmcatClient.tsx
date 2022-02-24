import { QueryForm } from "amcat4react";
import { Container } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectIndex } from "./Menu/LoginSlice";
import TopMenu from "./Menu/TopMenu";
import { selectQuery, setQuery } from "./Query/QuerySlice";
import Results from "./Query/Results";

export default function AmcatClient() {
  const index = useAppSelector(selectIndex);
  const query = useAppSelector(selectQuery);
  const dispatch = useAppDispatch();
  return (
    <>
      <TopMenu />
      <Container style={{ paddingTop: "55px" }}>
        {index == null ? null : (
          <>
            <QueryForm
              index={index}
              value={query}
              onSubmit={(q) => dispatch(setQuery(q))}
            />
            <Results />
          </>
        )}
      </Container>
    </>
  );
}
