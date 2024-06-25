import { OAuthProvider } from "@/lib/enums";
import { API_PATH, HttpResponse } from "@/lib/http";
import { Availability, User } from "@/lib/user";
import { useMentorJWTStore } from "@/stores/mentorJWT";
// import { useMenteeJWTStore } from "@/stores/menteeJWT";

export function useAPI() {
  const { mentorJWTValue, clearMentorJWT } = useMentorJWTStore();
  // const { menteeJWTValue, clearMenteeJWT } = useMenteeJWTStore();

  const getProfile = async (): Promise<HttpResponse<User>> => {
    const response = await fetch(API_PATH.PROFILE, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mentorJWTValue}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        clearMentorJWT();
      }
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    return await response.json();
  };

  const getAvailability = async (): Promise<HttpResponse<Availability>> => {
    const response = await fetch(API_PATH.AVAILABILITY, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mentorJWTValue}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        clearMentorJWT();
      }
      throw new Error(`Failed to fetch availability: ${response.statusText}`);
    }

    return await response.json();
  };

  const createNewAvailability = async (body: string): Promise<HttpResponse<Availability>> => {
    const response = await fetch(API_PATH.AVAILABILITY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mentorJWTValue}`,
      },
      credentials: "include",
      body,
    });

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        clearMentorJWT();
      }
      throw new Error(`Failed to create availability: ${response.statusText}`);
    }

    return await response.json();
  };

  const updateAvailability = async (body: string): Promise<HttpResponse<Availability>> => {
    const response = await fetch(API_PATH.AVAILABILITY, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mentorJWTValue}`,
      },
      credentials: "include",
      body,
    });

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        clearMentorJWT();
      }
      throw new Error(`Failed to create availability: ${response.statusText}`);
    }

    return await response.json();
  };

  const deleteAvailabilityExtendTime = async (p: { dayId: string; timeId: string }): Promise<HttpResponse<string>> => {
    const response = await fetch(API_PATH.AVAILABILITY_EXTEND_TIME(p.dayId, p.timeId), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mentorJWTValue}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        clearMentorJWT();
      }
      throw new Error(`Failed to delete extend time: ${response.statusText}`);
    }

    // avoid get error cause by NoContent respond
    return { data: "" } as HttpResponse<string>;
  };

  const createNewOAuthConnectUrl = async (provider: OAuthProvider): Promise<HttpResponse<string>> => {
    const response = await fetch(API_PATH.OAUTH_WEB_CONNECT(provider), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mentorJWTValue}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        clearMentorJWT();
      }
      throw new Error(`Failed to create availability: ${response.statusText}`);
    }

    return await response.json();
  };

  return {
    getProfile,
    getAvailability,
    createNewAvailability,
    updateAvailability,
    deleteAvailabilityExtendTime,
    createNewOAuthConnectUrl,
  };
}
