import { AvailabilityDay, ExtendTime } from "@/lib/user";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { timeReference } from "@/lib/reference";
import { Skeleton } from "./ui/skeleton";
import { addOneHour, intToTime, strTimeToInt } from "@/lib/time";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { handleError } from "@/lib/http";
import { useUserStore } from "@/stores/user";
import { useAPI } from "@/hooks/useApi";
import { useGlobalStateStore } from "@/stores/state";
import { useMutation, useQueryClient } from "react-query";
import { GlobalStateKey } from "@/lib/enums";

export const AvailabilityTimeSection = (v: { dayId: string; item: AvailabilityDay | ExtendTime; itemType: string }) => {
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const originalDefaultValueStartTime = intToTime(v.item.start_time);
  const originalDefaultValueEndTime = intToTime(v.item.end_time);
  const [defaultValueStartTime, setDefaultValueStartTime] = useState<string>(originalDefaultValueStartTime);
  const [defaultValueEndTime, setDefaultValueEndTime] = useState<string>(originalDefaultValueEndTime);
  const { availability, setUserAvailability } = useUserStore();
  const { updateAvailability } = useAPI();
  const { states, setState } = useGlobalStateStore();
  const queryClient = useQueryClient();

  const saveChanges = useMutation(updateAvailability, {
    onSuccess: (resp) => {
      const availabilityData = resp?.data;
      setUserAvailability(availabilityData);
      queryClient.invalidateQueries('availability');
      setState(GlobalStateKey.UpdateAvailabilityData, false);
      setLoadingItem(null);
    },
    onError: (error) => {
      setState(GlobalStateKey.UpdateAvailabilityData, false);
      handleError(error);
      setLoadingItem(null);
    },
  });

  const onTimeValueChange = async (itemId: string, dayId: string, itemType: string, key: string, val: string) => {
    if (!itemId && !val && !availability) return;

    setState(GlobalStateKey.UpdateAvailabilityData, true);
    setLoadingItem(`select_${itemId}_${key}`);

    const availabilityDay = availability?.days?.find((day) => day.id === dayId);
    if (!availabilityDay) {
      displayErrorMessage("Availability day not found!")
      return;
    }

    if (itemType == "main") {
      if (key === "start_time") {
        availabilityDay.start_time = strTimeToInt(val);
        // Apply if start_time > end_time, adjust end_time
        if (availabilityDay.start_time >= availabilityDay.end_time) {
          setLoadingItem(`select_${itemId}_end_time`);
          availabilityDay.end_time = addOneHour(availabilityDay.start_time);
          toast({
            title: "Adjusted End Time",
            description: "End time was adjusted due to start time change.",
          });
        }
      } else if (key === "end_time") {
        const timeValue = strTimeToInt(val);
        // Validate: if end_time <= start_time, throw error
        if (timeValue <= availabilityDay.start_time) {
          displayErrorMessage("End time cannot be earlier than or equal with start time.")
          return;
        }
        availabilityDay.end_time = timeValue;
      }
    }

    if (itemType == "extend") {
      const extendTime = availabilityDay.extend_times?.find((time) => time.id === itemId);
      if (!extendTime) {
        displayErrorMessage("Extend time not found.")
        return;
      }
      if (key === "start_time") {
        extendTime.start_time = strTimeToInt(val);
        if (extendTime.start_time < availabilityDay.end_time) {
          displayErrorMessage("Extend start time cannot be earlier than main start time.")
          return;
        }
        // Apply  if start_time >= end_time, adjust end_time
        if (extendTime.start_time >= extendTime.end_time) {
          setLoadingItem(`select_${itemId}_end_time`);
          extendTime.end_time = addOneHour(extendTime.start_time);
          toast({
            title: "Adjusted End Time",
            description: "End time was adjusted due to start time change.",
          });
        }
        setDefaultValueStartTime(val);
      } else if (key === "end_time") {
        const timeValue = strTimeToInt(val);
        // Validate: if end_time <= start_time, throw error
        if (timeValue <= extendTime.start_time) {
          displayErrorMessage("End time cannot be earlier than or equal with start time.")
          return;
        }
        extendTime.end_time = timeValue;
        setDefaultValueEndTime(val);
      }
    }

    saveChanges.mutate(JSON.stringify({
      days: [
        {
          id: availabilityDay.id,
          enabled: availabilityDay.enabled,
          start_time: availabilityDay.start_time,
          end_time: availabilityDay.end_time,
          extend_times: availabilityDay.extend_times,
        },
      ],
    }))
  };

  const displayErrorMessage = (message: string) => {
    setState(GlobalStateKey.UpdateAvailabilityData, false);
    setLoadingItem(null);
    toast({
      title: "Failed to update time",
      description: message,
    });
  }

  return (<>
    {loadingItem === `select_${v.item.id}_start_time` ? (
      <Skeleton className="h-[40px] w-[100px] bg-gray-200 flex ">
        <Loader2 className="animate-spin m-auto" />
      </Skeleton>
    ) : (
      <Select
        disabled={
          (v.itemType != "extend" ? !(v.item as AvailabilityDay).enabled : false) ||
          states[GlobalStateKey.UpdateAvailabilityData]
        }
        defaultValue={defaultValueStartTime}
        onValueChange={(value: string) => onTimeValueChange(v.item.id, v.dayId, v.itemType, "start_time", value)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Start" />
        </SelectTrigger>
        <SelectContent>
          {((v.itemType == "main" && (v.item as AvailabilityDay).enabled) || v.itemType == "extend") && (
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
    )}
    <span>-</span>
    {loadingItem === `select_${v.item.id}_end_time` ? (
      <Skeleton className="h-[40px] w-[100px] bg-gray-200 flex ">
        <Loader2 className="animate-spin m-auto" />
      </Skeleton>
    ) : (
      <Select
        disabled={
          (v.itemType != "extend" ? !(v.item as AvailabilityDay).enabled : false) ||
          states[GlobalStateKey.UpdateAvailabilityData]
        }
        defaultValue={defaultValueEndTime}
        onValueChange={(value: string) => onTimeValueChange(v.item.id, v.dayId, v.itemType, "end_time", value)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="End" />
        </SelectTrigger>
        <SelectContent>
          {((v.itemType == "main" && (v.item as AvailabilityDay).enabled) || v.itemType == "extend") && (
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
    )}
  </>)
};
