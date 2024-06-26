import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DateValue } from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";

export function MentorCalendarRightSide({
  date,
  timezone,
  weeksInMonth,
  handleAvailableTimeChange,
  slots
}: {
  date: DateValue;
  timezone: string;
  weeksInMonth: number;
  handleAvailableTimeChange: (time: string) => void;
  slots: { "12": string; "24": string, "full": string }[];
}) {
  const { locale } = useLocale();
  const [dayNumber, dayName] = date
    .toDate(timezone)
    .toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
    })
    .split(" ");

  return (
    <Tabs defaultValue="12" className="flex flex-col gap-4 w-[280px] border-l pl-6 pt-4">
      <div className="flex justify-between items-center">
        <p aria-hidden className="flex-1 align-center font-bold text-md text-gray-900">
          {dayName} <span className="text-gray-500">{dayNumber}</span>
        </p>
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="12">12h</TabsTrigger>
          <TabsTrigger value="24">24h</TabsTrigger>
        </TabsList>
      </div>
      {["12", "24"].map((time) => (
        <TabsContent key={time} value={time}>
          <ScrollArea
            type="always"
            className="h-full"
            style={{ maxHeight: weeksInMonth > 5 ? "380px" : "320px" }}
          >
            <div className="grid gap-2 pr-3">
              {slots.length > 0 ? slots?.map((availableTime) => (
                <Button
                  variant="outline"
                  onClick={() => handleAvailableTimeChange(availableTime["full"])}
                  key={availableTime[time as "12" | "24"]}
                >
                  {availableTime[time as "12" | "24"]}
                </Button>
              )) : <p className="mx-auto">Slots currently not available</p>}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}
