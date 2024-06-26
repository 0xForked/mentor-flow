import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { timezoneReference } from "@/lib/reference";
import { Clock4, Calendar, Globe, MapPin } from "lucide-react";
import { InstalledApp, User } from "@/lib/user";
import { capitalizeFirstChar } from "@/lib/utils";
import { convertToLocalDateTimeRangeFormats } from "@/lib/time";

export function CalendarMentorProfile({
  timezone,
  setTimezone,
  mentor,
  apps,
  interval,
  time,
}: {
  timezone: string;
  setTimezone: (timeZone: string) => void;
  mentor?: User | null;
  apps?: InstalledApp | null;
  interval: number;
  time: string | null;
}) {
  const formatTimeSlot = (ISOTime: string, interval: number): JSX.Element => {
    const { date, startTime, endTime } = convertToLocalDateTimeRangeFormats(ISOTime, interval);
    return (
      <>
        <span>{date}</span> <br />
        <span>
          {startTime} – {endTime}
        </span>
      </>
    );
  };

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
      <div className="grid gap-1">
        <p className="text-gray-900 text-2xl font-bold mb-1">Session Demo</p>

        {time && (
          <div className="flex mb-3 mr-2">
            <Calendar className="h-4 w-4 mr-2 mt" />
            <p className="text-sm">{formatTimeSlot(time, interval)}</p>
          </div>
        )}

        <div className="flex items-center mb-3 mr-2">
          <Clock4 className="h-4 w-4 mr-2" />
          <p className="text-sm">{interval} mins</p>
        </div>

        {apps?.conferencing
          ?.filter((item) => item.is_default)
          .map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div className="flex items-center text-gray-900">
                  <img alt={item.name} src={item.logo} className="mr-2" width={20} height={20} />
                  <p className="text-sm">{item.name}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col place-items-start w-60">
                <span className="text-lg font-semibold"> {item.name}</span>
                <span className="flex text-sm items-center gap-1 mt-2">{item.description}</span>
              </TooltipContent>
            </Tooltip>
          ))}

        <div className="flex items-center">
          <Globe className="w-4 h-4" />
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-fit border-none focus:ring-0 focus:ring-offset-0">
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
    </div>
  );
}
