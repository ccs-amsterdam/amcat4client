import {
  AggregateResult,
  AggregationAxis,
  AmcatQuery,
  Articles,
} from "amcat4react";
import { Container, Divider, Grid, Segment } from "semantic-ui-react";
import { useAppSelector } from "./app/hooks";
import { selectIndex } from "./Menu/LoginSlice";
import TopMenu from "./Menu/TopMenu";
import QueryForm from "./Query/QueryForm";
import { selectQuery } from "./Query/QuerySlice";
import Results from "./Results";

export default function AmcatClient() {
  const index = useAppSelector(selectIndex);
  return (
    <>
      <TopMenu />
      <Container style={{ paddingTop: "55px" }}>
        {index == null ? null : (
          <>
            <QueryForm />
            <Results />
          </>
        )}
      </Container>
    </>
  );
}
