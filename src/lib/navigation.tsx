import { AmcatIndex, AmcatUser } from "amcat4react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../components/app/hooks";
import { selectAmcatUser } from "../components/Menu/LoginSlice";

export function link_index(u: AmcatUser, ix: string) {
  return `${link_host(u.host)}/${ix}`;
}

export function link_host(host: string) {
  return `/x/${encodeURIComponent(host.replace(/^https:\/\//, ""))}`;
}

export function link_doc(ix: AmcatIndex, docid: string) {
  return `${link_index(ix, ix.index)}/doc/${docid}`;
}

export function useIndex(): AmcatIndex | undefined {
  const params = useParams();
  const user = useAppSelector(selectAmcatUser);
  return useMemo(
    () =>
      params.index == null || user?.email == null || user?.token == null
        ? undefined
        : { ...user, index: params.index },
    [user, params.index]
  );
}
