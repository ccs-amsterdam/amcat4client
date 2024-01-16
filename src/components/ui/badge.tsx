import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  tooltip?: string;
}

function Badge({ className, variant, tooltip, ...props }: BadgeProps) {
  if (!tooltip) return <div className={cn(badgeVariants({ variant }), className)} {...props} />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
      </TooltipTrigger>
      <TooltipContent className="bg-background">
        <div className="p-2 text-sm font-normal text-foreground">{tooltip}</div>
      </TooltipContent>
    </Tooltip>
  );
}

export { Badge, badgeVariants };
