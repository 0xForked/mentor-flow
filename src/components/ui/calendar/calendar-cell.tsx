import { cn } from "@/lib/utils";
import { type CalendarDate, getLocalTimeZone, isSameMonth, isToday } from "@internationalized/date";
import { useCalendarCell } from "@react-aria/calendar";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import type { CalendarState } from "@react-stately/calendar";
import { useRef } from "react";

export function CalendarCell({
  state,
  date,
  currentMonth,
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { cellProps, buttonProps, isSelected, isDisabled, isUnavailable, formattedDate } = useCalendarCell({ date }, state, ref);
  const isOutsideMonth = !isSameMonth(currentMonth, date);
  const isDateToday = isToday(date, getLocalTimeZone());
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <td {...cellProps} className={cn("py-1 relative px-1", isFocusVisible ? "z-10" : "z-0")}>
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideMonth}
        className="size-14 outline-none group rounded-md"
      >
        <div
          className={cn(
            "size-full rounded-md flex items-center justify-center",
            "text-gray-900 text-sm font-semibold",
            isDisabled || isUnavailable ? (isDateToday ? "cursor-defaut" : "text-gray-400 cursor-defaut") : "cursor-pointer bg-gray-100",
            isFocusVisible && "ring-1 group-focus:z-2 ring-gray-900 ring-offset-1",
            isSelected && "bg-gray-900 text-gray-50",
            !isSelected && !isDisabled && !isUnavailable && "hover:ring-2 hover:ring-gray-900",
          )}
        >
          {formattedDate}
          {isDateToday && (
            <div
              className={cn(
                "absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-1/2 size-1 bg-gray-900 rounded-full",
                isSelected && "bg-gray-50",
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
}
