import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { timezoneReference } from "@/lib/reference";
import { MapPin } from "lucide-react";
import { User } from "@/lib/user";
import { capitalizeFirstChar } from "@/lib/utils";

export function MentorCalendarLeftSide({
  timezone,
  setTimezone,
  mentor,
}: {
  timezone: string;
  setTimezone: (timeZone: string) => void;
  mentor?: User | null;
}) {
  return (
    <div className="flex flex-col gap-4 w-[280px] border-r pr-6 pt-4">
      <div className="grid gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <img
              alt={"@" + mentor?.username}
              src={mentor?.avatar}
              className="rounded-full border"
              width={24}
              height={24}
            />
          </TooltipTrigger>
          <TooltipContent className="flex flex-col items-center">
            <span className="text-lg font-semibold"> {mentor?.full_name}</span>
            <span className="text-md font-light">@{mentor?.username}</span>
            <span className="flex text-sm items-center gap-1 mt-2">
              <MapPin className="w-3 h-3 inline" /> {capitalizeFirstChar(mentor?.location ?? "")}
            </span>
          </TooltipContent>
        </Tooltip>
        <p className="text-gray-900 text-sm font-semibold">{mentor?.full_name}</p>
      </div>
      <div className="grid gap-3">
        {/* <div className="flex items-center text-gray-950">
          <img alt="Cal video" src="/cal-video.svg" className="mr-2" width={16} height={16} />
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm font-semibold">Cal video</p>
            </TooltipTrigger>
            <TooltipContent>Cal video</TooltipContent>
          </Tooltip>
        </div> */}

        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time zone">{timezone}</SelectValue>
          </SelectTrigger>
          <SelectContent className="w-fit dark:bg-gray-400">
            {timezoneReference.map((timezone) => (
              <SelectItem key={timezone} value={timezone} className="dark:focus:bg-gray-100">
                {timezone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
