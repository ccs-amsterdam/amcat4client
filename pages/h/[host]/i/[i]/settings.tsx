import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Button, Message } from "semantic-ui-react";
import { AmcatIndex, useMiddlecatContext } from "../../../../../amcat4react";
import { changeIndex, errorToString, getIndex } from "../../../../../amcat4react/Amcat";
import IndexDetailsForm from "../../../../../amcat4react/components/Indices/IndexDetailsForm";
import { QueryKey } from "../../../../../amcat4react/hooks/useAmcatIndices";

type State = "unchanged" | "modified" | "success" | "error" | "loading";

export default function IndexSettings() {
  const { user } = useMiddlecatContext();
  const router = useRouter();
  const queryclient = useQueryClient();
  const id = router.query.i as string;
  const [index, setIndex] = useState<AmcatIndex | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [state, setState] = useState<State>("unchanged");

  const indexresults = useQuery(["index", id], async () => user && (await getIndex(user, id)).data, {
    enabled: user != null && id != null,
    staleTime: 600000,
    onSuccess: setIndex,
  });
  if (indexresults.isSuccess && indexresults.data != null && index == null) setIndex(indexresults.data);
  if (!user || !index) return null;

  const handleSubmit = () => {
    setState("loading");
    changeIndex(user, index)
      .then(() => {
        setError(undefined);
        setState("success");
        indexresults.refetch();
        queryclient.invalidateQueries(QueryKey);
      })
      .catch((err) => {
        console.log(err);
        setError(errorToString(err));
        setState("error");
      });
  };

  const handleChange = (index: AmcatIndex) => {
    setIndex(index);
    setState("modified");
  };
  return (
    <>
      <IndexDetailsForm disable_id index={index} onChange={handleChange} error={error} />
      <Button
        loading={state === "loading"}
        disabled={state !== "modified"}
        type="submit"
        primary
        content="Save changes"
        onClick={handleSubmit}
      />
      <Message hidden={state !== "success"} positive>
        Changes saved
      </Message>
    </>
  );
}
