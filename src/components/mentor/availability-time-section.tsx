import { AvailabilityDay, ExtendTime } from "@/lib/user";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { timeReference } from "@/lib/reference";
import { Skeleton } from "@/components/ui/skeleton";
import { addOneHour, intToTime, strTimeToInt } from "@/lib/time";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { handleError } from "@/lib/http";
import { useUserMentorStore } from "@/stores/userMentor";
import { useAPI } from "@/hooks/useApi";
import { useGlobalStateStore } from "@/stores/state";
import { useMutation } from "react-query";
import { GlobalStateKey } from "@/lib/enums";

interface Props {
  dayId: string;
  item: AvailabilityDay | ExtendTime;
  itemType: string;
}

export const AvailabilityTimeSection = (v: Props) => {
  const { availability, setUserAvailability } = useUserMentorStore();
  const { updateAvailability } = useAPI();
  const { states, setState, cleanState } = useGlobalStateStore();

  const saveChanges = useMutation(updateAvailability, {
    onSuccess: (resp) => {
      const availabilityData = resp?.data;
      setUserAvailability(availabilityData);
      cleanState();
    },
    onError: (error) => {
      handleError(error);
      cleanState();
    },
  });

  const onTimeValueChange = async (id: string, type: string, key: string, val: string) => {
    if (!id && !val) return;

    setState(GlobalStateKey.UpdateAvailabilityData, true);
    setState(`select_${id}_${key}`, true);

    const availabilityDay = findAvailabilityDay();
    if (!availabilityDay) return;

    let error = null;
    if (type === "main") {
      error = handleMainTypeChange(availabilityDay, id, key, val);
    } else if (type === "extend") {
      error = handleExtendTypeChange(availabilityDay, id, key, val);
    }

    if (error !== null) {
      displayErrorMessage(error.message);
      // TODO: Revert to previous value, before return.
      return;
    }

    saveChanges.mutate(JSON.stringify({ days: [availabilityDay] }));
  };

  const findAvailabilityDay = (): AvailabilityDay | null | undefined => {
    const availabilityDay = availability?.days?.find((day) => day.id === v.dayId);
    if (!availabilityDay) {
      displayErrorMessage("Availability day not found!");
    }
    return availabilityDay;
  };

  const handleMainTypeChange = (
    availabilityDay: AvailabilityDay,
    itemId: string,
    key: string,
    val: string,
  ): Error | null => {
    if (key === "start_time") {
      availabilityDay.start_time = strTimeToInt(val);
      if (availabilityDay.start_time >= availabilityDay.end_time) {
        adjustEndTime(availabilityDay, itemId);
        updateExtendTimes(availabilityDay);
      }
    }

    if (key === "end_time") {
      const timeValue = strTimeToInt(val);
      if (timeValue <= availabilityDay.start_time) {
        return new Error("End time cannot be earlier than or equal to start time.");
      }
      availabilityDay.end_time = timeValue;
      updateExtendTimes(availabilityDay);
    }

    return null;
  };

  const handleExtendTypeChange = (
    availabilityDay: AvailabilityDay,
    itemId: string,
    key: string,
    val: string,
  ): Error | null => {
    if (!availabilityDay.extend_times || availabilityDay.extend_times.length === 0) {
      return new Error("Theres no extend time.");
    }

    const extendTime = availabilityDay.extend_times.find((time) => time.id === itemId);
    if (!extendTime) {
      return new Error("Extend time not found.");
    }

    if (key === "start_time") {
      const startTime = strTimeToInt(val);
      if (startTime < availabilityDay.end_time) {
        return new Error("Extend start time cannot be earlier than main start time.");
      }

      // Check against previous extend time's end_time
      const extendTimeIndex = availabilityDay.extend_times?.findIndex((time) => time.id === itemId);
      const prevExtendTime = availabilityDay.extend_times[extendTimeIndex - 1];
      if (prevExtendTime && prevExtendTime.end_time > startTime) {
        return new Error("Extend start time cannot be earlier than previous end time.");
      }

      // Update start_time
      extendTime.start_time = startTime;

      // Adjust extend time if start_time is greater than or equal to end_time
      if (extendTime.start_time >= extendTime.end_time) {
        adjustExtendEndTime(extendTime, itemId);
        updateSubsequentExtendTimes(availabilityDay, itemId);
      }
    }

    if (key === "end_time") {
      const timeValue = strTimeToInt(val);
      if (timeValue <= extendTime.start_time) {
        return new Error("End time cannot be earlier than or equal to start time.");
      }
      extendTime.end_time = timeValue;
      updateSubsequentExtendTimes(availabilityDay, itemId);
    }

    return null;
  };

  const adjustEndTime = (availabilityDay: AvailabilityDay, itemId: string) => {
    setState(`select_${itemId}_end_time`, true);
    availabilityDay.end_time = addOneHour(availabilityDay.start_time);
    toast({
      title: "Adjusted End Time",
      description: "End time was adjusted due to start time change.",
    });
  };

  /**
   * If main day has extend times and the adjusted end_time is greater than
   * extend_time.start_time, update the next extend time:
   * - Set extend start_time to main end_time.
   * - Set extend end_time to extend start_time + 1 hour.
   */
  const updateExtendTimes = (availabilityDay: AvailabilityDay) => {
    if (availabilityDay.extend_times && availabilityDay.extend_times.length > 0) {
      let previousEndTime = availabilityDay.end_time;
      availabilityDay.extend_times.forEach((extendTime) => {
        if (previousEndTime > extendTime.start_time) {
          setState(`select_${extendTime.id}_start_time`, true);
          extendTime.start_time = previousEndTime;
          setState(`select_${extendTime.id}_end_time`, true);
          extendTime.end_time = addOneHour(extendTime.start_time);
          toast({
            title: "Adjusted Extend Time",
            description: "Extend time was adjusted due to preceding time change.",
          });
        }
        previousEndTime = extendTime.end_time;
      });
    }
  };

  const updateSubsequentExtendTimes = (availabilityDay: AvailabilityDay, itemId: string) => {
    if (!availabilityDay.extend_times || availabilityDay.extend_times.length === 0) return;
    const currentExtendIndex = availabilityDay.extend_times?.findIndex((time) => time.id === itemId);
    if (currentExtendIndex !== undefined && currentExtendIndex !== -1) {
      for (let i = currentExtendIndex + 1; i < availabilityDay.extend_times.length; i++) {
        const nextExtendTime = availabilityDay.extend_times[i];
        const previousExtendTime = availabilityDay.extend_times[i - 1];
        if (nextExtendTime.start_time <= previousExtendTime.end_time) {
          setState(`select_${nextExtendTime.id}_start_time`, true);
          nextExtendTime.start_time = previousExtendTime.end_time;
          setState(`select_${nextExtendTime.id}_end_time`, true);
          nextExtendTime.end_time = addOneHour(nextExtendTime.start_time);
          toast({
            title: "Adjusted Subsequent Extend Time",
            description: `Subsequent extend time adjusted due to previous extend time change.`,
          });
        }
      }
    }
  };

  const adjustExtendEndTime = (extendTime: ExtendTime, itemId: string) => {
    setState(`select_${itemId}_end_time`, true);
    extendTime.end_time = addOneHour(extendTime.start_time);
    toast({
      title: "Adjusted End Time",
      description: "End time was adjusted due to start time change.",
    });
  };

  const displayErrorMessage = (message: string) => {
    cleanState();
    toast({
      title: "Failed to update time",
      description: message,
    });
  };

  const renderSelect = (item: AvailabilityDay | ExtendTime, type: string, label: string) => {
    const isMain = type === "main";
    const isEnabled = isMain ? (item as AvailabilityDay).enabled : true;

    return states[`select_${item.id}_${label}_time`] ? (
      <Skeleton className="h-[40px] w-[100px] bg-gray-200 flex ">
        <Loader2 className="animate-spin m-auto" />
      </Skeleton>
    ) : (
      <Select
        disabled={!isEnabled || states[GlobalStateKey.UpdateAvailabilityData]}
        defaultValue={intToTime(item[label === "start" ? "start_time" : "end_time"])}
        onValueChange={(value: string) => onTimeValueChange(item.id, type, `${label}_time`, value)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={label === "start" ? "Start" : "End"} />
        </SelectTrigger>
        <SelectContent>
          {(isMain || type === "extend") && isEnabled && (
            <SelectGroup>
              {timeReference.map((time, index) => (
                <SelectItem key={index} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    );
  };

  return (
    <>
      <span> from </span>
      {renderSelect(v.item, v.itemType, "start")}
      <span> to </span>
      {renderSelect(v.item, v.itemType, "end")}
    </>
  );
};
