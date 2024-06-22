import { useUserStore } from "@/stores/user";
import { AvailabilityTimeSection } from "./availability-time-section";
import { AvailabilityDay, ExtendTime } from "@/lib/user";
import { handleError } from "@/lib/http";
import { addOneHour, intToDay } from "@/lib/time";
import { Loader2, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useAPI } from "@/hooks/useApi";
import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import { useGlobalStateStore } from "@/stores/state";
import { GlobalStateKey } from "@/lib/enums";

export const AvailabilityDaySection = (v: { day: AvailabilityDay }) => {
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const { availability, setUserAvailability } = useUserStore();
  const { updateAvailability, deleteAvailabilityExtendTime } = useAPI();
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

  const deleteExtendTime = useMutation(deleteAvailabilityExtendTime, {
    onSuccess: (_, variables) => {
      if (!availability?.days) return;
      const { dayId, timeId } = variables;
      const updatedAvailability = { ...availability };
      const updatedDays = updatedAvailability?.days?.map((day) => {
        if (day.id === dayId && day.extend_times) {
          const updatedExtendTimes = day.extend_times
            .filter((extendTime) => extendTime.id !== timeId);
          return {
            ...day,
            extend_times: updatedExtendTimes,
          };
        }
        return day;
      });
      updatedAvailability.days = updatedDays;
      setUserAvailability(updatedAvailability);
      setLoadingItem(null);
      setState(GlobalStateKey.UpdateAvailabilityData, false);
    },
    onError: (error) => {
      setState(GlobalStateKey.UpdateAvailabilityData, false);
      setLoadingItem(null);
      handleError(error);
    },
  });

  const onDayStateChange = async (state: boolean, day: AvailabilityDay) => {
    if (!day) return;
    setState(GlobalStateKey.UpdateAvailabilityData, true);
    setLoadingItem(`switch_${day.id}`);
    saveChanges.mutate(JSON.stringify({
      days: [
        {
          id: day.id,
          enabled: state,
          start_time: day.start_time,
          end_time: day.end_time,
        },
      ],
    }));
  };

  const addNewExtendTime = async (day: AvailabilityDay) => {
    if (!day) return;
    setLoadingItem(`button_${day.id}`);
    setState(GlobalStateKey.UpdateAvailabilityData, true);
    const extendTimes = day.extend_times || [];
    const newExtendTime: ExtendTime = {
      id: "",
      start_time: day.end_time,
      end_time: addOneHour(day.end_time),
    };
    if (extendTimes.length > 0) {
      const lastExtendTime = extendTimes[extendTimes.length - 1];
      newExtendTime.start_time = lastExtendTime.end_time;
      newExtendTime.end_time = addOneHour(lastExtendTime.end_time);
    }
    const updatedExtendTimes = [...extendTimes, newExtendTime];
    saveChanges.mutate(JSON.stringify({
      days: [
        {
          id: day.id,
          enabled: day.enabled,
          start_time: day.start_time,
          end_time: day.end_time,
          extend_times: updatedExtendTimes,
        },
      ],
    }));
  };

  const removeExtendTime = async (dayId: string, timeId: string) => {
    if (!dayId || !timeId) return;
    setState(GlobalStateKey.UpdateAvailabilityData, true);
    setLoadingItem(timeId);
    deleteExtendTime.mutate({ dayId, timeId });
  };

  return (<>
    <div className="flex w-full flex-col justify-between gap-4 last:mb-0 xl:flex-row xl:gap-12 xl:px-0">
      <div className="flex h-[36px] items-center gap-4 md:w-32">
        {loadingItem === `switch_${v.day.id}` ? (
          <Loader2 className="w-[2.8rem] animate-spin" />
        ) : (
          <Switch
            className="w-[2.8rem]"
            onCheckedChange={(checked: boolean) => onDayStateChange(checked, v.day)}
            defaultChecked={v.day.enabled}
            disabled={states[GlobalStateKey.UpdateAvailabilityData]}
          />
        )}
        <span>{intToDay(v.day.day)}</span>
      </div>
      <div className="flex sm:gap-2">
        {v.day.enabled && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 last:mb-0 sm:gap-2">
              <div className="flex flex-row gap-2 items-center">
                <AvailabilityTimeSection dayId={v.day.id} item={v.day} itemType="main" />
              </div>
              <Button
                variant="ghost" onClick={() => addNewExtendTime(v.day)}
                disabled={saveChanges.isLoading || states[GlobalStateKey.UpdateAvailabilityData]}
              >
                {loadingItem === `button_${v.day.id}` ? (
                  <Loader2 className="w-4 animate-spin" />
                ) : (
                  <PlusIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
            {v.day?.extend_times?.map((time, index) => (
              <div className="flex gap-1 last:mb-0 sm:gap-2" key={index}>
                <div className="flex flex-row gap-2 items-center">
                  <AvailabilityTimeSection dayId={v.day.id} item={time} itemType="extend" />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => removeExtendTime(v.day.id, time.id)}
                  disabled={loadingItem === time.id || states[GlobalStateKey.UpdateAvailabilityData]}
                >
                  {loadingItem === time.id ? (
                    <Loader2 className="w-4 animate-spin" />
                  ) : (
                    <TrashIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </>);
};
