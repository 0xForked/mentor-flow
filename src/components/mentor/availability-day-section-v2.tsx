import { AvailabilityDay} from "@/lib/user";
import { addOneHour, intToDay, intToTime, strTimeToInt } from "@/lib/time";
import { CheckIcon, Loader2, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { timeReference } from "@/lib/reference";
import { useUserMentorStore } from "@/stores/userMentor";
import { useAPI } from "@/hooks/useApi";
import { useGlobalStateStore } from "@/stores/state";
import { useMutation } from "react-query";
import { handleError } from "@/lib/http";
import { toast } from "../ui/use-toast";
import { Skeleton } from "../ui/skeleton";
import { GlobalStateKey } from "@/lib/enums";

export const AvailabiltiyDaySectionV2 = () => {
  const { availability, setUserAvailability } = useUserMentorStore();
  const { updateAvailability, deleteAvailabilityDay } = useAPI();
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

  const deleteDay = useMutation(deleteAvailabilityDay, {
    onSuccess: (_, variables) => {
      if (!availability?.days) return;
      const { dayId } = variables;
      const updatedDays = availability.days.filter(day => day.id !== dayId);
      const updatedAvailability = {
        ...availability,
        days: updatedDays,
      };
      setUserAvailability(updatedAvailability);
    },
    onError: (error) => handleError(error),
  });

  const onDayValueChange = async (
    item: AvailabilityDay,
    val: string
  ) => {
    if (!item && !val) return;
    setState(GlobalStateKey.UpdateAvailabilityDayData, true);
    setState(`select_${item.id}_day`, true);
    item.day = parseInt(val)
    saveChanges.mutate(JSON.stringify({ days: [item] }));
  }

  const onTimeValueChange = async (
    item: AvailabilityDay,
    key: string,
    val: string
  ) => {
    if (!item && !val) return;
    setState(GlobalStateKey.UpdateAvailabilityTimeData, true);
    setState(`select_${item.id}_${key}`, true);
    const error = handleTimeChange(item, item.id, key, val);
    if (error !== null) {
      displayErrorMessage(error.message);
      // TODO: Revert to previous value, before return.
      return;
    }
    saveChanges.mutate(JSON.stringify({ days: [item] }));
  };

  const handleTimeChange = (
    availabilityDay: AvailabilityDay,
    itemId: string,
    key: string,
    val: string,
  ): Error | null => {
    if (key === "start_time") {
      availabilityDay.start_time = strTimeToInt(val);
      if (availabilityDay.start_time >= availabilityDay.end_time) {
        setState(`select_${itemId}_end_time`, true);
        availabilityDay.end_time = addOneHour(availabilityDay.start_time);
        toast({
          title: "Adjusted End Time",
          description: "End time was adjusted due to start time change.",
        });
      }
    }

    if (key === "end_time") {
      const timeValue = strTimeToInt(val);
      if (timeValue <= availabilityDay.start_time) {
        return new Error("End time cannot be earlier than or equal to start time.");
      }
      availabilityDay.end_time = timeValue;
    }

    return null;
  };

  const displayErrorMessage = (message: string) => {
    cleanState();
    toast({
      title: "Failed to update time",
      description: message,
    });
  };

  const removeDayTime = (dayId?: string) => {
    if (!dayId) {
      console.log("no id")
      return
    }
    deleteDay.mutate({ dayId });
  }

  const renderSelectDay = (item: AvailabilityDay) => {
    return states[`select_${item.id}_day`] ? (
      <Skeleton className="h-[40px] w-[140px] bg-gray-200 flex ">
        <Loader2 className="animate-spin m-auto" />
      </Skeleton>
    ) : (
      <Select
         defaultValue={`${item.day}`}
         onValueChange={(value: string) => onDayValueChange(item, value)}
      >
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

  const renderSelectTime = (label: string, item: AvailabilityDay) => {
    return states[`select_${item.id}_${label}_time`] ? (
      <Skeleton className="h-[40px] w-[100px] bg-gray-200 flex ">
        <Loader2 className="animate-spin m-auto" />
      </Skeleton>
    ) : (<Select
      defaultValue={intToTime(item[label === "start" ? "start_time" : "end_time"])}
      onValueChange={(value: string) => onTimeValueChange(item, `${label}_time`, value)}
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
    </Select>)
  };

  return (
    availability?.days?.map((item, index) => (
      <div key={index} className="flex gap-2 last:mb-0 sm:gap-2">
        <div className="flex flex-row gap-6 items-center">
          {renderSelectDay(item)}
          <span> from </span>
          {renderSelectTime("start", item)}
          <span> to </span>
          {renderSelectTime("end", item)}
        </div>
        <div className="flex gap-2 ml-4">
          <button onClick={() => removeDayTime(item?.id)}>
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    ))
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
  const { setUserAvailability } = useUserMentorStore();
  const { updateAvailability } = useAPI();

  const saveChanges = useMutation(updateAvailability, {
    onSuccess: (resp) => {
      const availabilityData = resp?.data;
      setUserAvailability(availabilityData);
      setNewAvailability([]);
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const addNewEmptyItem = () => {
    if (newAvailability != null && newAvailability?.length >= 3) {
      toast({title: "Max item", description: "Max new item list 2!"})
      return
    }
    const newItem = {
        id: Date.now(),
        day: 0,
        start_time: 0,
        end_time: 0,
      };
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

  const onSaveClicked = () => {
    if (!newAvailability) return;
    const days: AvailabilityDay[] = [];
    newAvailability?.forEach((item) => {
        days.push({
          id: "",
          enabled: true,
          day: item.day,
          start_time: item.start_time,
          end_time: item.end_time,
        });
      });
    saveChanges.mutate(JSON.stringify({ days: days }));
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
          <div className="flex flex-row gap-6 items-center">
            {renderSelectDay(index)}
            <span> from </span>
            {renderSelectTime(index, "start", item)}
            <span> to </span>
            {renderSelectTime(index, "end", item)}
          </div>
          <div className="flex gap-4 ml-4">
            <button  onClick={() => removeItem(item.id)}>
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-row justify-between">
        <Button
          className="flex-none w-fit text-blue-500"
          variant="link"
          onClick={addNewEmptyItem}
        >
          <PlusIcon className="w-4 h-4 mr-2"/>
          Add new time widow
        </Button>

        {newAvailability != null && newAvailability?.length > 0 && <Button
          className="flex-none w-fit mr-10 bg-gray-100 hover:bg-gray-200"
          variant="outline"
          onClick={onSaveClicked}
        >
          <CheckIcon className="w-4 h-4 mr-2"/>
          Save All
        </Button>}
      </div>
    </>
  );
}
