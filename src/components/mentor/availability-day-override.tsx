import { convertToLocalOverideDayFormats } from "@/lib/time";
import { AvailabilityDayOverride, DayOverride } from "@/lib/user";
import { Button } from "../ui/button";
import { Loader2, TrashIcon } from "lucide-react";
import { useAPI } from "@/hooks/useApi";
import { useMutation } from "react-query";
import { useUserMentorStore } from "@/stores/userMentor";
import { handleError } from "@/lib/http";

export const AvailabilityDayOverrideSection = (v: { date: string, days: DayOverride[] }) => {
  const { availability, setUserAvailability } = useUserMentorStore();
  const { deleteAvailabilityDayOverride } = useAPI();

  const deleteOverrideDay = useMutation(deleteAvailabilityDayOverride, {
    onSuccess: (_, variables) => {
      if (!availability?.day_overrides) return;
      const { dayId } = variables;
      const updatedAvailability = { ...availability };
      const updatedDays: AvailabilityDayOverride = {};
      Object.entries(updatedAvailability?.day_overrides || {}).forEach(([dayDate, dayOverrides]) => {
        if (dayDate !== dayId) {
          updatedDays[dayDate] = dayOverrides;
        }
      });
      updatedAvailability.day_overrides = updatedDays;
      setUserAvailability(updatedAvailability);
    },
    onError: (error) => handleError(error),
  });

  const formatDateOverride = (days: DayOverride[]): JSX.Element => {
    const { date, startTime, endTime } = convertToLocalOverideDayFormats(days[0].start_date, days[0].end_date);

    let singleContent;
    if (days.length === 1 && days[0].start_date.includes("T00:00:00Z") && days[0].end_date.includes("T00:00:00Z")) {
      singleContent = (
        <span className="text-gray-600">
          Unavailable
        </span>
      );
    } else {
      singleContent = (
        <span className="text-gray-600 block">
          {`${startTime} – ${endTime}`}
        </span>
      );
    }

    return (
      <div>
        <span>{date}</span> <br />
        {days.length > 1 && days.map((day, index) => {
          const { startTime, endTime } = convertToLocalOverideDayFormats(day.start_date, day.end_date);
          return (
            <span className="text-gray-600 block" key={index}>
              {`${startTime} – ${endTime}`}
            </span>
          );
        })}
        {days.length === 1 && singleContent}
      </div >
    );
  };

  const removeDayOverride = async (dayId: string) => {
    if (!dayId) return;
    deleteOverrideDay.mutate({ dayId });
  };

  return (
    <div className="bg-white p-4 rounded-md flex justify-between items-center">
      {formatDateOverride(v.days)}
      <div>
        <Button
          variant="ghost"
          className="hover:text-red-500"
          onClick={() => removeDayOverride(v.date)}
          disabled={deleteOverrideDay.isLoading}
        >
          {deleteOverrideDay.isLoading
            ? <Loader2 className="w-4 animate-spin mr-1" />
            : <TrashIcon className="w-4 h-4" />
          }
        </Button>
      </div>
    </div>
  )
}
