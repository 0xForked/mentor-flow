import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckIcon, XIcon } from "lucide-react";
import { useUserMentorStore } from "@/stores/userMentor";
import { ProfileSkeleton } from "@/components/skeletons/profile";

export function ProfileCard() {
  const { profile, profileStatus } = useUserMentorStore();

  const statusItems = [
    { label: "Mentor", value: profileStatus.isMentor },
    { label: "Bio & Social", value: false },
    { label: "Mentorship Focus", value: false },
    { label: "Accept Terms", value: false },
    { label: "Setup Calendar & Availabiltiy", value: profileStatus.availabilityDataExist },
    { label: "Calendar App Integration", value: profileStatus.calendarAppIntegration },
    { label: "Conference App Integration", value: profileStatus.conferenceAppIntegration },
    { label: "Add an Offer (session or plan)", value: false },
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
                {item.value ? <CheckIcon className="w-4 text-green-500" /> : <XIcon className="w-4 text-red-500" />}
                {item.label}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
