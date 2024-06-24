import { Clock, Globe } from "lucide-react";
import { useUserStore } from "@/stores/user";
import { AvailabilitySkeleton } from "./skeletons/availability";
import { OAuthProvider } from "@/lib/enums";
import { InstalledApp } from "./installed-app";
import { ConnectAccount } from "./connect-account";
import { AvailabilityDaySection } from "./availability-day-section";
import { getFormattedSchedule } from "@/lib/time";
import { CalendarEventTarget } from "./calendar-event-target";

export function AvailabilityCard() {
  const { availability } = useUserStore();

  return (
    <>
      {!availability ? (
        <AvailabilitySkeleton />
      ) : (
        <>
          <h5 className="text-md font-semibold">{availability?.label}</h5>
          <section className="mt-2 space-y-1">
            <span className="flex flex-row items-start gap-2 text-sm font-normal">
              <Clock className="w-4 h-4 inline" />
              <div className="flex flex-col">
                {getFormattedSchedule(availability.days).map((item, index) => {
                  const [dayPart, ...timeParts] = item.split(", ");
                  return (
                    <div className="flex flex-col" key={index}>
                      {timeParts.length > 1 ? (
                        <>
                          <strong>{dayPart}:</strong>
                          {timeParts.map((time, index) => (
                            <div key={index}>{time}</div>
                          ))}
                        </>
                      ) : (
                        <p>
                          <strong>{dayPart},</strong> {timeParts}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </span>
            <span className="flex flex-row items-center text-sm font-normal">
              <Globe className="w-4 h-4 inline mr-1" />
              {availability?.timezone}
            </span>
          </section>
          <section className="flex flex-col gap-4 my-4 bg-gray-100 relative rounded-md p-4">
            {availability?.days?.map((day, index) => <AvailabilityDaySection key={index} day={day} />)}
          </section>
          <CalendarEventTarget />
          <section className="space-y-4">
            {!availability?.connected_with_google ? (
              <ConnectAccount provider={OAuthProvider.GOOGLE} />
            ) : (
              <InstalledApp provider={OAuthProvider.GOOGLE} />
            )}
            {!availability?.connected_with_microsoft ? (
              <ConnectAccount provider={OAuthProvider.MICROSOFT} />
            ) : (
              <InstalledApp provider={OAuthProvider.MICROSOFT} />
            )}
          </section>
        </>
      )}
    </>
  );
}
