import { useGlobalStateStore } from "@/stores/state";
import { useUserMenteeStore } from "@/stores/userMentee";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { convertToLocalDateTimeRangeFormats } from "@/lib/time";
import { GlobalStateKey } from "@/lib/enums";
import { CancelBookingFormForm } from "./cancel-booking-form";
import { getLocalTimeZone } from "@internationalized/date";
import { useQueryClient } from "react-query";
import { toast } from "sonner";

export function BookingDetailsSheet() {
  const [open, setOpen] = useState(false);
  const { states, setState } = useGlobalStateStore();
  const { selectedSchedule, setSelectedSchedule } = useUserMenteeStore();
  const [displayCancelForm, setDisplayCancelForm] = useState(false);
  const queryClient = useQueryClient()

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

  const handleSubmitCancel = () => {
    toast.dismiss();
    queryClient.invalidateQueries('bookings');
    handleClose();
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="left" className="min-w-max w-[500px]">
        <SheetHeader>
          <SheetTitle>Upcomming event</SheetTitle>
          <SheetDescription>
            Details of the selected meeting schedule
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-full py-8 relative">
          <h1 className="text-lg font-semibold">What?</h1 >
          <p className="text-gray-500 text-sm">{selectedSchedule?.summary}</p>

          <h1 className="text-lg font-semibold mt-4 mb-2">When?</h1>
          <p className="text-gray-500 text-sm">{date} | {startTime} - {endTime} ({getLocalTimeZone()})</p>

          <h1 className="text-lg font-semibold mt-4  mb-2">Who?</h1>
          <p className="text-gray-500 text-sm">1. {selectedSchedule.mentor_data.name}</p>
          <p className="text-gray-500 text-sm">2. {selectedSchedule.mentee_data.name}</p>

          <h1 className="text-lg font-semibold mt-4 mb-2">Where?</h1>
          <a href={selectedSchedule.meeting_url} target="_blank" className="text-gray-500 text-sm underline">
            Google Meet
          </a>
          <p className="text-gray-500 text-sm mt-2">
            Meeting URL: {" "}
            <a href={selectedSchedule.meeting_url} target="_blank" className="text-gray-500 text-sm underline">
              {selectedSchedule.meeting_url}
            </a>
          </p>

          <h1 className="text-lg font-semibold mt-4 mb-2">Additional notes</h1>
          <p className="text-gray-500 text-sm">{selectedSchedule.additional_notes}</p>

          {displayCancelForm && <div className="mt-8">
            <CancelBookingFormForm
              bookingId={selectedSchedule.id}
              cancel={() => setDisplayCancelForm(false)}
              submit={handleSubmitCancel}
            />
          </div>}
          {!displayCancelForm && <div className="flex justify-between mt-8">
            <Button variant="destructive" onClick={() => setDisplayCancelForm(true)}>Request Cancel</Button>
            <Button onClick={console.log}>Reschedule</Button >
          </div>}
        </div>
      </SheetContent>
    </Sheet>
  );
}
