import { useGlobalStateStore } from "@/stores/state";
import { useUserMenteeStore } from "@/stores/userMentee";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { convertToLocalDateTimeRangeFormats } from "@/lib/time";
import { GlobalStateKey } from "@/lib/enums";

export function BookingDetailsSheet() {
  const [open, setOpen] = useState(false);
  const { states, setState } = useGlobalStateStore();
  const { selectedSchedule, setSelectedSchedule } = useUserMenteeStore();

  useEffect(() => {
    if (selectedSchedule && states[GlobalStateKey.DisplayMenteeBookingDetail]) {
      setOpen(true);
    }
  }, [selectedSchedule, states]);

  if (!selectedSchedule) return;

  const { date, startTime, endTime } = convertToLocalDateTimeRangeFormats(
    selectedSchedule.datetime_string,
    selectedSchedule.session_interval,
  );

  const handleClose = () => {
    setOpen(false);
    setSelectedSchedule(null);
    setState(GlobalStateKey.DisplayMenteeBookingDetail, false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Event Detail</SheetTitle>
          <SheetDescription>
            {selectedSchedule?.summary} <br className="mb-2" />
            {date} {startTime} - {endTime}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">{selectedSchedule.description}</div>
        <SheetFooter className="flex flex-row">
          <Button variant="destructive">Request Cancel</Button>
          <Button>Reschedule</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
