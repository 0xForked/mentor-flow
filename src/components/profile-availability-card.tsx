import {
  API_PATH,
  Availability,
  AvailabilityDay,
  ExtendTime,
  HttpResponse,
  OAuthProvider,
  handleResponse,
} from "@/lib/user";
import { Skeleton } from "./ui/skeleton";
import googleLogo from "../assets/google.webp";
import microsoftLogo from "../assets/microsoft.png";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  addOneHour,
  intToDay,
  intToTime,
  strTimeToInt,
  timeReference,
} from "@/lib/time";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowLeftIcon,
  Clock,
  Globe,
  Loader2,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { capitalizeFirstChar } from "@/lib/utils";

interface AvailabilityProps {
  loading: boolean;
  error?: string | null;
  jwt?: string;
  availability?: Availability | null;
  callback(availability: Availability | null): void;
}

interface LoadingStates {
  [key: string]: boolean;
}

export function AvailabilityCard(props: AvailabilityProps) {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});

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
      <h5 className="text-md font-semibold">{props.availability?.label}</h5>
      <section className="mt-2 space-y-1">
        <span className="flex flex-row items-center text-sm font-normal">
          <Clock className="w-4 h-4 inline mr-1" />
          Mon - Fri, 09:00 - 16:00
        </span>
        <span className="flex flex-row items-center text-sm font-normal">
          <Globe className="w-4 h-4 inline mr-1" />
          {props.availability?.timezone}
        </span>
      </section>
      <section className="flex flex-col gap-4 my-6">
        {props.availability?.days?.map((day, index) => (
          <div
            className="flex w-full flex-col justify-between gap-4 last:mb-0 xl:flex-row xl:gap-12 xl:px-0"
            key={index}
          >
            <div className="flex h-[36px] items-center gap-4 md:w-32">
              {loadingStates[`switch-${day.id}`] ? (
                <Loader2 className="w-12 animate-spin" />
              ) : (
                <Switch
                  onCheckedChange={(checked: boolean) =>
                    onDayStateChange(checked, day)
                  }
                  defaultChecked={day.enabled}
                />
              )}
              <span>{intToDay(day.day)}</span>
            </div>
            <div className="flex sm:gap-2">
              {day.enabled && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 last:mb-0 sm:gap-2">
                    <div className="flex flex-row gap-2 items-center">
                      <DayRage dayId={day.id} item={day} itemType="main" />
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => addNewExtendTime(day)}
                      disabled={loadingStates[day.id]}
                    >
                      {loadingStates[day.id] ? (
                        <Loader2 className="w-4 animate-spin" />
                      ) : (
                        <PlusIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {day?.extend_times?.map((time, index) => (
                    <div className="flex gap-1 last:mb-0 sm:gap-2" key={index}>
                      <div className="flex flex-row gap-2 items-center">
                        <DayRage dayId={day.id} item={time} itemType="extend" />
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => removeExtendTime(day.id, time.id)}
                        disabled={loadingStates[time.id]}
                      >
                        {loadingStates[time.id] ? (
                          <Loader2 className="w-4 animate-spin" />
                        ) : (
                          <TrashIcon className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
      <section className="space-y-4">
        {!props.availability?.connected_with_google ? (
          <ConnectWith provider={OAuthProvider.GOOGLE} />
        ) : (
          <InstalledApp provider={OAuthProvider.GOOGLE} />
        )}
        {!props.availability?.connected_with_microsoft ? (
          <ConnectWith provider={OAuthProvider.MICROSOFT} />
        ) : (
          <InstalledApp provider={OAuthProvider.MICROSOFT} />
        )}
      </section>
    </>
  );

  const DayRage = (v: {
    dayId: string;
    item: AvailabilityDay | ExtendTime;
    itemType: string;
  }) => (
    <>
      {loadingStates[`select-${v.item.id}-start_time`] ? (
        <Skeleton className="h-[40px] w-[100px] bg-gray-200 flex ">
          <Loader2 className="animate-spin m-auto" />
        </Skeleton>
      ) : (
        <Select
          disabled={
            v.itemType != "extend"
              ? !(v.item as AvailabilityDay).enabled
              : false
          }
          defaultValue={intToTime(v.item.start_time)}
          onValueChange={(value: string) =>
            onTimeValueChange(
              v.item.id,
              v.dayId,
              v.itemType,
              "start_time",
              value,
            )
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Start" />
          </SelectTrigger>
          <SelectContent>
            {((v.itemType == "main" && (v.item as AvailabilityDay).enabled) ||
              v.itemType == "extend") && (
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
      )}
      <span>-</span>
      {loadingStates[`select-${v.item.id}-end_time`] ? (
        <Skeleton className="h-[40px] w-[100px] bg-gray-200 flex ">
          <Loader2 className="animate-spin m-auto" />
        </Skeleton>
      ) : (
        <Select
          disabled={
            v.itemType != "extend"
              ? !(v.item as AvailabilityDay).enabled
              : false
          }
          defaultValue={intToTime(v.item.end_time)}
          onValueChange={(value: string) =>
            onTimeValueChange(v.item.id, v.dayId, v.itemType, "end_time", value)
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="End" />
          </SelectTrigger>
          <SelectContent>
            {((v.itemType == "main" && (v.item as AvailabilityDay).enabled) ||
              v.itemType == "extend") && (
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
      )}
    </>
  );

  const InstalledApp = (v: { provider: OAuthProvider }) => (
    <>
      <section className="bg-gray-100 relative rounded-md divide-y divide-dashed">
        {props.availability?.installed_apps?.calendars
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
                    onCheckedChange={(checked: boolean) =>
                      onCalendarStateChange(checked, v.provider)
                    }
                  />
                  <span className="text-xs">{item.email} (Calendar)</span>
                  {item.is_default && (
                    <Badge className="bg-gray-200 text-black hover:bg-gray-200 hover:text-black py-1 rounded-sm">
                      <ArrowLeftIcon className="h-4 w-4 mr-2" />
                      Adding events to
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        {props.availability?.installed_apps?.conferencing
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
          <Button
            className="font-normal w-56"
            disabled={loadingStates[v.provider]}
            onClick={() => issueNewOAuthURL(v.provider)}
          >
            {loadingStates[v.provider] ? (
              <Loader2 className="w-4 animate-spin mr-1" />
            ) : (
              <img
                className={
                  v.provider == OAuthProvider.GOOGLE
                    ? "w-6 h-6 mr-2"
                    : "w-[20px] h-[20px] mr-2"
                }
                src={
                  v.provider == OAuthProvider.GOOGLE
                    ? googleLogo
                    : microsoftLogo
                }
                alt={v.provider + "-logo"}
              />
            )}
            Connect with {capitalizeFirstChar(v.provider)}
          </Button>
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
                {v.provider == OAuthProvider.GOOGLE ? "Google" : "Outlook"}{" "}
                Calendar
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
                  versions and desktop/mobile applications are available.`}
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-4 p-4">
            <img
              className={
                v.provider == OAuthProvider.GOOGLE ? "h-10 w-10" : "h-8 w-8"
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
                  ? "Google Meet"
                  : "Microsoft 365/Teams (Requires work/school account)"}
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
                  ACCOUNT`}
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
      setLoadingStates((prevState) => ({ ...prevState, [provider]: true }));
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
      setLoadingStates((prevState) => ({ ...prevState, [provider]: false }));
    }
  };

  const onDayStateChange = async (state: boolean, day: AvailabilityDay) => {
    if (!day) return;
    try {
      setLoadingStates((prevState) => ({
        ...prevState,
        [`switch-${day.id}`]: true,
      }));
      const req = await saveChanges(
        JSON.stringify({
          days: [
            {
              id: day.id,
              enabled: state,
              start_time: day.start_time,
              end_time: day.end_time,
            },
          ],
        }),
      );
      const resp = await handleResponse<HttpResponse<Availability>>(req);
      const availabilityData = resp?.data;
      props.callback(availabilityData);
    } catch (error) {
      let em = "An unknown error occurred";
      if (error instanceof Error) {
        em = error.message;
      }
      toast({
        title: "Failed to update day",
        description: <>{em}</>,
      });
    } finally {
      setLoadingStates((prevState) => ({
        ...prevState,
        [`switch-${day.id}`]: false,
      }));
    }
  };

  const onTimeValueChange = async (
    itemId: string,
    dayId: string,
    itemType: string,
    key: string,
    val: string,
  ) => {
    if (!itemId && !val && !props.availability) return;

    try {
      setLoadingStates((prevState) => ({
        ...prevState,
        [`select-${itemId}-${key}`]: true,
      }));

      const availabilityDay = props.availability?.days?.find(
        (day) => day.id === dayId,
      );
      if (!availabilityDay) {
        throw new Error("Availability day not found");
      }

      if (itemType == "main") {
        if (key === "start_time") {
          availabilityDay.start_time = strTimeToInt(val);
          // Apply if start_time > end_time, adjust end_time
          if (availabilityDay.start_time >= availabilityDay.end_time) {
            setLoadingStates((prevState) => ({
              ...prevState,
              [`select-${itemId}-end_time`]: true,
            }));
            availabilityDay.end_time = addOneHour(availabilityDay.start_time);
            toast({
              title: "Adjusted End Time",
              description: <>End time was adjusted due to start time change.</>,
            });
          }
        } else if (key === "end_time") {
          const timeValue = strTimeToInt(val);
          // Validate: if end_time <= start_time, throw error
          if (timeValue <= availabilityDay.start_time) {
            throw Error(
              "Invalid end time: End time cannot be earlier than or equal with start time.",
            );
          }
          availabilityDay.end_time = timeValue;
        }
      }

      if (itemType == "extend") {
        const extendTime = availabilityDay.extend_times?.find(
          (time) => time.id === itemId,
        );
        if (!extendTime) {
          throw new Error("Extend time not found");
        }
        if (key === "start_time") {
          extendTime.start_time = strTimeToInt(val);
          // Apply  if start_time >= end_time, adjust end_time
          if (extendTime.start_time >= extendTime.end_time) {
            setLoadingStates((prevState) => ({
              ...prevState,
              [`select-${itemId}-end_time`]: true,
            }));
            extendTime.end_time = addOneHour(extendTime.start_time);
            toast({
              title: "Adjusted End Time",
              description: <>End time was adjusted due to start time change.</>,
            });
          }
        } else if (key === "end_time") {
          const timeValue = strTimeToInt(val);
          // Validate: if end_time <= start_time, throw error
          if (timeValue <= extendTime.start_time) {
            throw Error(
              "Invalid end time: End time cannot be earlier than or equal with start time.",
            );
          }
          extendTime.end_time = timeValue;
        }
      }

      const req = await saveChanges(
        JSON.stringify({
          days: [
            {
              id: availabilityDay.id,
              enabled: availabilityDay.enabled,
              start_time: availabilityDay.start_time,
              end_time: availabilityDay.end_time,
              extend_times: availabilityDay.extend_times,
            },
          ],
        }),
      );
      const resp = await handleResponse<HttpResponse<Availability>>(req);
      const availabilityData = resp?.data;
      props.callback(availabilityData);
    } catch (error) {
      let em = "An unknown error occurred";
      if (error instanceof Error) {
        em = error.message;
      }
      toast({
        title: "Failed to update data",
        description: <>{em}</>,
      });
    } finally {
      setLoadingStates((prevState) => ({
        ...prevState,
        [`select-${itemId}-${key}`]: false,
      }));
      setLoadingStates((prevState) => ({
        ...prevState,
        [`select-${itemId}-end_time`]: false,
      }));
    }
  };

  const addNewExtendTime = async (day: AvailabilityDay) => {
    if (!day) return;
    try {
      setLoadingStates((prevState) => ({ ...prevState, [day.id]: true }));
      const extendTimes = day.extend_times || [];
      const newExtendTime: ExtendTime = {
        id: "",
        start_time: day.end_time,
        end_time: addOneHour(day.end_time),
      };
      if (extendTimes.length > 0) {
        const lastExtendTime = extendTimes[extendTimes.length - 1];
        newExtendTime.start_time = lastExtendTime.end_time;
        newExtendTime.end_time = addOneHour(lastExtendTime.end_time);
      }
      const updatedExtendTimes = [...extendTimes, newExtendTime];
      const req = await saveChanges(
        JSON.stringify({
          days: [
            {
              id: day.id,
              enabled: day.enabled,
              start_time: day.start_time,
              end_time: day.end_time,
              extend_times: updatedExtendTimes,
            },
          ],
        }),
      );
      const resp = await handleResponse<HttpResponse<Availability>>(req);
      const availabilityData = resp?.data;
      props.callback(availabilityData);
    } catch (error) {
      let em = "An unknown error occurred";
      if (error instanceof Error) {
        em = error.message;
      }
      toast({
        title: "Failed to add extend time",
        description: <>{em}</>,
      });
    } finally {
      setLoadingStates((prevState) => ({ ...prevState, [day.id]: false }));
    }
  };

  const removeExtendTime = async (dayId: string, timeId: string) => {
    if (!dayId || !timeId || !props.availability?.days) return;
    try {
      setLoadingStates((prevState) => ({ ...prevState, [timeId]: true }));
      await fetch(API_PATH.AVAILABILITY_EXTEND_TIME(dayId, timeId), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
        credentials: "include",
      });
    } catch (error) {
      let em = "An unknown error occurred";
      if (error instanceof Error) {
        em = error.message;
      }
      toast({
        title: "Failed to remove extend time",
        description: <>{em}</>,
      });
    } finally {
      const updatedAvailability = { ...props.availability };
      const updatedDays = updatedAvailability?.days?.map((day) => {
        if (day.id === dayId && day.extend_times) {
          const updatedExtendTimes = day.extend_times.filter(
            (extendTime) => extendTime.id !== timeId,
          );
          return {
            ...day,
            extend_times: updatedExtendTimes,
          };
        }
        return day;
      });
      updatedAvailability.days = updatedDays;
      props.callback(updatedAvailability);
      setLoadingStates((prevState) => ({ ...prevState, [timeId]: false }));
    }
  };

  const onCalendarStateChange = (state: boolean, provider: string) => {
    console.log(state, provider);
  };

  const saveChanges = async (payload: string) => {
    return await fetch(API_PATH.AVAILABILITY, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.jwt}`,
      },
      credentials: "include",
      body: payload,
    });
  };

  return (
    <>
      {props?.loading && !props.availability ? (
        <AvailabilitySkeleton />
      ) : (
        <AvailabilitySection />
      )}
    </>
  );
}
