import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { timezoneReference } from "@/lib/reference";
import { Clock4, Calendar, Globe } from "lucide-react";
import { User } from "@/lib/user";
import { convertToLocalDateTimeRangeFormats } from "@/lib/time";

export function RescheduleMentorProfile({
  timezone,
  setTimezone,
  mentor,
  interval,
  prevTime,
  time,
}: {
  timezone: string;
  setTimezone: (timeZone: string) => void;
  mentor?: User | null;
  interval: number;
  prevTime: string | null | undefined;
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
        <img alt="placeholder" src="https://stgreenskills001.blob.core.windows.net/greenskills-talent-imgs-test/65b38384-a192-4474-81e6-fc429a309e0c.jpg" className="mr-2" width={20} height={20} />
        <p className="text-gray-900 text-sm font-semibold">{mentor?.name}</p>
      </div>
      <div className="grid gap-1">
        <p className="text-gray-900 text-2xl font-bold mb-1">{interval} min meeting</p>

        {prevTime && (
          <div className="flex mb-3 mr-2">
            <Calendar className="h-4 w-4 mr-2 mt" />
            <p className="text-sm">
              Former time <br />
              <span className=" line-through">{formatTimeSlot(prevTime, interval)}</span>
            </p>
          </div>
        )}

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

        <div className="flex items-center text-gray-900">
          <img alt="google-meet" src="https://stgreenskills001.blob.core.windows.net/assets/google-meet-logo.webp" className="mr-2" width={20} height={20} />
          <p className="text-sm">Google Meet</p>
        </div>

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
