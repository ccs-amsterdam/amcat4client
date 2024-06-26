"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, LucideChevronsLeft, LucideChevronsRight } from "lucide-react";
import { DayPicker, useNavigation, CaptionProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      today={undefined}
      fixedWeeks
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1 h-48",
        head_row: "flex mb-2",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-0",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: CustomCaption,
        // IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        // IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

function CustomCaption(props: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth, displayMonths } = useNavigation();
  const date = props.displayMonth;
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const monthName = date.toLocaleString("default", { month: "long" });

  const toPreviousYear = () => goToMonth(new Date(year - 1, month));
  const toNextYear = () => goToMonth(new Date(year + 1, month));
  const toTenYearsAgo = () => goToMonth(new Date(year - 10, month));
  const toTenYearsAhead = () => goToMonth(new Date(year + 10, month));

  return (
    <div className="flex select-none flex-col">
      <div className="flex items-center justify-center">
        <LucideChevronsLeft className="h-8 w-8" onClick={toTenYearsAgo} />
        <ChevronLeft className="h-8 w-8" onClick={toPreviousYear} />
        <div className="w-full text-center"> {year}</div>
        <ChevronRight className="h-8 w-8" onClick={toNextYear} />
        <LucideChevronsRight className="h-8 w-8" onClick={toTenYearsAhead} />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-8" />
        <ChevronLeft className="h-8 w-8" onClick={() => previousMonth && goToMonth(previousMonth)} />
        <div className="w-full text-center"> {monthName}</div>
        <ChevronRight className="h-8 w-8 text-right" onClick={() => nextMonth && goToMonth(nextMonth)} />
        <div className="w-8" />
      </div>
    </div>
  );
}

export { Calendar };
