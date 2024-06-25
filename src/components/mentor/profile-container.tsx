import { User, Availability } from "@/lib/user";
import { handleError, HttpResponse } from "@/lib/http";
import { PackageOpenIcon } from "lucide-react";
import { NewAvailabilityDialog } from "@/components/mentor/new-availability-dialog";
import { ProfileCard } from "@/components/mentor/profile-card";
import { AvailabilityCard } from "@/components/mentor/availability-card";
import { useUserMentorStore } from "@/stores/userMentor";
import { useAPI } from "@/hooks/useApi";
import { useQuery } from "react-query";
import { useGlobalStateStore } from "@/stores/state";
import { GlobalStateKey } from "@/lib/enums";

export function ProfileContainer() {
  const { getProfile, getAvailability } = useAPI();
  const { setUserProfile, setUserAvailability } = useUserMentorStore();
  const { states, setState } = useGlobalStateStore();

  const profile = useQuery<HttpResponse<User>>("profile", getProfile, {
    onSuccess: (resp) => setUserProfile(resp?.data),
    onError: (error) => handleError(error),
    retry: false,
  });

  const availability = useQuery<HttpResponse<Availability>>("availability", getAvailability, {
    onSuccess: (resp) => {
      setUserAvailability(resp?.data);
      setState(GlobalStateKey.DisplayNoAvailabilityModal, false);
    },
    onError: (error: unknown) => {
      handleError(error);
      if (error instanceof Error && error.message?.includes("Not Found")) {
        setState(GlobalStateKey.DisplayNoAvailabilityModal, true);
      }
    },
    retry: false,
  });

  return (
    <main className="grid grid-cols-3 w-full">
      <aside className="relative w-full overflow-hidden rounded-l-xl border border-dashed border-gray-400 opacity-75 p-4">
        Profile
        <hr className="border-dashed my-4" />
        {profile.isError ? "Error get profile - retry" : <ProfileCard />}
      </aside>
      <aside className="relative w-full overflow-hidden rounded-r-xl border border-dashed border-gray-400 opacity-75 p-4 col-span-2">
        Availability
        <hr className="border-dashed my-4" />
        {states[GlobalStateKey.DisplayNoAvailabilityModal] ? (
          <div className="flex flex-col">
            <PackageOpenIcon className="h-14 w-14 mx-auto" />
            <h5 className="text-md font-semibold mx-auto mt-2">No Data</h5>
            <p className="text-sm font-light mx-auto w-2/3 text-center">
              We couldn't find your availability. Please create new availability data!
            </p>
            <NewAvailabilityDialog />
          </div>
        ) : availability.isError ? (
          "Error get availability - retry"
        ) : (
          <AvailabilityCard />
        )}
      </aside>
    </main>
  );
}
