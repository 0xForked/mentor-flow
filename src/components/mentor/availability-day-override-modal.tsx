import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Loader2, PlusIcon, TrashIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addOneHour, intToTime, strTimeToInt, replaceTimeInDate } from "@/lib/time"
import { timeReference } from "@/lib/reference"
import { Input } from "@/components/ui/input"
import { toast } from "../ui/use-toast"
import { useAPI } from "@/hooks/useApi"
import { useMutation } from "react-query"
import { useUserMentorStore } from "@/stores/userMentor"
import { handleError } from "@/lib/http"

interface TimeSelect {
  start: number;
  end: number;
}

interface DayOverrideUpdate {
  start_date: string;
  end_date: string;
}

export const AvailabilityDayOverrideModal = () => {
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [allDays, setAllDays] = useState<boolean>(false);
  const [selectedTimes, setSelectedTimes] = useState<TimeSelect[]>([]);
  const { updateAvailability } = useAPI();
  const { setUserAvailability } = useUserMentorStore();

  const saveChanges = useMutation(updateAvailability, {
    onSuccess: (resp) => {
      const availabilityData = resp?.data;
      setUserAvailability(availabilityData);
      setSelectedDates([]);
      setSelectedTimes([]);
      setOpen(false);
    },
    onError: (error) => handleError(error),
  });

  useEffect(() => setSelectedTimes([{ start: 900, end: 1000 }]), [])

  const disabledCalendar = (date: Date) =>
    date.getTime() < new Date().setHours(0, 0, 0, 0)

  const renderSelect = (time: TimeSelect, index: number, label: string) => {
    return (
      <Select
        defaultValue={intToTime(label === "start" ? time.start : time.end)}
        onValueChange={(value: string) => updateTime(index, label, value)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={label === "start" ? "Start" : "End"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {timeReference.map((time, index) => (
              <SelectItem key={index} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>);
  };

  const addTime = () => {
    if (selectedTimes.length >= 3) {
      toast({ description: "Only 3 item time accepted" });
      return
    }
    setSelectedTimes(prevTimes => {
      const lastItem = prevTimes[prevTimes.length - 1];
      const newStart = lastItem ? lastItem.end : 0;
      const newTime: TimeSelect = { start: newStart, end: addOneHour(newStart) };
      return [...prevTimes, newTime];
    });
  }

  const updateTime = (index: number, key: string, value: string) => {
    setSelectedTimes(prevTimes => {
      const updatedTimes = [...prevTimes];
      if (key === "start") {
        updatedTimes[index].start = strTimeToInt(value);
      }
      if (key === "end") {
        updatedTimes[index].end = strTimeToInt(value);
      }
      return updatedTimes;
    });
  }

  const removeTime = (index: number) => {
    setSelectedTimes(prevTimes =>
      prevTimes.filter((_, i) => i !== index));
  }

  const saveUpdate = () => {
    const items: DayOverrideUpdate[] = [];

    if (allDays) {
      selectedDates.forEach(date => {
        const formattedDate = formatDate(date);
        items.push({
          start_date: `${formattedDate}T00:00:00.000Z`,
          end_date: `${formattedDate}T00:00:00.000Z`,
        });
      });
    }

    // if (!allDays && selectedTimes.length > 0) {
    //   selectedDates.forEach(date => {
    //     selectedTimes.forEach(time => {
    //       const startFormattedDate = replaceTimeInDate(date, time.start);
    //       const endFormattedDate = replaceTimeInDate(date, time.end);
    //       items.push({
    //         start_date: `${startFormattedDate}T00:00:00.000Z`,
    //         end_date: `${endFormattedDate}T00:00:00.000Z`,
    //       });
    //     })
    //   });
    // }

    saveChanges.mutate(JSON.stringify({ day_overrides: items }));
  }

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (<>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2 w-48" onClick={() => setOpen(true)}>
        <PlusIcon className="w-4 h-4" />
        Add an override
      </DialogTrigger>
      <DialogContent className="max-w-max w-10/12 divide-y-2 gap-4">
        <DialogHeader>
          <DialogTitle>Select the dates to override</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-w-full w-full">
          <div className="flex divide-x-2 gap-4">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates) => setSelectedDates(dates || [])}
              disabled={(date) => disabledCalendar(date)}
              className="rounded-md mx-auto"
            />
            <div className="flex flex-col pl-6 w-[400px] gap-4 pt-4">
              {selectedDates.length == 0
                ? "Plese select a date"
                : <> <p className="text-gray-600"> Which hours are you free?</p>

                  {allDays
                    ? <Input disabled type="text" placeholder="Unavailable all day" />
                    : <> {selectedTimes.map((time, index) => (
                      <div className="flex flex-row items-center gap-2" key={index}>
                        {renderSelect(time, index, "start")}
                        <span>-</span>
                        {renderSelect(time, index, "end")}
                        {index == 0 ?
                          <Button variant="ghost" onClick={addTime}>
                            <PlusIcon className="w-4 h-4" />
                          </Button>
                          : <Button variant="ghost" className="hover:text-red-500" onClick={() => { removeTime(index) }}>
                            <TrashIcon className="w-4 h-4" />
                          </Button>}
                      </div>
                    ))} </>
                  }

                  <div className="flex items-center space-x-2">
                    <Switch id="mark-all-day" defaultChecked={allDays} onCheckedChange={setAllDays} />
                    <Label htmlFor="mark-all-day">Mark unavailable (All day)</Label>
                  </div>

                  <Button
                    className="absolute bottom-6 right-6"
                    onClick={saveUpdate}
                    disabled={saveChanges.isLoading}
                  >
                    {saveChanges.isLoading && <Loader2 className="w-4 animate-spin mr-1" />}
                    Add Override
                  </Button>
                </>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>)
}
