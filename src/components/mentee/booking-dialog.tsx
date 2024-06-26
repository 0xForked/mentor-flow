import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalStateKey } from "@/lib/enums";
import { useGlobalStateStore } from "@/stores/state";
import { useUserMenteeStore } from "@/stores/userMentee";
import { useEffect, useState } from "react";
import { useLocale } from "@react-aria/i18n";
import { type CalendarDate, getLocalTimeZone, getWeeksInMonth, today } from "@internationalized/date";
import type { DateValue } from "@react-aria/calendar";
import { Calendar } from "@/components/ui/calendar";
import { CalendarMentorProfile } from "./calendar-mentor-profile";
import { CalendarTimeSlots } from "./calendar-time-slots";
import { useMutation } from "react-query";
import { handleError } from "@/lib/http";
import { useAPI } from "@/hooks/useApi";
import { Slots } from "@/lib/user";
import { convertToLocalTimeFormats, getMonthEndTimes } from "@/lib/time";
import { CalendarBookingForm } from "./calendar-booking-form";

export const MentorBookingDialog = () => {
  const [open, setOpen] = useState(false);
  const { states, setState } = useGlobalStateStore();
  const { selectedMentor, setSelectedMentor, setAvailabilitySlots, availabilitySlots, blockDays, availableDates } =
    useUserMenteeStore();
  const { getMentorAvailbilitySlots } = useAPI();
  const { locale } = useLocale();
  const [date, setDate] = useState(today(getLocalTimeZone()));
  const [focusedDate, setFocusedDate] = useState<CalendarDate | null>(date);
  const [timezone, setTimezone] = useState(getLocalTimeZone());
  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);
  const [slots, setSlots] = useState<{ "12": string; "24": string; full: string }[]>([]);
  const [currentMonth, setCurrentMonth] = useState<number>(date.month);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
      dateRange: `${endOfPrevMonth},${endOfCurrMonth}`,
    });
  };

  useEffect(() => {
    setOpen(states[GlobalStateKey.MentorCalendarDialog]);
    if (open && focusedDate) {
      const { endOfPrevMonth, endOfCurrMonth } = getMonthEndTimes(focusedDate.month, focusedDate.year);
      getAvailabilitySlots(endOfPrevMonth, endOfCurrMonth);
      generateSlot(focusedDate);
    }
    if (focusedDate && focusedDate.month !== currentMonth) {
      onMonthChange(focusedDate);
      generateSlot(focusedDate);
    }
  }, [open, states, focusedDate, currentMonth]);

  const handleDateChange = (date: DateValue) => {
    const newDate = date as CalendarDate;
    setDate(newDate);
    generateSlot(newDate);
  };

  const handleAvailableTimeChange = (time: string) => {
    console.log(time);
    setSelectedTime(time);
  };

  const handleFocusChange = (selectedDate: DateValue) => {
    setFocusedDate(selectedDate as CalendarDate);
  };

  const onMonthChange = (newDate: DateValue) => {
    if (newDate.month === currentMonth) return;
    const { endOfPrevMonth, endOfCurrMonth } = getMonthEndTimes(newDate.month, newDate.year);
    getAvailabilitySlots(endOfPrevMonth, endOfCurrMonth);
    setCurrentMonth(newDate.month);
  };

  const generateSlot = (newDate: DateValue) => {
    const selectedDateStr = formatDate(newDate);
    const data: Slots | null | undefined = availabilitySlots?.slots;
    if (data && data[selectedDateStr]) {
      setSlots(data[selectedDateStr].map((entry) => convertToLocalTimeFormats(entry.time)));
    } else {
      setSlots([]);
    }
  };

  const isDateUnavailable = (date: DateValue) => {
    const dateStr = formatDate(date);
    return (
      (availableDates.length > 1 && !availableDates.includes(dateStr)) ||
      (blockDays.length > 1 && blockDays.includes(date.toDate(timezone).getDay()))
    );
  };

  const formatDate = (newDate: DateValue) => {
    const m = newDate.month.toString().padStart(2, "0");
    const d = newDate.day.toString().padStart(2, "0");
    return `${newDate.year}-${m}-${d}`;
  };

  const onOpenStateChange = () => {
    setOpen(!open);
    setSelectedMentor(null);
    setAvailabilitySlots(null);
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
          {mentorAvailability.isLoading && !availabilitySlots ? (
            <p className="mx-auto w-fit">Loading . . .</p>
          ) : (
            <div className="flex gap-6">
              <CalendarMentorProfile
                mentor={selectedMentor}
                timezone={timezone}
                setTimezone={setTimezone}
                apps={availabilitySlots?.availability?.installed_apps}
                interval={availabilitySlots?.interval ?? 30}
                time={selectedTime}
              />
              {!selectedTime ? (
                <>
                  <Calendar
                    minValue={today(getLocalTimeZone())}
                    defaultValue={today(getLocalTimeZone())}
                    value={date}
                    onChange={handleDateChange}
                    onFocusChange={(focused) => handleFocusChange(focused)}
                    isDateUnavailable={isDateUnavailable}
                  />
                  <CalendarTimeSlots {...{ date, timezone, weeksInMonth, handleAvailableTimeChange, slots }} />
                </>
              ) : (
                <CalendarBookingForm back={() => setSelectedTime(null)} />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
