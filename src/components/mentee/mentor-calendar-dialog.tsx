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
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const MentorCalendarDialog = () => {
  const [open, setOpen] = useState(false);
  const { states, setState } = useGlobalStateStore();
  const { selectedMentor, setSelectedMentor } = useUserMenteeStore();
  const { locale } = useLocale();
  const [date, setDate] = useState(today(getLocalTimeZone()));
  const [focusedDate, setFocusedDate] = useState<CalendarDate | null>(date);
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const [tz, setTimeZone] = useState(timeZone);

  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);

  useEffect(() => setOpen(states[GlobalStateKey.MentorCalendarDialog]), [states]);

  if (selectedMentor) {
    // call api
  }

  const handleDateChange = (date: DateValue) => {
    setDate(date as CalendarDate);
    console.log(date.toDate(tz).toISOString().split("T")[0]);
  };

  const handleAvailableTimeChange = (time: string) => {
    const timeValue = time.split(":").join(" ");
    const match = timeValue.match(/^(\d{1,2}) (\d{2})([ap]m)?$/i);
    if (!match) {
      console.error("Invalid time format");
      return null;
    }
    let hours = Number.parseInt(match[1]);
    const minutes = Number.parseInt(match[2]);
    const isPM = match[3] && match[3].toLowerCase() === "pm";
    if (isPM && (hours < 1 || hours > 12)) {
      return null;
    }
    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }
    const currentDate = date.toDate(timeZone);
    currentDate.setHours(hours, minutes);
    console.log(currentDate);
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
            Set your preferred date, time, and timezone for a session with @{selectedMentor?.username}
          </DialogDescription>
        </DialogHeader>
        {/* <section className="min-h-full grid grid-cols-4 divide-x-[2px]">
          <div className="px-2 flex flex-col gap-2">
            <Avatar className="mb-2 h-8 w-8 text-xs">
              <AvatarImage />
              <AvatarFallback>{selectedMentor?.username?.substring(0, 2).toUpperCase() ?? "-"}</AvatarFallback>
            </Avatar>
          </div>
          {selectedMentor?.username} {timeZone}
          <div className="px-2"></div>
        </section> */}
        <div className="max-w-full w-full">
          <div className="flex gap-6">
            <MentorCalendarLeftSide timeZone={tz} setTimeZone={setTimeZone} />
            <Calendar
              minValue={today(getLocalTimeZone())}
              defaultValue={today(getLocalTimeZone())}
              value={date}
              onChange={handleDateChange}
              onFocusChange={(focused) => setFocusedDate(focused)}
            />
            <MentorCalendarRightSide {...{ date, tz, weeksInMonth, handleAvailableTimeChange }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
