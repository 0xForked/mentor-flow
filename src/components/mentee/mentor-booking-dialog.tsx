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
import { useMutation } from "react-query";
import { handleError } from "@/lib/http";
import { useAPI } from "@/hooks/useApi";
import { Slots } from "@/lib/user";
import { convertToTimeFormats, getMonthEndTimes } from "@/lib/time";

export const MentorBookingDialog = () => {
  const [open, setOpen] = useState(false);
  const { states, setState } = useGlobalStateStore();
  const { selectedMentor, setSelectedMentor, setAvailabilitySlots, availabilitySlots } = useUserMenteeStore();
  const { getMentorAvailbilitySlots } = useAPI();
  const { locale } = useLocale();
  const [date, setDate] = useState(today(getLocalTimeZone()));
  const [focusedDate, setFocusedDate] = useState<CalendarDate | null>(date);
  const [timezone, setTimezone] = useState(getLocalTimeZone());
  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);
  const [slots, setSlots] = useState<{ "12": string; "24": string; "full": string }[]>([]);
  const [currentMonth, setCurrentMonth] = useState<number>(date.month);
  // const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const mentorAvailability = useMutation(getMentorAvailbilitySlots, {
    onSuccess: (resp) => setAvailabilitySlots(resp?.data),
    onError: (error) => handleError(error),
    retry: false,
  });

  const getAvailabilitySlots = (endOfPrevMonth: string, endOfCurrMonth: string) => {
    if (!selectedMentor) return;
    mentorAvailability.mutate({
      userId: selectedMentor.id,
      timezone: timezone,
      dateRange: `${endOfPrevMonth},${endOfCurrMonth}`
    });
  }

  useEffect(() => {
    setOpen(states[GlobalStateKey.MentorCalendarDialog])
    if (open && focusedDate && !availabilitySlots) {
      const { endOfPrevMonth, endOfCurrMonth } = getMonthEndTimes(date.month, date.year);
      getAvailabilitySlots(endOfPrevMonth, endOfCurrMonth)
      generateSlot(focusedDate)
    }
  }, [open, states, focusedDate, availabilitySlots]);

  const handleDateChange = (date: DateValue) => {
    const newDate = date as CalendarDate;
    setDate(newDate);
    onMonthChange(newDate);
    generateSlot(newDate);
  };

  const handleAvailableTimeChange = (time: string) =>
    console.log(time);

  const handleFocusChange = (selectedDate: DateValue) =>
    setFocusedDate(selectedDate as CalendarDate);

  const onMonthChange = (newDate: DateValue) => {
    if (newDate.month === currentMonth) return;
    const { endOfPrevMonth, endOfCurrMonth } = getMonthEndTimes(newDate.month, newDate.year);
    getAvailabilitySlots(endOfPrevMonth, endOfCurrMonth);
    setCurrentMonth(newDate.month);
  }

  const generateSlot = (newDate: DateValue) => {
    const selectedDateStr = formatedDate(newDate);
    const data: Slots | null | undefined = availabilitySlots?.slots;
    if (data && data[selectedDateStr]) {
      setSlots(data[selectedDateStr].map(entry => convertToTimeFormats(entry.time)));
      // setAvailableSlots(Object.keys(data))
    } else {
      setSlots([])
    }
  }

  const formatedDate = (newDate: DateValue) => {
    const y = newDate.year;
    const m = newDate.month.toString().padStart(2, '0');
    const d = newDate.day.toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // const isDateUnavailable = (date: DateValue) => {
  //   if (!slots && !availableSlots) return false;
  //   return !availableSlots.includes(formatedDate(date))
  // }

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
          {(mentorAvailability.isLoading && !availabilitySlots) ? <>Loading . . .</> : <div className="flex gap-6">
            <MentorCalendarLeftSide mentor={selectedMentor} timezone={timezone} setTimezone={setTimezone} />
            <Calendar
              minValue={today(getLocalTimeZone())}
              defaultValue={today(getLocalTimeZone())}
              value={date}
              onChange={handleDateChange}
              onFocusChange={(focused) => handleFocusChange(focused)}
            // isDateUnavailable={isDateUnavailable}
            />
            <MentorCalendarRightSide {...{ date, timezone, weeksInMonth, handleAvailableTimeChange, slots }} />
          </div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
