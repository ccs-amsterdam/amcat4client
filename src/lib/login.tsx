import { Amcat, AmcatIndex, AmcatUser } from "amcat4react";
import Axios from "axios";
import { useEffect, useState } from "react";

interface HistoryUser extends AmcatUser {
  last_used: Date;
}

const STORE_KEY = "amcat4client_tokens";

export function getUserFromHistory(host: string): AmcatUser | undefined {
  const x = localStorage.getItem(STORE_KEY);
  if (x == null) return undefined;
  const users: Array<HistoryUser> = JSON.parse(x);
  return users.find((u) => u.host === host);
}

export function getUsersFromHistory(): HistoryUser[] {
  const x = localStorage.getItem(STORE_KEY);
  return x == null ? [] : JSON.parse(x);
}

export function addUserToHistory(user: AmcatUser) {
  // Get users, remove this host, add new entry
  console.log(user);
  const users = getUsersFromHistory().filter((u) => u.host !== user.host);
  const history = [{ ...user, last_used: new Date().toISOString() }, ...users];
  localStorage.setItem(STORE_KEY, JSON.stringify(history));
}

export interface Index {
  name: string;
  role: string;
}
export function useIndexList(user?: AmcatUser): Index[] | undefined {
  const [indices, setIndices] = useState<Index[]>();
  useEffect(() => {
    if (user == null) return;
    Amcat.getIndices(user)
      .then((data) => setIndices(data.data))
      .catch((error) => {
        console.error(error);
        setIndices(undefined);
      });
  }, [user, setIndices]);
  return indices;
}

// TODO: these belong in amcat4react but easier to test here. I think.
function api(index: AmcatIndex) {
  return Axios.create({
    baseURL: `${index.host}/index/${index.index}`,
    headers: { Authorization: `Bearer ${index.token}` },
  });
}
export function setField(index: AmcatIndex, field: string, type: any) {
  const body = { [field]: type };
  return api(index).post(`fields`, body);
}
