import { AmcatIndexName } from "../amcat4react";

export function link_index(host: string, index: AmcatIndexName) {
  return `${link_host(host)}/i/${index}`;
}

export function link_query(host: string, index: AmcatIndexName) {
  return `${link_index(host, index)}/query`;
}

export function link_host(host: string) {
  const fixed_host = process.env.REACT_APP_FIXED_HOST;

  return fixed_host ? `/h/${abbreviateHostname(fixed_host)}` : `/h/${abbreviateHostname(host)}`;
}

export function link_doc(host: string, index: AmcatIndexName, doc: string) {
  return `${link_index(host, index)}/doc/${doc}`;
}

/** Convert from https://host:port/path to host:post%2Fpath */
export function abbreviateHostname(host: string) {
  if (!/^https?:\/\//.test(host)) throw new Error(`Cannot abbreviate hostname ${host}, already abbreviated?`)
  const hostname = new URL(host).hostname;
  host = host.replace(hostname == "localhost" ? "http://" : "https://", "");
  return encodeURIComponent(host).replaceAll("%3A", ":");
}

/** Convert from host:post%2Fpath to https://host:port/path */
export function expandHostname(host: string) {
  let result = decodeURIComponent(host)

  if (!/^https?:\/\//.test(result))
    result = (/^localhost[:\/]/.test(result)?"http://":"https://") + result
  return result
}