import { API_PATH, Availability, AvailabilityDay, ExtendTime, OAuthProvider } from "@/lib/user";
import { Skeleton } from "./ui/skeleton";
import googleLogo from "../assets/google.webp";
import microsoftLogo from "../assets/microsoft.png";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { addOneHour, intToDay, intToTime, timeReference } from "@/lib/time";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ArrowLeftIcon, Clock, Globe, Loader2, PlusIcon, TrashIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Fragment, useEffect, useState } from "react";
import { toast } from "./ui/use-toast";
import { capitalizeFirstChar, generateId } from "@/lib/utils";

interface AvailabilityProps {
  loading: boolean;
  error?: string | null;
  jwt?: string;
  availability?: Availability | null;
}

export function AvailabilityCard(props: AvailabilityProps) {
  const [loading, setLoading] = useState({ google: false, microsoft: false });
  const [availability, setAvailability] = useState(props.availability)

  useEffect(() => setAvailability(props.availability), [props])

  const AvailabilitySkeleton = () => (
    <>
      <Skeleton className="h-8 w-[120px]" />
      <section className="space-y-2 mt-4">
        <span className="flex flex-row items-center text-sm font-normal">
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-4 w-[160px]" />
        </span>
        <span className="flex flex-row items-center text-sm font-normal">
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-4 w-[100px]" />
        </span>
      </section>
      <section className="flex flex-col my-6 gap-4">
        {[0, 1, 2, 3, 4, 5, 6].map((item) => (
          <div
            className="flex flex-row justify-between items-center"
            key={item}
          >
            <div className="flex flex-row gap-2 items-center">
              <Skeleton className="h-8 w-12 rounded-xl" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Skeleton className="h-10 w-24" />
              <span>-</span>
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ))}
      </section>
      <section className="space-y-4">
        <section className="bg-gray-100 relative rounded-md divide-y divide-dashed">
          <div className="flex flex-row gap-4 p-4">
            <Skeleton className="h-10 w-10" />
            <div className="relative overflow-auto">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-80 mt-2" />
            </div>
          </div>
          <div className="flex flex-row gap-4 p-4">
            <Skeleton className="h-10 w-10" />
            <div className="relative overflow-auto">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-80 mt-2" />
            </div>
          </div>
        </section>
        <section className="bg-gray-100 relative rounded-md divide-y divide-dashed">
          <div className="flex flex-row gap-4 p-4">
            <Skeleton className="h-10 w-10" />
            <div className="relative overflow-auto">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-80 mt-2" />
            </div>
          </div>
          <div className="flex flex-row gap-4 p-4">
            <Skeleton className="h-10 w-10" />
            <div className="relative overflow-auto">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-80 mt-2" />
            </div>
          </div>
        </section>
      </section>
    </>
  );

  const AvailabilitySection = () => (
    <>
      <h5 className="text-md font-semibold">{availability?.label}</h5>
      <section className="mt-2 space-y-1">
        <span className="flex flex-row items-center text-sm font-normal">
          <Clock className="w-4 h-4 inline mr-1" />
          Mon - Fri, 09:00 - 16:00
        </span>
        <span className="flex flex-row items-center text-sm font-normal">
          <Globe className="w-4 h-4 inline mr-1" />
          {availability?.timezone}
        </span>
      </section>
      <section className="flex flex-col gap-4 my-6">
        {availability?.days?.map((day, index) => (
          <div
            className="flex w-full flex-col justify-between gap-4 last:mb-0 xl:flex-row xl:gap-12 xl:px-0"
            key={index}
          >
            <div className="flex h-[36px] items-center gap-4 md:w-32">
              <Switch
                onCheckedChange={(checked: boolean) => onDayStateChange(checked, day.id)}
                defaultChecked={day.enabled}
              />
              <span>{intToDay(day.day)}</span>
            </div>
            <div className="flex sm:gap-2">
              {day.enabled &&
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 last:mb-0 sm:gap-2">
                    <div className="flex flex-row gap-2 items-center">
                      <DayRage item={day} itemType="main" />
                    </div>
                    <Button variant="ghost" onClick={() => addNewExtendTime(day.id)}>
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  {day?.extend_times?.map((time, index) => (
                    <div className="flex gap-1 last:mb-0 sm:gap-2" key={index}>
                      <div className="flex flex-row gap-2 items-center">
                        <DayRage item={time} itemType="extend" />
                      </div>
                      <Button variant="ghost" onClick={() => removeExtendTime(day.id, time.id)}>
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>}
            </div>
          </div>
        ))}
      </section>
      <section className="space-y-4">
        {
          !availability?.connected_with_google
            ? (<ConnectWith provider={OAuthProvider.GOOGLE} />)
            : (<InstalledApp provider={OAuthProvider.GOOGLE} />)
        }
        {
          !availability?.connected_with_microsoft
            ? (<ConnectWith provider={OAuthProvider.MICROSOFT} />)
            : (<InstalledApp provider={OAuthProvider.MICROSOFT} />)
        }
      </section>
    </>
  );

  const DayRage = (v: { item: AvailabilityDay | ExtendTime, itemType: string }) => (
    <>
      <Select
        disabled={v.itemType != "extend" ? !(v.item as AvailabilityDay).enabled : false}
        defaultValue={intToTime(v.item.start_time)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Start" />
        </SelectTrigger>
        <SelectContent>
          {((v.itemType == "main" && (v.item as AvailabilityDay).enabled) || v.itemType == "extend") && (
            <SelectGroup>
              {timeReference.map((time, index) => (
                <SelectItem key={index} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
      <span>-</span>
      <Select
        disabled={v.itemType != "extend" ? !(v.item as AvailabilityDay).enabled : false}
        defaultValue={intToTime(v.item.end_time)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="End" />
        </SelectTrigger>
        <SelectContent>
          {((v.itemType == "main" && (v.item as AvailabilityDay).enabled) || v.itemType == "extend") && (
            <SelectGroup>
              {timeReference.map((time, index) => (
                <SelectItem key={index} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </>
  )

  const InstalledApp = (v: { provider: OAuthProvider }) => (
    <>
      <section className="bg-gray-100 relative rounded-md divide-y divide-dashed">
        {availability?.installed_apps?.calendars
          ?.filter((item) => item.provider === v.provider)
          .map((item, index) => (
            <div className="flex flex-row gap-4 p-4" key={index}>
              <img
                className="h-8 w-8 mt-2"
                src={item.logo}
                alt="google-calendar-logo"
              />
              <div className="relative overflow-auto">
                <h5 className="text-md font-semibold">{item.name}</h5>
                <p className="text-xs text-gray-600">
                  Toggle the calendars you want to check for conflicts to
                  prevent double bookings
                </p>
                <div className="flex flex-row items-center gap-2 mt-4">
                  <Switch
                    defaultChecked={true}
                    onCheckedChange={(checked: boolean) => onCalendarStateChange(checked, v.provider)}
                  />
                  <span className="text-xs">{item.email} (Calendar)</span>
                  {item.is_default && <Badge className="bg-gray-200 text-black hover:bg-gray-200 hover:text-black py-1 rounded-sm">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Adding events to
                  </Badge>}
                </div>
              </div>
            </div>
          ))}
        {availability?.installed_apps?.conferencing
          ?.filter((item) => item.provider === v.provider)
          .map((item, index) => (
            <div className="flex flex-row gap-4 p-4" key={index}>
              <img
                className="h-10 w-10"
                src={item.logo}
                alt="google-meet-logo"
              />
              <div className="relative overflow-auto">
                <h5 className="text-md font-semibold">
                  {item.name}
                  {item.is_default && (
                    <Badge className="bg-green-200 text-green-800 hover:bg-green-200 hover:text-green-800 py-1 ml-2 rounded-sm">
                      <span className="text-xs">Default</span>
                    </Badge>
                  )}
                </h5>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
      </section>
    </>
  );

  const ConnectWith = (v: { provider: OAuthProvider }) => (
    <>
      <div className="relative">
        <div className="bg-gray-600 w-full h-full absolute top-0 left-0 opacity-40 rounded-md z-10"></div>
        <div className="bg-gray-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-12 py-4 rounded-md z-20 bg-opacity-60">
          {v.provider == OAuthProvider.GOOGLE ? (
            <Button
              className="font-normal w-56"
              disabled={loading.google}
              onClick={() => issueNewOAuthURL(v.provider)}
            >
              {loading.google ? (
                <Loader2 className="w-4 animate-spin mr-1" />
              ) : (
                <img
                  className="w-6 h-6 mr-2"
                  src={googleLogo}
                  alt={v.provider + "-logo"}
                />
              )}
              Connect with {capitalizeFirstChar(v.provider)}
            </Button>
          ) : (
            <Button
              className="font-normal w-56"
              disabled={loading.microsoft}
              onClick={() => issueNewOAuthURL(v.provider)}
            >
              {loading.microsoft ? (
                <Loader2 className="w-4 animate-spin mr-1" />
              ) : (
                <img
                  className="w-[20px] h-[20px] mr-2"
                  src={microsoftLogo}
                  alt={v.provider + "-logo"}
                />
              )}
              Connect with {capitalizeFirstChar(v.provider)}
            </Button>
          )}
        </div>
        <section className="bg-gray-100 relative rounded-md divide-y divide-dashed">
          <div className="flex flex-row gap-4 p-4">
            <img
              className="h-8 w-8 mt-2"
              src={
                v.provider == OAuthProvider.GOOGLE
                  ? "https://stgreenskills001.blob.core.windows.net/assets/google-calendar-logo.svg"
                  : "https://stgreenskills001.blob.core.windows.net/assets/outlock-calendar-logo.svg"
              }
              alt={v.provider + "-calendar-logo"}
            />
            <div className="relative overflow-auto">
              <h5 className="text-md font-semibold">
                {v.provider == OAuthProvider.GOOGLE ? "Google" : "Outlook"} Calendar
              </h5>
              <p className="text-xs text-gray-600 truncate overflow-hidden ...">
                {v.provider == OAuthProvider.GOOGLE
                  ? `Google Calendar is a time management and scheduling service
                developed by Google. Allows users to create and edit events,
                with options available for type and time. Available to anyone
                that has a Gmail account on both mobile and web versions.`
                  : ` Microsoft Office 365 is a suite of apps that helps you stay
                  connected with others and get things done. It includes but is
                  not limited to Microsoft Word, PowerPoint, Excel, Teams, OneNote
                  and OneDrive. Office 365 allows you to work remotely with others
                  on a team and collaborate in an online environment. Both web
                  versions and desktop/mobile applications are available.`
                }
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-4 p-4">
            <img
              className={
                v.provider == OAuthProvider.GOOGLE
                  ? "h-10 w-10" : "h-8 w-8"
              }
              src={
                v.provider == OAuthProvider.GOOGLE
                  ? "https://stgreenskills001.blob.core.windows.net/assets/google-meet-logo.webp"
                  : "https://stgreenskills001.blob.core.windows.net/assets/microsoft-team-logo.svg"
              }
              alt={v.provider + "-conferece-logo"}
            />
            <div className="relative overflow-auto">
              <h5 className="text-md font-semibold">
                {v.provider == OAuthProvider.GOOGLE
                  ? "Google Meet" : "Microsoft 365/Teams (Requires work/school account)"
                }
              </h5>
              <p className="text-xs text-gray-600 truncate overflow-hidden ...">
                {v.provider == OAuthProvider.GOOGLE
                  ? ` Google Meet is Google's web-based video conferencing platform,
                designed to compete with major conferencing platforms.`
                  : `Microsoft Teams is a business communication platform and
                  collaborative workspace included in Microsoft 365. It offers
                  workspace chat and video conferencing, file storage, and
                  application integration. Both web versions and desktop/mobile
                  applications are available. NOTE: MUST HAVE A WORK / SCHOOL
                  ACCOUNT`
                }
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );

  const issueNewOAuthURL = async (provider: OAuthProvider) => {
    if (!provider) return;
    try {
      setLoading({
        google: provider == OAuthProvider.GOOGLE,
        microsoft: provider == OAuthProvider.MICROSOFT
      });
      const resp = await fetch(API_PATH.OAUTH_WEB_CONNECT(provider), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
        credentials: "include",
      });
      const { data } = await resp.json();
      window.location.href = data;
    } catch (error) {
      let em = "An unknown error occurred";
      if (error instanceof Error) {
        em = error.message;
      }
      toast({
        title: "Error create new Availability",
        description: <>{em}</>,
      });
    } finally {
      setLoading({
        google: false,
        microsoft: false
      });
    }
  };

  const onDayStateChange = (state: boolean, id: string) => {
    if (!availability || !id) return;
    const newAvailability = {
      ...availability,
      days: availability.days?.map(item => {
        if (item.id === id) {
          return { ...item, enabled: state };
        }
        return item;
      })
    };
    setAvailability(newAvailability)
  }

  const addNewExtendTime = (id: string) => {
    if (!availability || !id) return;
    const newAvailability = {
      ...availability,
      days: availability.days?.map(day => {
        if (day.id === id) {
          const extendTimes = day.extend_times || [];
          const newExtendTime: ExtendTime = {
            id: generateId(),
            start_time: day.end_time,
            end_time: addOneHour(day.end_time),
          };
          if (extendTimes.length > 0) {
            const lastExtendTime = extendTimes[extendTimes.length - 1];
            newExtendTime.start_time = lastExtendTime.end_time;
            newExtendTime.end_time = addOneHour(lastExtendTime.end_time);
          }
          return {
            ...day,
            extend_times: [...extendTimes, newExtendTime],
          };
        }
        return day;
      }),
    };
    setAvailability(newAvailability)
  }

  const removeExtendTime = (dayId: string, timeId: string) => {
    if (!dayId || !timeId || !availability?.days) return;
    const updatedAvailability = { ...availability };
    const updatedDays = updatedAvailability?.days?.map(day => {
      if (day.id === dayId && day.extend_times) {
        const updatedExtendTimes = day.extend_times
          .filter(extendTime => extendTime.id !== timeId);
        return {
          ...day,
          extend_times: updatedExtendTimes,
        };
      }
      return day;
    });
    updatedAvailability.days = updatedDays;
    setAvailability(updatedAvailability);
  }

  const onCalendarStateChange = (state: boolean, provider: string) => {
    console.log(state, provider)
  }

  return (
    <>
      {props?.loading && !availability ? (
        <AvailabilitySkeleton />
      ) : (
        <AvailabilitySection />
      )}
    </>
  );
}
