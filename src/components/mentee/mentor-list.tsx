import { GlobalStateKey } from "@/lib/enums";
import { User } from "@/lib/user";
import { capitalizeFirstChar } from "@/lib/utils";
import { useGlobalStateStore } from "@/stores/state";
import { useUserMenteeStore } from "@/stores/userMentee";
import { MapPinIcon } from "lucide-react";

export const MentorList = () => {
  const { mentors, setSelectedMentor } = useUserMenteeStore();
  const { setState } = useGlobalStateStore();

  const onMentorSelected = (mentor: User) => {
    setSelectedMentor(mentor);
    setState(GlobalStateKey.MentorCalendarDialog, true);
  };

  return (
    <>
      <div className="flex flex-wrap flex-row -mx-4 justify-center gap-8">
        {mentors?.map((mentor) => (
          <button
            className="flex-shrink max-w-full p-4 w-2/3 sm:w-1/2 md:w-5/12 lg:w-1/4 xl:p-6 border-4 rounded-sm border-dashed hover:bg-gray-100 hover:border-solid"
            key={mentor.id}
            onClick={() => onMentorSelected(mentor)}
          >
            <div className="relative overflow-hidden mb-12 hover-grayscale-0 wow fadeInUp mentor-list" data-wow-duration="1s">
              <div className="relative overflow-hidden px-6">
                <img
                  src={mentor.avatar}
                  className="max-w-full h-auto mx-auto rounded-full bg-gray-50 grayscale"
                  alt={"@" + mentor.username}
                />
              </div>
              <div className="pt-6 text-center">
                <p className="text-lg leading-normal font-bold">{mentor.full_name}</p>
                <p className="text-gray-500 leading-relaxed font-normal mb-1">@{mentor.username}</p>
                <div className="flex justify-center items-center gap-1 text-gray-500">
                  <MapPinIcon className="w-4 h-4" />
                  <p className="leading-relaxed font-light">{capitalizeFirstChar(mentor?.location ?? "")}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};
