import { useRouter, useSelectedLayoutSegments } from "next/navigation";

/** Convert from https://host:port/path to host:post%2Fpath */
export function abbreviateHostname(host: string) {
  if (!/^https?:\/\//.test(host)) throw new Error(`Cannot abbreviate hostname ${host}, already abbreviated?`);
  const hostname = new URL(host).hostname;
  host = host.replace(hostname == "localhost" ? "http://" : "https://", "");
  return encodeURIComponent(host).replaceAll("%3A", ":");
}

/** Convert from host:post%2Fpath to https://host:port/path */
export function expandHostname(host: string) {
  let result = decodeURIComponent(host);

  if (!/^https?:\/\//.test(result)) result = (/^localhost[:\/]/.test(result) ? "http://" : "https://") + result;
  return result;
}

export function useUrlHost() {
  const segments = useSelectedLayoutSegments();
  if (segments.length >= 2 && segments[0] === "host") {
    return expandHostname(segments[1]);
  }
  return undefined;
}
