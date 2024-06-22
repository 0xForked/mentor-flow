import { Avatar, AvatarFallback } from "./ui/avatar";
import { CheckIcon, XIcon } from "lucide-react";
import { useUserStore } from "@/stores/user";
import { ProfileSkeleton } from "./skeletons/profile";

export function ProfileCard() {
  const { profile, profileStatus } = useUserStore();

  const statusItems = [
    { label: 'Mentor', value: profileStatus.isMentor },
    { label: 'Availability', value: profileStatus.availabilityDataExist },
    { label: 'Calendar App Integration', value: profileStatus.calendarAppIntegration },
    { label: 'Conference App Integration', value: profileStatus.conferenceAppIntegration },
  ];

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
            {statusItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {item.value ? (
                  <CheckIcon className="w-4 text-green-500" />
                ) : (
                  <XIcon className="w-4 text-red-500" />
                )}
                {item.label}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
