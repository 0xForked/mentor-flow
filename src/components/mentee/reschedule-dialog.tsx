import { GlobalStateKey } from "@/lib/enums";
import { useGlobalStateStore } from "@/stores/state";
import { Dialog } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserMenteeStore } from "@/stores/userMentee";
import { RescheduleMentorProfile } from "./reschedule-right-side";
import { CalendarDate, DateValue, getLocalTimeZone, getWeeksInMonth, today } from "@internationalized/date";
import { Calendar } from "../ui/calendar";
import { CalendarTimeSlots } from "./calendar-time-slots";
import { convertToLocalTimeFormats, getMonthEndTimes } from "@/lib/time";
import { Slots } from "@/lib/user";
import { useLocale } from "@react-aria/i18n";
import { useMutation, useQueryClient } from "react-query";
import { useAPI } from "@/hooks/useApi";
import { handleError } from "@/lib/http";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const RescheduleBookingFormSchema = z.object({
  reason: z.optional(z.string()),
});

export const RescheduleBookingDialog = () => {
  const [open, setOpen] = useState(false);
  const { states, stringState, setState } = useGlobalStateStore();
  const { getMentorAvailbilitySlots, requestRescheduleBooking } = useAPI();
  const { selectedSchedule, availabilitySlots, blockDays, availableDates, setAvailabilitySlots } = useUserMenteeStore();
  const [timezone, setTimezone] = useState(getLocalTimeZone());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [date, setDate] = useState(today(getLocalTimeZone()));
  const [slots, setSlots] = useState<{ "12": string; "24": string; full: string }[]>([]);
  const [focusedDate, setFocusedDate] = useState<CalendarDate | null>(date);
  const { locale } = useLocale();
  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);
  const [currentMonth, setCurrentMonth] = useState<number>(date.month);
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof RescheduleBookingFormSchema>>({
    resolver: zodResolver(RescheduleBookingFormSchema),
  });

  const mentorAvailability = useMutation(getMentorAvailbilitySlots, {
    onSuccess: (resp) => setAvailabilitySlots(resp?.data),
    onError: (error) => handleError(error),
    retry: false,
  });

  const getAvailabilitySlots = (endOfPrevMonth: string, endOfCurrMonth: string) => {
    if (!selectedSchedule) return;
    mentorAvailability.mutate({
      userId: selectedSchedule.mentor_data.id,
      timezone: timezone,
      dateRange: `${endOfPrevMonth},${endOfCurrMonth}`,
    });
  };

  const rescheduleBooking = useMutation(requestRescheduleBooking, {
    onSuccess: () => {
      toast.dismiss();
      queryClient.invalidateQueries('bookings');
      onOpenStateChange()
      setState(GlobalStateKey.DisplayMenteeBookingDetail, false);
    },
    onError: (error) => handleError(error),
  });

  useEffect(() => {
    setOpen(states[GlobalStateKey.RescheduleCalendarDialog]);
    if (open && !availabilitySlots && focusedDate) {
      const { endOfPrevMonth, endOfCurrMonth } = getMonthEndTimes(focusedDate.month, focusedDate.year);
      getAvailabilitySlots(endOfPrevMonth, endOfCurrMonth);
      generateSlot(focusedDate);
    }
    if (focusedDate && focusedDate.month !== currentMonth) {
      onMonthChange(focusedDate);
      generateSlot(focusedDate);
    }
  }, [open, states, stringState, availabilitySlots, focusedDate, selectedSchedule]);

  const handleDateChange = (date: DateValue) => {
    const newDate = date as CalendarDate;
    setDate(newDate);
    generateSlot(newDate);
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

  const formatDate = (newDate: DateValue) => {
    const m = newDate.month.toString().padStart(2, "0");
    const d = newDate.day.toString().padStart(2, "0");
    return `${newDate.year}-${m}-${d}`;
  };

  const isDateUnavailable = (date: DateValue) => {
    const dateStr = formatDate(date);
    return (
      (availableDates.length > 1 && !availableDates.includes(dateStr)) ||
      (blockDays.length > 1 && blockDays.includes(date.toDate(timezone).getDay()))
    );
  };

  const onRescheduleSubmited = (data: z.infer<typeof RescheduleBookingFormSchema>) => {
    if (!selectedSchedule) return;
    if (!selectedTime) {
      alert("Please select time");
      return;
    }
    rescheduleBooking.mutate({
      id: selectedSchedule?.id, body: JSON.stringify({
        "booking_id": selectedSchedule.id,
        "mentor_id": selectedSchedule.mentor_data.id,
        "time": selectedTime,
        "reason": data.reason,
      })
    });
  }

  const onOpenStateChange = () => {
    setOpen(!open);
    setState(GlobalStateKey.RescheduleCalendarDialog, false);
    setAvailabilitySlots(null);
    setSelectedTime(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenStateChange}>
      <DialogContent className="max-w-max w-10/12 divide-y-2 gap-4">
        <DialogHeader>
          <DialogTitle>Reschedule Booking</DialogTitle>
          <DialogDescription>Set your preferred date and time for a session with {selectedSchedule?.mentor_data?.name}.</DialogDescription>
        </DialogHeader>
        <div className="flex gap-6">
          <RescheduleMentorProfile
            mentor={selectedSchedule?.mentor_data}
            timezone={timezone}
            setTimezone={setTimezone}
            interval={selectedSchedule?.session_interval ?? 30}
            time={selectedTime}
            prevTime={selectedSchedule?.datetime_string ?? null}
          />
          {!selectedTime ? (
            <>
              <Calendar
                minValue={today(getLocalTimeZone())}
                onChange={handleDateChange}
                onFocusChange={(focused) => setFocusedDate(focused)}
                isDateUnavailable={isDateUnavailable}
              />
              <CalendarTimeSlots {...{ date, timezone, weeksInMonth, setSelectedTime, slots }} />
            </>
          ) : (
            <div className="flex flex-col gap-4 w-[380px] pt-4">
              <Form {...form}>
                <form className="flex flex-col w-full h-full" onSubmit={form.handleSubmit(onRescheduleSubmited)}>
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reschedule reason</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please share anything that will help prepare for our meeting!"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="absolute bottom-6 right-6 flex gap-4">
                    <Button variant="ghost" type="button" onClick={() => setSelectedTime(null)}>
                      Back
                    </Button>
                    <Button type="submit" disabled={rescheduleBooking.isLoading}>
                      {rescheduleBooking.isLoading && <Loader2 className="w-4 animate-spin mr-1" />}
                      Continue
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
