import { useUserMentorStore } from "@/stores/userMentor";
import { AvailabilityTimeSection } from "@/components/mentor/availability-time-section";
import { AvailabilityDay, ExtendTime } from "@/lib/user";
import { handleError } from "@/lib/http";
import { addOneHour, intToDay, intToTime, strTimeToInt } from "@/lib/time";
import { CheckIcon, Loader2, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAPI } from "@/hooks/useApi";
import { useMutation } from "react-query";
import { useState } from "react";
import { useGlobalStateStore } from "@/stores/state";
import { GlobalStateKey } from "@/lib/enums";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { timeReference } from "@/lib/reference";

export const AvailabilityDaySection = (v: { day: AvailabilityDay }) => {
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const { availability, setUserAvailability } = useUserMentorStore();
  const { updateAvailability, deleteAvailabilityExtendTime } = useAPI();
  const { states, setState } = useGlobalStateStore();

  const saveChanges = useMutation(updateAvailability, {
    onSuccess: (resp) => {
      const availabilityData = resp?.data;
      setUserAvailability(availabilityData);
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
          const updatedExtendTimes = day.extend_times.filter((extendTime) => extendTime.id !== timeId);
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
    saveChanges.mutate(
      JSON.stringify({
        days: [
          {
            id: day.id,
            enabled: state,
            start_time: day.start_time,
            end_time: day.end_time,
          },
        ],
      }),
    );
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
    saveChanges.mutate(
      JSON.stringify({
        days: [
          {
            id: day.id,
            enabled: day.enabled,
            start_time: day.start_time,
            end_time: day.end_time,
            extend_times: updatedExtendTimes,
          },
        ],
      }),
    );
  };

  const removeExtendTime = async (dayId: string, timeId: string) => {
    if (!dayId || !timeId) return;
    setState(GlobalStateKey.UpdateAvailabilityData, true);
    setLoadingItem(timeId);
    deleteExtendTime.mutate({ dayId, timeId });
  };

  return (
    <>
      <div className="flex w-full flex-col justify-between gap-4 last:mb-0 lg:flex-row lg:gap-12 lg:px-0">
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
                  variant="ghost"
                  onClick={() => addNewExtendTime(v.day)}
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
    </>
  );
};

export const AvailabiltiyDaySectionV2 = (v: {day: AvailabilityDay}) => {
  return (
    <div className="flex w-full flex-col justify-between gap-4 last:mb-0 lg:flex-row lg:gap-10 lg:px-0">
      <div className="flex h-[36px] items-center gap-4 w-[150px]">
        <Select
          // disabled={!isEnabled || states[GlobalStateKey.UpdateAvailabilityData]}
          defaultValue={`${v.day.day}`}
          // onValueChange={(value: string) => onTimeValueChange(item.id, type, `${label}_time`, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
             <SelectGroup>
               {Array.from({ length: 7 }, (_, index) => (
                <SelectItem key={index} value={`${index}`}>
                  {intToDay(index)}
                </SelectItem>
              ))}
             </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex sm:gap-2">
        {v.day.enabled && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 last:mb-0 sm:gap-2">
              <div className="flex flex-row gap-2 items-center">
                <AvailabilityTimeSection dayId={v.day.id} item={v.day} itemType="main" />
              </div>
              <Button variant="ghost">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const NewAvailabiltiyDaySection = () => {
  interface NewAvailability {
    id: number;
    day: number;
    start_time: number;
    end_time: number;
  }

  const [newAvailability, setNewAvailability] = useState<NewAvailability[] | null>(null)

  const addNewEmptyItem = () => {
    const newItem = {
        id: Date.now(),
        day: 0,
        start_time: 0,
        end_time: 0,
      };
      console.log("Adding new item:", newItem);

      setNewAvailability((prev) => {
        const updated = prev ? [...prev, newItem] : [newItem];
        console.log("Updated state after addition:", updated);
        return updated;
      });
  };

  const removeItem = (idToRemove: number) => {
    console.log("Removing item with id:", idToRemove);
      setNewAvailability((prev) => {
        console.log("Current state:", prev);
        if (!prev) return null;
        const updated = prev.filter((item) => item.id !== idToRemove);
        console.log("Updated state:", updated);
        return updated;
      });
  };

  const handleSelectChange = (index: number, field: keyof NewAvailability, value: number) => {
    setNewAvailability((prev) => {
      if (!prev) return null;
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const saveChange = (item: NewAvailability) => {
    console.log("save", item)
  }

  const renderSelectDay = (index: number) => {
    return (
      <Select onValueChange={(value) => handleSelectChange(index, "day", parseInt(value))}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select day" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Array.from({ length: 7 }, (_, index) => (
              <SelectItem key={index} value={`${index}`}>
                {intToDay(index)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  const renderSelectTime = (index: number, label: string, item: NewAvailability) => {
    return <Select
      defaultValue={intToTime(item[label === "start" ? "start_time" : "end_time"])}
      onValueChange={(value) => handleSelectChange(index,
        `${label}_time` as keyof NewAvailability,  strTimeToInt(value)) }
    >
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder={label === "start" ? "Start" : "End"} />
      </SelectTrigger>
      <SelectContent>
        {timeReference.map((time, index) => (
          <SelectItem key={index} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  };

  return (
    <>
      {newAvailability?.map((item, index) => (
        <div key={index} className="flex gap-2 last:mb-0 sm:gap-2">
          <div className="flex flex-row gap-4 items-center">
            {renderSelectDay(index)}
            <span> from </span>
            {renderSelectTime(index, "start", item)}
            <span> to </span>
            {renderSelectTime(index, "end", item)}
          </div>
          <div className="flex w-8 gap-2">
            <button  onClick={() => saveChange(item)}>
              <CheckIcon className="w-4 h-4" />
            </button>
            <button  onClick={() => removeItem(item.id)}>
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <Button
        className="flex-none w-fit text-blue-500"
        variant="link"
        onClick={addNewEmptyItem}
      >
        <PlusIcon className="w-4 h-4 mr-2"/>
        Add new time widow
      </Button>
    </>
  );
}
