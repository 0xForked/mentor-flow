import { useUserStore } from "@/stores/user";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { capitalizeFirstChar } from "@/lib/utils";
import { useMutation } from "react-query";
import { handleError } from "@/lib/http";
import { useAPI } from "@/hooks/useApi";

export const CalendarEventTarget = () => {
  const { availability, setUserAvailability } = useUserStore();
  const { updateAvailability } = useAPI();

  const saveChanges = useMutation(updateAvailability, {
    onSuccess: (resp) => {
      const availabilityData = resp?.data;
      setUserAvailability(availabilityData);
    },
    onError: (error) => handleError(error),
  });

  if (!availability || !availability.installed_apps || !availability.installed_apps.calendars) {
    return <></>;
  }

  if (availability.installed_apps.calendars.length <= 1) {
    return <></>;
  }

  const defaultCalendar = () => availability.installed_apps?.calendars?.find((item) => item.is_default)?.id || "";

  const onTargetCalendarChange = (id: string) => {
    if (!id) return;
    saveChanges.mutate(
      JSON.stringify({
        apps: [
          {
            id: id,
            type: "calendar",
            is_default: true,
          },
        ],
      }),
    );
  };

  return (
    <section className="bg-gray-100 relative rounded-md p-4 mb-4">
      <h5 className="text-md font-semibold">Add to calendar</h5>
      <p className="text-xs text-gray-600 mb-4">Select where to add events when you’re booked.</p>
      <Select defaultValue={defaultCalendar()} onValueChange={(value: string) => onTargetCalendarChange(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Event Target" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {availability.installed_apps.calendars.map((cal, index) => (
              <SelectItem key={index} value={cal.id}>
                {cal.email} ({capitalizeFirstChar(cal.provider)})
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  );
};
