import {
  User,
  Availability,
} from "@/lib/user";
import {
  API_PATH,
  handleResponse,
  HttpResponse,
} from "@/lib/http";
import { useCallback, useEffect, useState } from "react";
import { PackageOpenIcon } from "lucide-react";
import { NewAvailabilityDialog } from "./new-availability-dialog";
import { ProfileCard } from "./profile-card";
import { AvailabilityCard } from "./profile-availability-card";
import { useJWTStore } from "@/states/jwtStore";
import { useUserStore } from "@/states/userStore";
import { toast } from "./ui/use-toast";

export function ProfileContainer() {
  const { jwtValue, jwtKey, setJWT } = useJWTStore();
  const { availability, setUserProfile, setUserAvailability } = useUserStore();
  const [notFound, setNotFound] = useState(false);

  const getProfile = useCallback(async () => {
    try {
      const pr = await fetch(API_PATH.PROFILE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtValue}`,
        },
        credentials: "include",
      });
      const profileData = await handleResponse<HttpResponse<User>>(pr);
      const pd = profileData?.data;
      setUserProfile(pd);
    } catch (error) {
      let msg = "An unknown error occurred"
      if (error instanceof Response) {
        const errorData = await error.json();
        msg = errorData.message || "An error occurred while fetching profile data."
      }
      if (error instanceof Error) {
        msg = error.message;
      }
      toast({
        title: "Error fetching profile data",
        description: <>{msg}</>,
      });
    }
  }, [jwtValue, setUserProfile]);

  const getAvailability = useCallback(async () => {
    try {
      const ar = await fetch(API_PATH.AVAILABILITY, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtValue}`,
        },
        credentials: "include",
      });
      const availabilityData =
        await handleResponse<HttpResponse<Availability>>(ar);
      const ad = availabilityData?.data;
      setUserAvailability(ad);
    } catch (error) {
      let msg = "An unknown error occurred"
      if (error instanceof Response) {
        const errorData = await error.json();
        msg = errorData.message || "An error occurred while fetching profile data."
      }
      if (error instanceof Error) {
        msg = error.message;
      }
      toast({
        title: "Error fetching availability data",
        description: <>{msg}</>,
      });
      setNotFound(msg?.includes("404"))
      if (msg?.includes("401")) {
        localStorage.removeItem(jwtKey)
        setJWT("")
      }
    }
  }, [jwtValue, setUserAvailability, jwtKey, setJWT]);

  useEffect(() => {
    if (!jwtValue) {
      window.location.reload();
      return;
    }

    return () => {
      (async () => {
        setNotFound(false);
        await Promise.all([getProfile(), getAvailability()]);
      })();
    };
  }, [jwtValue, getProfile, getAvailability]);

  return (
    <main className="grid grid-cols-3 w-full">
      <aside className="relative w-full overflow-hidden rounded-l-xl border border-dashed border-gray-400 opacity-75 p-4">
        Profile
        <hr className="border-dashed my-4" />
        <ProfileCard />
      </aside>
      <aside className="relative w-full overflow-hidden rounded-r-xl border border-dashed border-gray-400 opacity-75 p-4 col-span-2">
        Availability
        <hr className="border-dashed my-4" />
        {!availability && notFound ? (
          <div className="flex flex-col">
            <PackageOpenIcon className="h-14 w-14 mx-auto" />
            <h5 className="text-md font-semibold mx-auto mt-2">No Data</h5>
            <p className="text-sm font-light mx-auto w-2/3 text-center">
              We couldn't find your availability. Please create new availability
              data!
            </p>
            <NewAvailabilityDialog />
          </div>
        ) : (
          <AvailabilityCard />
        )}
      </aside>
    </main>
  );
}
