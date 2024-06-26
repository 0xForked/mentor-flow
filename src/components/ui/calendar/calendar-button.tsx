import { cn } from "@/lib/utils";
import { type AriaButtonProps, useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import type { CalendarState } from "@react-stately/calendar";
import { useRef } from "react";

export function Button(
  props: AriaButtonProps<"button"> & {
    state?: CalendarState;
    side?: "left" | "right";
  },
) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={cn(
        "p-2 rounded-lg outline-none text-gray-900",
        props.isDisabled ? "text-gray-500" : "hover:bg-gray-300 active:bg-gray-400",
        isFocusVisible && "ring-2 ring-offset-2 ring-gray-800",
      )}
    >
      {props.children}
    </button>
  );
}
