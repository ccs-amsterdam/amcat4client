import { AmcatMetareaderAccess } from "@/interfaces";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDown, Eye, EyeOff, Scissors } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { e } from "next-usequerystate/dist/parsers-d2c58bed";

interface Props {
  metareader_access: AmcatMetareaderAccess;
  onChangeAccess: (access: "none" | "snippet" | "read") => void;
  onChangeSnippetParams: (nomatch_chars: number, max_matches: number, match_chars: number) => void;
}

const noneLabel = (
  <>
    <EyeOff className="text-destructive" />
    Not at all
  </>
);
const snippetLabel = (
  <>
    <Scissors />
    Only snippet
  </>
);
const readLabel = (
  <>
    <Eye />
    Full access
  </>
);

export default function MetareaderAccessForm({ metareader_access, onChangeAccess, onChangeSnippetParams }: Props) {
  function renderAccess() {
    if (metareader_access.access === "none") return noneLabel;
    if (metareader_access.access === "snippet") return snippetLabel;
    if (metareader_access.access === "read") return readLabel;
  }

  return (
    <div className="flex flex-col gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
          {renderAccess()} <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onChangeAccess("none")} className="flex gap-4">
            {noneLabel}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeAccess("snippet")} className="flex gap-4">
            {snippetLabel}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeAccess("read")} className="flex gap-4">
            {readLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className={`${metareader_access.access === "snippet" ? "" : "hidden"}`}>
        <SnippetParamsPopover metareader_access={metareader_access} onChangeSnippetParams={onChangeSnippetParams} />
      </div>
    </div>
  );
}

function SnippetParamsPopover({ metareader_access, onChangeSnippetParams }: Omit<Props, "onChangeAccess">) {
  const [snippetParams, setSnippetParams] = useState(metareader_access.snippetParams);
  const currentRef = useRef(snippetParams);

  useEffect(() => {
    currentRef.current = metareader_access.snippetParams;
    setSnippetParams(metareader_access.snippetParams);
  }, [metareader_access, currentRef]);

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open && currentRef.current !== snippetParams) {
          onChangeSnippetParams(snippetParams?.nomatch_chars, snippetParams?.max_matches, snippetParams?.match_chars);
        }
      }}
    >
      <PopoverTrigger asChild className="cursor-pointer">
        <span className="text-primary">{`${snippetParams.nomatch_chars}, ${snippetParams.max_matches} x ${snippetParams.match_chars}`}</span>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-[90vw]">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-3">
            <label className="flex-auto">Length of snippet (in characters) if there is no query</label>
            <Input
              type="number"
              className="w-28"
              onChange={(e) => setSnippetParams({ ...snippetParams, nomatch_chars: Number(e.target.value) })}
              value={snippetParams?.nomatch_chars}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex-auto">Maximum number of query matches</label>
            <Input
              type="number"
              className="w-28"
              onChange={(e) => setSnippetParams({ ...snippetParams, max_matches: Number(e.target.value) })}
              value={snippetParams?.max_matches}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex-auto">Match characters</label>
            <Input
              type="number"
              className="w-28"
              onChange={(e) => setSnippetParams({ ...snippetParams, match_chars: Number(e.target.value) })}
              value={snippetParams?.match_chars}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
