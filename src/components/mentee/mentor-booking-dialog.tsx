import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalStateKey } from "@/lib/enums";
import { useGlobalStateStore } from "@/stores/state";
import { useUserMenteeStore } from "@/stores/userMentee";
import { useEffect, useState } from "react";
import { useLocale } from "@react-aria/i18n";
import { type CalendarDate, getLocalTimeZone, getWeeksInMonth, today } from "@internationalized/date";
import type { DateValue } from "@react-aria/calendar";
import { Calendar } from "@/components/ui/calendar";
import { MentorCalendarLeftSide } from "./mentor-calendar-left-side";
import { MentorCalendarRightSide } from "./mentor-calendar-right-side";

export const MentorBookingDialog = () => {
  const [open, setOpen] = useState(false);
  const { states, setState } = useGlobalStateStore();
  const { selectedMentor, setSelectedMentor } = useUserMenteeStore();
  const { locale } = useLocale();
  const [date, setDate] = useState(today(getLocalTimeZone()));
  const [focusedDate, setFocusedDate] = useState<CalendarDate | null>(date);
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const [tz, setTimeZone] = useState(timeZone);

  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);

  useEffect(() => {
    setOpen(states[GlobalStateKey.MentorCalendarDialog]);
  }, [states, focusedDate]);

  if (selectedMentor) {
    // call api
  }

  const handleDateChange = (date: DateValue) => {
    setDate(date as CalendarDate);
    console.log(date.toDate(tz).toISOString().split("T")[0]);
  };

  const handleAvailableTimeChange = (time: string) => {
    console.log(time);
  };

  const handleFocusChange = (date: DateValue) => {
    setFocusedDate(date as CalendarDate);
    console.log(date.month);
    // when it change, validate its different month, if yes get the data
    // based on last month end date and current month end date
    // then call the slots endpoint.
  };

  const onOpenStateChange = () => {
    setOpen(!open);
    setSelectedMentor(null);
    setState(GlobalStateKey.MentorCalendarDialog, false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenStateChange}>
      <DialogContent className="max-w-max w-10/12 divide-y-2 gap-4">
        <DialogHeader>
          <DialogTitle>Mentor Availability Slots </DialogTitle>
          <DialogDescription>
            Set your preferred date and time for a session with @{selectedMentor?.username}.
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-full w-full">
          <div className="flex gap-6">
            <MentorCalendarLeftSide mentor={selectedMentor} timeZone={tz} setTimeZone={setTimeZone} />
            <Calendar
              minValue={today(getLocalTimeZone())}
              defaultValue={today(getLocalTimeZone())}
              value={date}
              onChange={handleDateChange}
              onFocusChange={(focused) => handleFocusChange(focused)}
            />
            <MentorCalendarRightSide {...{ date, tz, weeksInMonth, handleAvailableTimeChange }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
