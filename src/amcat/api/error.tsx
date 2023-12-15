import { AxiosError } from "axios";

export function describeError(e: AxiosError): string {
  if (e.response) return `HTTP error ${e.response.status}`;
  if (e.request) return "No reply from server";
  return "Something went wrong trying to query the AmCAT backend";
}
