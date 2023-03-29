export function titleCase(txt: string | undefined) {
  if (txt == null) return txt;
  return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
}
