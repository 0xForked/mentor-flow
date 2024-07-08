import { useAPI } from "@/hooks/useApi";
import { handleError, HttpResponse, HttpResponseList } from "@/lib/http";
import { Booking, User } from "@/lib/user";
import { useUserMenteeStore } from "@/stores/userMentee";
import { useQuery } from "react-query";
import { MentorList } from "@/components/mentee/mentor-list";
import { Button } from "@/components/ui/button";
import { CircleX, Calendar, XIcon } from "lucide-react";
import { MentorBookingDialog } from "./booking-dialog";
import { toast } from "sonner";
import { convertToLocalDateTimeRangeFormats } from "@/lib/time";
import { useGlobalStateStore } from "@/stores/state";
import { GlobalStateKey } from "@/lib/enums";
import { BookingDetailsSheet } from "./booking-detail-sheet";
import { RescheduleBookingDialog } from "./reschedule-dialog";

export const MenteeContainer = () => {
  const { getMentors, getMenteeSchedules } = useAPI();
  const { setMentors, setSelectedSchedule } = useUserMenteeStore();
  const { setState } = useGlobalStateStore();

  const mentors = useQuery<HttpResponse<HttpResponseList<User>>>("mentors", getMentors, {
    onSuccess: (resp) => setMentors(resp?.data?.list || []),
    onError: (error) => handleError(error),
    retry: false,
  });

  useQuery<HttpResponse<HttpResponseList<Booking>>>("bookings", getMenteeSchedules, {
    onSuccess: (resp) => {
      resp?.data?.list?.forEach((schedule) => {
        const { date, startTime, endTime } = convertToLocalDateTimeRangeFormats(schedule.datetime_string, schedule.session_interval);
        toast.custom(
          (t) => (
            <a href="#" onClick={() => displayScheduleDetail(schedule)} className="flex gap-2 p-4 rounded-lg bg-gray-950 text-gray-300">
              <Calendar className="w-6 h-6" />
              <div className="w-full">
                <h1 className="text-sm font-bold">Upcomming event</h1>
                <p className="text-gray-400 text-xs font-normal">
                  {schedule.summary} on {date} {startTime} - {endTime}
                </p>
              </div>
              <XIcon className="w-6 h-6" onClick={() => toast.dismiss(t)} />
            </a>
          ),
          {
            duration: Infinity,
          },
        );
      });
    },
    onError: (error) => handleError(error),
    retry: false,
  });

  const displayScheduleDetail = (schedule: Booking) => {
    setSelectedSchedule(schedule);
    setState(GlobalStateKey.DisplayMenteeBookingDetail, true);
  };

  if (mentors.isError || mentors.isLoading) {
    return (
      <main className="w-full">
        {mentors.isError && (
          <div className="flex flex-col">
            <CircleX className="h-14 w-14 mx-auto" />
            <h5 className="text-md font-semibold mx-auto mt-2">Error</h5>
            <p className="text-sm font-light mx-auto mb-4 text-center">Something went wrong!</p>
            <Button className="w-40 mx-auto" variant="link" onClick={() => mentors.refetch()}>
              Retry
            </Button>
          </div>
        )}
        {mentors.isLoading && <p className="w-fit mx-auto">Loading . . .</p>}
      </main>
    );
  }

  return (
    <div className="container xl:max-w-6xl mx-auto px-4">
      <div className="flex flex-col mb-12">
        <h5 className="text-lg font-semibold mx-auto mt-2">Available Mentors</h5>
        <p className="text-md font-light mx-auto mb-4 text-center">Find Your Mentor, Click to Schedule a Session!</p>
      </div>
      <MentorList />
      <MentorBookingDialog />
      <BookingDetailsSheet />
      <RescheduleBookingDialog />
    </div>
  );
};
