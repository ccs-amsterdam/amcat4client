import { AmcatIndex } from "amcat4react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../components/app/hooks";
import { selectAmcatUser } from "../components/Menu/LoginSlice";

export function link_index(ix: AmcatIndex) {
  return `${link_host(ix.host)}/i/${ix.index}`;
}

export function link_host(host: string) {
  const fixed_host = process.env.REACT_APP_FIXED_HOST;

  return fixed_host
    ? ""
    : `/h/${encodeURIComponent(host.replace(/^https:\/\//, ""))}`;
}

export function link_doc(ix: AmcatIndex, docid: string) {
  return `${link_index(ix)}/doc/${docid}`;
}

export function useIndex(): AmcatIndex | undefined {
  const params = useParams();
  const user = useAppSelector(selectAmcatUser);
  const fixed_host = process.env.REACT_APP_FIXED_HOST;
  console.log({ params, fixed_host, env: process.env });
  return useMemo(
    () =>
      params.index == null || user?.email == null || user?.token == null
        ? undefined
        : { ...user, index: params.index },
    [user, params.index]
  );
}
