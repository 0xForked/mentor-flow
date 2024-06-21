import { Avatar, AvatarFallback } from "./ui/avatar";
import { CheckIcon, XIcon } from "lucide-react";
import { useUserStore } from "@/stores/user";
import { ProfileSkeleton } from "./skeletons/profile";

export function ProfileCard() {
  const { profile, profileStatus } = useUserStore();

  return (
    <>
      {!profile ? (
        <ProfileSkeleton />
      ) : (
        <>
          <div className="flex flex-row gap-2 items-center rounded-xl bg-gray-100 p-4">
            <Avatar>
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <section>
              <h5 className="text-smfont-semibold">{profile?.nick_name}</h5>
              <p className="text-xs font-medium">{profile?.email}</p>
            </section>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 text-xs">
              {!profileStatus?.isMentor ? (
                <XIcon className="w-4 text-red-500" />
              ) : (
                <CheckIcon className="w-4 text-green-500" />
              )}
              Mentor
            </div>
            <div className="flex items-center gap-2 text-xs">
              {!profileStatus?.availabilityDataExist ? (
                <XIcon className="w-4 text-red-500" />
              ) : (
                <CheckIcon className="w-4 text-green-500" />
              )}
              Availability
            </div>
            <div className="flex items-center gap-2 text-xs">
              {!profileStatus?.calendarAppIntegration ? (
                <XIcon className="w-4 text-red-500" />
              ) : (
                <CheckIcon className="w-4 text-green-500" />
              )}
              Calendar App Integration
            </div>
            <div className="flex items-center gap-2 text-xs">
              {!profileStatus?.conferenceAppIntegration ? (
                <XIcon className="w-4 text-red-500" />
              ) : (
                <CheckIcon className="w-4 text-green-500" />
              )}
              Conference App Integration
            </div>
          </div>
        </>
      )}
    </>
  );
}
