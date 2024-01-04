import { AmcatClientDisplay, AmcatMetareaderAccess } from "@/interfaces";

const defaultSnippetParams = {
  nomatch_chars: 200,
  max_matches: 3,
  match_chars: 50,
};

export function parseMetareader(metareader_access: string): AmcatMetareaderAccess {
  if (metareader_access === "read") {
    return {
      access: "read",
      snippetParams: defaultSnippetParams,
    };
  }

  if (metareader_access.includes("snippet")) {
    if (!metareader_access.includes("[")) {
      return {
        access: "snippet",
        snippetParams: defaultSnippetParams,
      };
    }
    try {
      const [nomatch_chars, max_matches, match_chars] = metareader_access.split("[")[1].split("]")[0].split(";");
      return {
        access: "snippet",
        snippetParams: {
          nomatch_chars: parseInt(nomatch_chars),
          max_matches: parseInt(max_matches),
          match_chars: parseInt(match_chars),
        },
      };
    } catch (e) {
      console.error(e);
      return {
        access: "snippet",
        snippetParams: defaultSnippetParams,
      };
    }
  }

  return {
    access: "none",
    snippetParams: defaultSnippetParams,
  };
}

export function stringifyMetareader(metareader: AmcatMetareaderAccess): string {
  const { access, snippetParams } = metareader;
  if (access === "none") return "none";
  if (access === "read") return "read";
  const { nomatch_chars, max_matches, match_chars } = snippetParams;
  return `snippet[${nomatch_chars};${max_matches};${match_chars}]`;
}

export function parseClientDisplay(client_display: string): AmcatClientDisplay {
  if (!client_display) return { inList: false, inDocument: false };
  const inList = client_display.includes("list");
  const inDocument = client_display.includes("document");
  return { inList, inDocument };
}

export function stringifyClientDisplay(client_display: AmcatClientDisplay): string {
  const { inList, inDocument } = client_display;
  return `${inList ? "list_" : ""}${inDocument ? "document_" : ""}`;
}
