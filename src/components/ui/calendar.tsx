import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-foreground", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold tracking-wide text-foreground/85",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 inline-flex items-center justify-center rounded-md border border-border bg-secondary text-foreground/70 hover:text-foreground hover:bg-secondary/80 transition-colors",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex mt-1",
        head_cell:
          "text-[0.55rem] uppercase tracking-wide font-medium text-muted-foreground w-9 text-center",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day:
          "h-9 w-9 p-0 font-medium text-foreground/75 hover:text-foreground hover:bg-secondary rounded-md transition-colors aria-selected:opacity-100",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground shadow-none hover:bg-primary/90 focus:bg-primary/90",
        day_today:
          "relative text-foreground font-semibold bg-secondary rounded-full ring-1 ring-border",
        day_outside:
          "day-outside text-muted-foreground/50 aria-selected:bg-secondary aria-selected:text-foreground",
        day_disabled: "text-muted-foreground/40",
        day_range_middle: "bg-primary/80 text-primary-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
