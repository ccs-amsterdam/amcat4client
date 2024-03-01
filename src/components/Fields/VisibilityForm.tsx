import { AmcatClientSettings, AmcatField } from "@/interfaces";
import { ChevronDown, File, LineChart, List } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface Props {
  field: AmcatField;
  client_settings: AmcatClientSettings;
  onChange: (client_settings: AmcatClientSettings) => void;
}

const IconClass = "h-5 w-5";

export default function VisibilityForm({ field, client_settings, onChange }: Props) {
  const canVisualize = field.type !== "text";

  function renderLabel() {
    return (
      <>
        <File className={`${IconClass} ${client_settings.inDocument ? "text-foreground" : "text-foreground/30"}`} />
        <List className={`${IconClass} ${client_settings.inList ? "text-foreground" : "text-foreground/30"}`} />
        <LineChart
          className={`${IconClass} ${client_settings.inListSummary ? "text-foreground" : "text-foreground/30"} ${
            canVisualize ? "" : "opacity-0"
          }`}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 outline-none">
          {renderLabel()} <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => onChange({ ...client_settings, inDocument: !client_settings.inDocument })}
            className="flex gap-4"
          >
            <File />
            show in document
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onChange({ ...client_settings, inList: !client_settings.inList })}
            className="flex gap-4"
          >
            <List />
            show in list
          </DropdownMenuItem>
          {canVisualize ? (
            <DropdownMenuItem
              onClick={() => onChange({ ...client_settings, inListSummary: !client_settings.inListSummary })}
              className="flex gap-4"
            >
              <LineChart />
              visualize in list
            </DropdownMenuItem>
          ) : null}{" "}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
