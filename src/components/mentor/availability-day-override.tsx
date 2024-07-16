import { convertToLocalOverideDayFormats } from "@/lib/time";
import { AvailabilityDayOverride } from "@/lib/user";
import { Button } from "../ui/button";
import { Loader2, TrashIcon } from "lucide-react";
import { useAPI } from "@/hooks/useApi";
import { useMutation } from "react-query";
import { useUserMentorStore } from "@/stores/userMentor";
import { handleError } from "@/lib/http";

export const AvailabilityDayOverrideSection = (v: { day: AvailabilityDayOverride }) => {
  const { availability, setUserAvailability } = useUserMentorStore();
  const { deleteAvailabilityDayOverride } = useAPI();

  const deleteOverrideDay = useMutation(deleteAvailabilityDayOverride, {
    onSuccess: (_, variables) => {
      if (!availability?.day_overrides) return;
      const { dayId } = variables;
      const updatedAvailability = { ...availability };
      const updatedDays = updatedAvailability?.day_overrides?.filter((day) => day.id !== dayId);
      updatedAvailability.day_overrides = updatedDays;
      setUserAvailability(updatedAvailability);
    },
    onError: (error) => handleError(error),
  });

  const formatDateOverride = (startISOTime: string, endISOTime: string): JSX.Element => {
    const { date, startTime, endTime } = convertToLocalOverideDayFormats(startISOTime, endISOTime);
    return (
      <div>
        <span>{date}</span> <br />
        <span className="text-gray-600">
          {startISOTime === endISOTime ? "Unavailable" : `${startTime} – ${endTime}`}
        </span>
      </div>
    );
  };

  const removeDayOverride = async (dayId: string) => {
    if (!dayId) return;
    deleteOverrideDay.mutate({ dayId });
  };

  return (
    <div className="bg-white p-4 rounded-md flex justify-between">
      {formatDateOverride(v.day.start_date, v.day.end_date)}
      <div>
        <Button
          variant="ghost"
          className="hover:text-red-500"
          onClick={() => removeDayOverride(v.day.id)}
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
