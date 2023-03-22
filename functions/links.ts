import { AmcatIndexName } from "../amcat4react";

export function link_index(host: string, index: AmcatIndexName) {
  return `${link_host(host)}/i/${index}`;
}

export function link_query(host: string, index: AmcatIndexName) {
  return `${link_index(host, index)}/query`;
}

export function link_host(host: string) {
  const fixed_host = process.env.REACT_APP_FIXED_HOST;

  return fixed_host ? `/h/${encodeHostname(fixed_host)}` : `/h/${encodeHostname(host)}`;
}

export function link_doc(host: string, index: AmcatIndexName, doc: string) {
  return `${link_index(host, index)}/doc/${doc}`;
}

export function encodeHostname(host: string) {
  const hostname = new URL(host).hostname;
  host = host.replace(hostname == "localhost" ? "http://" : "https://", "");
  return encodeURIComponent(host).replaceAll("%3A", ":");
}
