import { API_PATH, Availability, OAuthProvider } from "@/lib/user";
import { Skeleton } from "./ui/skeleton";
import googleLogo from "../assets/google.webp";
import microsoftLogo from "../assets/microsoft.png";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { intToDay, intToTime, timeReference } from "@/lib/time";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ArrowLeftIcon, Clock, Globe, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { capitalizeFirstChar } from "@/lib/utils";

interface AvailabilityProps {
  loading: boolean;
  error?: string | null;
  jwt?: string;
  availability?: Availability | null;
}

export function AvailabilityCard(props: AvailabilityProps) {
  const [loading, setLoading] = useState(false);

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
      <h5 className="text-md font-semibold">{props?.availability?.label}</h5>
      <section className="mt-2 space-y-1">
        <span className="flex flex-row items-center text-sm font-normal">
          <Clock className="w-4 h-4 inline mr-1" />
          Mon - Fri, 09:00 - 16:00
        </span>
        <span className="flex flex-row items-center text-sm font-normal">
          <Globe className="w-4 h-4 inline mr-1" />
          {props?.availability?.timezone}
        </span>
      </section>
      <section className="flex flex-col my-4 gap-2">
        {props?.availability?.days?.map((item, index) => (
          <div
            className="flex flex-row justify-between items-center"
            key={index}
          >
            <div className="flex flex-row gap-4 items-center">
              <Switch
                checked={item.enabled}
                onCheckedChange={() => item.enabled != item.enabled}
              />
              <span>{intToDay(item.day)}</span>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Select
                disabled={!item.enabled}
                defaultValue={item.enabled ? intToTime(900) : ""}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent>
                  {item.enabled && (
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
                disabled={!item.enabled}
                defaultValue={item.enabled ? intToTime(1600) : ""}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="End" />
                </SelectTrigger>
                <SelectContent>
                  {item.enabled && (
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
            </div>
          </div>
        ))}
      </section>
      <section className="space-y-4">
        {
          !props?.availability?.connected_with_google
            ? (<ConnectWith provider={OAuthProvider.GOOGLE} />)
            : (<InstalledApp provider={OAuthProvider.GOOGLE} />)
        }
        {
          !props?.availability?.connected_with_microsoft
            ? (<ConnectWith provider={OAuthProvider.MICROSOFT} />)
            : (<InstalledApp provider={OAuthProvider.MICROSOFT} />)
        }
      </section>
    </>
  );

  const InstalledApp = (v: { provider: OAuthProvider }) => (
    <>
      <section className="bg-gray-100 relative rounded-md divide-y divide-dashed">
        {props?.availability?.installed_apps?.calendars
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
                  <Switch checked={true} />
                  <span>{item.email} (Calendar)</span>
                  {item.is_default && <Badge className="bg-gray-200 text-black hover:bg-gray-200 hover:text-black py-1 rounded-sm">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    <span className="text-xs">Adding events to</span>
                  </Badge>}
                </div>
              </div>
            </div>
          ))}
        {props?.availability?.installed_apps?.conferencing
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
            disabled={loading}
            onClick={() => issueNewOAuthURL(v.provider)}
          >
            {loading ? (
              <Loader2 className="w-4 animate-spin mr-1" />
            ) : (
              <img
                className={
                  v.provider == OAuthProvider.GOOGLE
                    ? "w-6 h-6 mr-2" : "w-[20px] h-[20px] mr-2"
                }
                src={
                  v.provider == OAuthProvider.GOOGLE
                    ? googleLogo : microsoftLogo
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
      setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <>
      {props?.loading && !props?.availability ? (
        <AvailabilitySkeleton />
      ) : (
        <AvailabilitySection />
      )}
    </>
  );
}
