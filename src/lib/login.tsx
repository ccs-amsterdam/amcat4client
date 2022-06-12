import { AmcatUser } from "amcat4react";

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
