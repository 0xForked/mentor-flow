import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { timezoneReference } from "@/lib/reference";
import { Clock4 } from "lucide-react";

export function MentorCalendarLeftSide({
  timeZone,
  setTimeZone,
}: {
  timeZone: string;
  setTimeZone: (timeZone: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-[280px] border-r pr-6 pt-4">
      <div className="grid gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <img alt="Shadcn Cal" src="/avatar.jpeg" className="rounded-full border" width={24} height={24} />
          </TooltipTrigger>
          <TooltipContent>Cal</TooltipContent>
        </Tooltip>
        <p className="text-gray-11 text-sm font-semibold">Cal</p>
      </div>
      <div className="grid gap-3">
        <p className="text-gray-12 text-2xl font-bold">Demo</p>
        <div className="flex items-center text-gray-12">
          <Clock4 className="size-4 mr-2" />
          <p className="text-sm font-semibold">15 mins</p>
        </div>
        <div className="flex items-center text-gray-12">
          <img alt="Cal video" src="/cal-video.svg" className="mr-2" width={16} height={16} />
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm font-semibold">Cal video</p>
            </TooltipTrigger>
            <TooltipContent>Cal video</TooltipContent>
          </Tooltip>
        </div>
        <Select value={timeZone} onValueChange={setTimeZone}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Select time zone">{timeZone.replace(/_/g, " ").split("(")[0].trim()}</SelectValue>
          </SelectTrigger>
          <SelectContent className="w-fit dark:bg-gray-5">
            {timezoneReference.map((timeZone) => (
              <SelectItem key={timeZone} value={timeZone} className="dark:focus:bg-gray-2">
                {timeZone.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
