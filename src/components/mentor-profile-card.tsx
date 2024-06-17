import { API_PATH, User, Availability, handleResponse } from "@/lib/user";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CheckIcon, Clock, Globe, PackageOpenIcon, XIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
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
import { NewAvailabilityDialog } from "./new-availability-dialog";

interface MentorProfileCardProps {
  jwt?: string;
}

function ProfileSection() {
  return (
    <>
      <div className="flex flex-row gap-2 items-center rounded-xl bg-gray-100 p-4">
        <Avatar>
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <section>
          <h5 className="text-smfont-semibold">Mentor</h5>
          <p className="text-xs font-medium">mentor@current.app</p>
        </section>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs">
          <CheckIcon className="w-4 text-green-500" />
          Mentor
        </div>
        <div className="flex items-center gap-2 text-xs">
          <XIcon className="w-4 text-red-500" />
          Availability
        </div>
        <div className="flex items-center gap-2 text-xs">
          <XIcon className="w-4 text-red-500" />
          Calendar App Integration
        </div>
        <div className="flex items-center gap-2 text-xs">
          <XIcon className="w-4 text-red-500" />
          Meeting App Integration
        </div>
      </div>
    </>
  );
}

function ProfileSkeleton() {
  return (
    <>
      <div className="flex flex-row gap-2 items-center rounded-xl bg-gray-100 p-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[60px]" />
          <Skeleton className="h-4 w-[110px]" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <Skeleton className="h-4 w-[15px]" />
          <Skeleton className="h-4 w-[40px]" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Skeleton className="h-4 w-[15px]" />
          <Skeleton className="h-4 w-[60px]" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Skeleton className="h-4 w-[15px]" />
          <Skeleton className="h-4 w-[110px]" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Skeleton className="h-4 w-[15px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    </>
  );
}

function AvailabilitySection() {
  return (
    <>
      <h5 className="text-md font-semibold">Working Hours</h5>
      <section className="mt-2 space-y-1">
        <span className="flex flex-row items-center text-sm font-normal">
          <Clock className="w-4 h-4 inline mr-1" />
          Mon - Fri, 09:00 - 16:00
        </span>
        <span className="flex flex-row items-center text-sm font-normal">
          <Globe className="w-4 h-4 inline mr-1" />
          Asia/Singapore
        </span>
      </section>
      <section className="flex flex-col my-4 gap-2">
        {[0, 1, 2, 3, 4, 5, 6].map((item) => (
          <div
            className="flex flex-row justify-between items-center"
            key={item}
          >
            <div className="flex flex-row gap-4 items-center">
              <Switch checked={![0, 6].includes(item)} />
              <span>{intToDay(item)}</span>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Select
                disabled={[0, 6].includes(item)}
                defaultValue={![0, 6].includes(item) ? intToTime(900) : ""}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent>
                  {![0, 6].includes(item) && (
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
                disabled={[0, 6].includes(item)}
                defaultValue={![0, 6].includes(item) ? intToTime(1600) : ""}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="End" />
                </SelectTrigger>
                <SelectContent>
                  {![0, 6].includes(item) && (
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
    </>
  );
}

function AvailabilitySkeleton() {
  return (
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
    </>
  );
}

function NoAvailability() {
  return (
    <>
      <div className="flex flex-col">
        <PackageOpenIcon className="h-14 w-14 mx-auto" />
        <h5 className="text-md font-semibold mx-auto mt-2">No Data</h5>
        <p className="text-sm font-light mx-auto w-2/3 text-center">
          We couldn't find your availability. Please create new availability
          data!
        </p>
        {/* <Button className="w-36 mx-auto mt-4">New Availability</Button> */}
        <NewAvailabilityDialog />
      </div>
    </>
  );
}

export function MentorProfileCard(props: MentorProfileCardProps) {
  // const [profile, setProfile] = useState<User | null>(null);
  // const [availability, setAvailabilty] = useState<Availability | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [profileError, setProfileError] = useState<string | null>(null);
  // const [availabilityError, setAvailabilityError] = useState<string | null>(
  //   null,
  // );

  useEffect(() => {
    if (!props.jwt) {
      window.location.reload();
      return;
    }

    //   (async () => {
    //     try {
    //       setLoading(true);
    //       setProfileError(null);
    //       setAvailabilityError(null);

    //       const [pr, ar] = await Promise.all([
    //         fetch(API_PATH.PROFILE, {
    //           method: "GET",
    //           headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${props.jwt}`,
    //           },
    //           credentials: "include",
    //         }),
    //         fetch(API_PATH.AVAILABILITY, {
    //           method: "GET",
    //           headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${props.jwt}`,
    //           },
    //           credentials: "include",
    //         }),
    //       ]);

    //       const pd = await handleResponse<User>(pr);
    //       const ad = await handleResponse<Availability>(ar);

    //       setProfile(pd);
    //       setAvailabilty(ad);
    //     } catch (error) {
    //       console.error("Error fetching data:", error);
    //       if (error instanceof Error) {
    //         if (error.message.includes("PROFILE")) {
    //           setProfileError(error.message);
    //         } else if (error.message.includes("AVAILABILITY")) {
    //           setAvailabilityError(error.message);
    //         } else {
    //           // Handle unexpected errors
    //           setProfileError("An unexpected error occurred");
    //         }
    //       } else {
    //         // Handle non-Error types here if needed
    //         setProfileError("An unknown error occurred");
    //       }
    //     } finally {
    //       setLoading(false);
    //     }
    //   })();
  }, [props.jwt]);

  return (
    <main className="grid grid-cols-3 w-full">
      <aside className="relative w-full overflow-hidden rounded-l-xl border border-dashed border-gray-400 opacity-75 p-4">
        Profile
        <hr className="border-dashed my-4" />
        <ProfileSkeleton />
        <ProfileSection />
      </aside>
      <aside className="relative w-full overflow-hidden rounded-r-xl border border-dashed border-gray-400 opacity-75 p-4 col-span-2">
        Availability
        <hr className="border-dashed my-4" />
        <AvailabilitySkeleton />
        <NoAvailability />
        <AvailabilitySection />
      </aside>
    </main>
  );
}
