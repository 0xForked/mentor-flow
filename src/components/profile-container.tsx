import {
  API_PATH,
  User,
  Availability,
  handleResponse,
  ProfileStatus,
} from "@/lib/user";
import { useCallback, useEffect, useState } from "react";
import { PackageOpenIcon } from "lucide-react";
import { NewAvailabilityDialog } from "./new-availability-dialog";
import { ProfileCard } from "./profile-card";
import { AvailabilityCard } from "./profile-availability-card";

interface MentorProfileCardProps {
  jwt?: string;
}

export function ProfileContainer(props: MentorProfileCardProps) {
  const [profile, setProfile] = useState<User | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>({
    isMentor: false,
    availabilityDataExist: false,
    calendarAppIntegration: false,
    conferenceAppIntegration: false,
  });
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );

  const getProfile = useCallback(async () => {
    try {
      const pr = await fetch(API_PATH.PROFILE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
        credentials: "include",
      });
      const profileData = await handleResponse<User>(pr);
      const pd = profileData?.data;
      setProfile(pd);
      setProfileStatus((prevStatus) => ({
        ...prevStatus,
        isMentor: pd != null,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error instanceof Response) {
        const errorData = await error.json();
        setProfileError(
          errorData.message || "An error occurred while fetching profile data.",
        );
      } else if (error instanceof Error) {
        setProfileError(error.message);
      } else {
        setProfileError("An unknown error occurred");
      }
    }
  }, [props.jwt]);

  const getAvailability = useCallback(async () => {
    try {
      const ar = await fetch(API_PATH.AVAILABILITY, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
        credentials: "include",
      });
      const availabilityData = await handleResponse<Availability>(ar);
      const ad = availabilityData?.data;
      setAvailability(ad);
      setProfileStatus((prevStatus) => ({
        ...prevStatus,
        availabilityDataExist: ad != null,
        calendarAppIntegration: (() => {
          if (ad?.installed_apps == null) {
            return false;
          }
          if (ad?.installed_apps?.calendars == null) {
            return false;
          }
          return ad?.installed_apps?.calendars?.length > 0;
        })(),
        conferenceAppIntegration: (() => {
          if (ad?.installed_apps == null) {
            return false;
          }
          if (ad?.installed_apps?.conferencing == null) {
            return false;
          }
          return ad?.installed_apps?.conferencing?.length > 0;
        })(),
      }));
    } catch (error) {
      if (error instanceof Response) {
        const errorData = await error.json();
        setAvailabilityError(
          errorData.message ||
            "An error occurred while fetching availability data.",
        );
      } else if (error instanceof Error) {
        setAvailabilityError(error.message);
      } else {
        setAvailabilityError("An unknown error occurred");
      }
    }
  }, [props.jwt]);

  useEffect(() => {
    if (!props.jwt) {
      window.location.reload();
      return;
    }

    return () => {
      (async () => {
        try {
          setLoading(true);
          setProfileError(null);
          setAvailabilityError(null);
          await Promise.all([getProfile(), getAvailability()]);
        } finally {
          setLoading(false);
        }
      })();
    };
  }, [props.jwt, getProfile, getAvailability]);

  const newAvailability = (data: Availability) => {
    setAvailability(data);
    setProfileStatus((prevStatus) => ({
      ...prevStatus,
      availabilityDataExist: data != null,
      calendarAppIntegration: (() => {
        if (data?.installed_apps == null) {
          return false;
        }
        if (data?.installed_apps?.calendars == null) {
          return false;
        }
        return data?.installed_apps?.calendars?.length > 0;
      })(),
      conferenceAppIntegration: (() => {
        if (data?.installed_apps == null) {
          return false;
        }
        if (data?.installed_apps?.conferencing == null) {
          return false;
        }
        return data?.installed_apps?.conferencing?.length > 0;
      })(),
    }));
  };

  const NoAvailability = () => (
    <>
      <div className="flex flex-col">
        <PackageOpenIcon className="h-14 w-14 mx-auto" />
        <h5 className="text-md font-semibold mx-auto mt-2">No Data</h5>
        <p className="text-sm font-light mx-auto w-2/3 text-center">
          We couldn't find your availability. Please create new availability
          data!
        </p>
        <NewAvailabilityDialog jwt={props.jwt} callback={newAvailability} />
      </div>
    </>
  );

  return (
    <main className="grid grid-cols-3 w-full">
      <aside className="relative w-full overflow-hidden rounded-l-xl border border-dashed border-gray-400 opacity-75 p-4">
        Profile
        <hr className="border-dashed my-4" />
        <ProfileCard
          loading={loading}
          error={profileError}
          profile={profile}
          status={profileStatus}
        />
      </aside>
      <aside className="relative w-full overflow-hidden rounded-r-xl border border-dashed border-gray-400 opacity-75 p-4 col-span-2">
        Availability
        <hr className="border-dashed my-4" />
        {!loading && !availability && availabilityError?.includes("404") && (
          <NoAvailability />
        )}
        <AvailabilityCard
          loading={loading}
          error={availabilityError}
          jwt={props.jwt}
          availability={availability}
        />
      </aside>
    </main>
  );
}
