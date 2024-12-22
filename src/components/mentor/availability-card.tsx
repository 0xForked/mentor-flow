import { Clock, Globe, InfoIcon } from "lucide-react";
import { useUserMentorStore } from "@/stores/userMentor";
import { AvailabilitySkeleton } from "@/components/skeletons/availability";
import { OAuthProvider } from "@/lib/enums";
import { InstalledApp } from "@/components/mentor/installed-app";
import { ConnectAccount } from "@/components/mentor/connect-account";
import { AvailabiltiyDaySectionV2, NewAvailabiltiyDaySection } from "@/components/mentor/availability-day-section-v2";
import { getFormattedSchedule } from "@/lib/time";
import { CalendarEventTarget } from "@/components/mentor/calendar-event-target";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AvailabilityDayOverrideSection } from "./availability-day-override";
import { AvailabilityDayOverrideModal } from "./availability-day-override-modal";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useAPI } from "@/hooks/useApi";
import { useMutation } from "react-query";
import { OfferCard } from "./offer-card";

export function AvailabilityCard() {
  const { availability, setUserAvailability } = useUserMentorStore();
  const { updateAvailability } = useAPI();
  const [bookingLimit, setBookingLimit] = useState<number | null>(0);
  const [leadTime, setLeadtime] = useState<number | null>(0);

  const saveChanges = useMutation(updateAvailability, {
    onSuccess: (resp) => {
      const availabilityData = resp?.data;
      setUserAvailability(availabilityData);
      setBookingLimit(null)
      setLeadtime(null)
    },
    onError: (error) => console.log(error),
  });

  useEffect(() => {
     if (availability != null &&  availability.limit != null &&
       availability?.limit?.booking_lead_time == null) {
       availability.limit.booking_lead_time = 0
     }
  }, [availability])


  const saveBookingLimit = () => {
    if (bookingLimit === null && bookingLimit === 0 &&
    Number(bookingLimit) === Number(availability?.limit?.booking_lead_time)) {
      return
    }
    saveChanges.mutate(
      JSON.stringify({
        limit: {
          future_booking: bookingLimit
        },
      }),
    );
  }

  const saveBookingLeadTime = () => {
    if (leadTime === null && leadTime === 0 &&
    Number(leadTime) === Number(availability?.limit?.booking_lead_time)) {
      return
    }
    saveChanges.mutate(
      JSON.stringify({
        limit: {
          booking_lead_time: leadTime
        },
      }),
    );
  }

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
            <AvailabiltiyDaySectionV2 />
            <NewAvailabiltiyDaySection />
          </section>

          <Accordion type="single" collapsible className="w-full mt-10">
            <AccordionItem value="item-1">
              <AccordionTrigger>Holiday mode</AccordionTrigger>
              <AccordionContent>
                <section className="flex flex-col gap-4 my-4 bg-gray-100 relative rounded-md p-4">
                  <h5 className="text-md font-semibold flex items-center gap-1">
                    Date overrides
                    <Tooltip>
                      <TooltipTrigger>
                        <a href="#"><InfoIcon className="w-4 h-4" /></a>
                      </TooltipTrigger>
                      <TooltipContent>
                        Date overrides are archived automatically after the date has passed
                      </TooltipContent>
                    </Tooltip>
                  </h5>
                  Add dates when your availability changes from your daily hours.
                  {availability?.day_overrides && Object.entries(availability.day_overrides).map(([date, dayOverrides]) => (
                    <AvailabilityDayOverrideSection key={date} date={date} days={dayOverrides} />
                  ))}
                  <AvailabilityDayOverrideModal />
                </section>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Allow to schedule</AccordionTrigger>
              <AccordionContent>
                <section className="flex flex-col gap-4 my-4 bg-gray-100 relative rounded-md p-4">
                  {bookingLimit !== null && bookingLimit != 0 &&
                   availability?.limit?.future_booking !== undefined &&
                   Number(bookingLimit) !== Number(availability.limit.future_booking) && (
                    <Button
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      onClick={saveBookingLimit}
                    >
                      Save
                    </Button>
                  )}
                  <h5 className="text-md font-semibold flex items-center gap-1">
                    Booking Limits (future bookings)
                  </h5>
                  Limit how far in the future this event can be booked!
                  <div className="flex gap-4 items-center">
                    <Input
                      type="number"
                      placeholder="set your future booking limit"
                      defaultValue={availability?.limit?.future_booking}
                      onChange={(e) => setBookingLimit(parseInt(e.target.value, 10) || 0)}
                      className="w-28"
                    />
                    calendar days
                  </div>
                </section>

                <section className="flex flex-col gap-4 my-4 bg-gray-100 relative rounded-md p-4">
                  {leadTime !== null && leadTime != 0 &&
                  availability?.limit?.booking_lead_time !== undefined &&
                  Number(leadTime) !== Number(availability.limit.booking_lead_time) && (
                    <Button
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      onClick={saveBookingLeadTime}
                    >
                      Save
                    </Button>
                  )}
                  <h5 className="text-md font-semibold flex items-center gap-1">
                    Booking Lead Time
                  </h5>
                  Specifies the minimum amount of time (in minutes) required before a booking can be made.
                  <div className="flex gap-4 items-center">
                    <Input
                      type="number"
                      placeholder="set your booking lead time"
                      defaultValue={availability?.limit?.booking_lead_time}
                      onChange={(e) => setLeadtime(parseInt(e.target.value, 10) || 0)}
                      className="w-28"
                    />
                    minutes
                  </div>
                </section>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>3rd party account</AccordionTrigger>
              <AccordionContent>
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Offers</AccordionTrigger>
              <AccordionContent>
                <OfferCard />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      )}
    </>
  );
}
