import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DateValue } from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";

const availableTimes = [
  { 12: "09:00am", 24: "09:00" },
  { 12: "09:30am", 24: "09:30" },
  { 12: "10:00am", 24: "10:00" },
  { 12: "10:30am", 24: "10:30" },
  { 12: "11:00am", 24: "11:00" },
  { 12: "11:30am", 24: "11:30" },
  { 12: "12:00pm", 24: "12:00" },
  { 12: "12:30pm", 24: "12:30" },
  { 12: "01:00pm", 24: "13:00" },
  { 12: "01:30pm", 24: "13:30" },
  { 12: "02:00pm", 24: "14:00" },
  { 12: "02:30pm", 24: "14:30" },
  { 12: "03:00pm", 24: "15:00" },
  { 12: "03:30pm", 24: "15:30" },
  { 12: "04:00pm", 24: "16:00" },
  { 12: "04:30pm", 24: "16:30" },
  { 12: "05:00pm", 24: "17:00" },
  { 12: "05:30pm", 24: "17:30" },
];

export function MentorCalendarRightSide({
  date,
  tz,
  weeksInMonth,
  handleAvailableTimeChange,
}: {
  date: DateValue;
  tz: string;
  weeksInMonth: number;
  handleAvailableTimeChange: (time: string) => void;
}) {
  const { locale } = useLocale();
  const [dayNumber, dayName] = date
    .toDate(tz)
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
            style={{
              maxHeight: weeksInMonth > 5 ? "380px" : "320px",
            }}
          >
            <div className="grid gap-2 pr-3">
              {availableTimes.map((availableTime) => (
                <Button
                  variant="outline"
                  onClick={() => handleAvailableTimeChange(availableTime[time as "12" | "24"])}
                  key={availableTime[time as "12" | "24"]}
                >
                  {availableTime[time as "12" | "24"]}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}
