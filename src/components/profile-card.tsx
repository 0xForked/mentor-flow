import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CheckIcon, XIcon } from "lucide-react";
import { ProfileStatus, User } from "@/lib/user";

interface ProfileCardProps {
  loading: boolean;
  error?: string | null;
  profile: User | null;
  status: ProfileStatus;
}

export function ProfileCard(props: ProfileCardProps) {
  const ProfileSkeleton = () => (
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

  const ProfileSection = () => (
    <>
      <div className="flex flex-row gap-2 items-center rounded-xl bg-gray-100 p-4">
        <Avatar>
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <section>
          <h5 className="text-smfont-semibold">{props?.profile?.nick_name}</h5>
          <p className="text-xs font-medium">{props?.profile?.email}</p>
        </section>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs">
          {!props?.status?.isMentor && <XIcon className="w-4 text-red-500" />}
          {props?.status.isMentor && (
            <CheckIcon className="w-4 text-green-500" />
          )}
          Mentor
        </div>
        <div className="flex items-center gap-2 text-xs">
          {!props?.status?.availabilityDataExist && (
            <XIcon className="w-4 text-red-500" />
          )}
          {props?.status.availabilityDataExist && (
            <CheckIcon className="w-4 text-green-500" />
          )}
          Availability
        </div>
        <div className="flex items-center gap-2 text-xs">
          {!props?.status?.calendarAppIntegration && (
            <XIcon className="w-4 text-red-500" />
          )}
          {props?.status.calendarAppIntegration && (
            <CheckIcon className="w-4 text-green-500" />
          )}
          Calendar App Integration
        </div>
        <div className="flex items-center gap-2 text-xs">
          {!props?.status?.conferenceAppIntegration && (
            <XIcon className="w-4 text-red-500" />
          )}
          {props?.status.conferenceAppIntegration && (
            <CheckIcon className="w-4 text-green-500" />
          )}
          Conference App Integration
        </div>
      </div>
    </>
  );

  return (
    <>
      {props?.loading && <ProfileSkeleton />}
      {!props?.loading && <ProfileSection />}
    </>
  );
}
