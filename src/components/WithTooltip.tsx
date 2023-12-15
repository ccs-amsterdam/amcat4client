import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface Props {
  children?: React.ReactNode;
  tooltip: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export function WithTooltip({ children, tooltip }: Props) {
  const trigger = children ?? (
    <HelpCircle className="mb-0 text-gray-600 w-5 h-5" />
  );

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
