import { OAuthProvider } from "@/lib/enums";
import { API_PATH, HttpResponse, HttpResponseList } from "@/lib/http";
import { Availability, Booking, MentorAvailabilitySlot, User } from "@/lib/user";
import { useMentorJWTStore } from "@/stores/mentorJWT";
import { useMenteeJWTStore } from "@/stores/menteeJWT";

export function useAPI() {
  const { mentorJWTValue, clearMentorJWT } = useMentorJWTStore();
  const { menteeJWTValue, clearMenteeJWT } = useMenteeJWTStore();

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

  const deleteAvailabilityDayOverride = async (p: { dayId: string }): Promise<HttpResponse<string>> => {
    const response = await fetch(API_PATH.AVAILABILITY_DATE_OVERRIDE(p.dayId), {
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

  const getMentors = async (): Promise<HttpResponse<HttpResponseList<User>>> => {
    const response = await fetch(API_PATH.MENTOR, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${menteeJWTValue}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        clearMenteeJWT();
      }
      throw new Error(`Failed to fetch mentor lists: ${response.statusText}`);
    }

    return await response.json();
  };

  const getMentorAvailbilitySlots = async (p: {
    userId: string;
    timezone: string;
    dateRange: string;
  }): Promise<HttpResponse<MentorAvailabilitySlot>> => {
    const response = await fetch(API_PATH.MENTOR_AVAILABILITY_SLOT(p.userId, p.timezone, p.dateRange), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${menteeJWTValue}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        clearMenteeJWT();
      }
      throw new Error(`Failed to fetch mentor lists: ${response.statusText}`);
    }

    return await response.json();
  };

  const createNewBooking = async (body: string): Promise<HttpResponse<Booking>> => {
    const response = await fetch(API_PATH.BOOKING, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${menteeJWTValue}`,
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

  const getMenteeSchedules = async (): Promise<HttpResponse<HttpResponseList<Booking>>> => {
    const response = await fetch(`${API_PATH.MENTEE_SCHEDULES}?limit=3`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${menteeJWTValue}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        clearMenteeJWT();
      }
      throw new Error(`Failed to fetch mentor lists: ${response.statusText}`);
    }

    return await response.json();
  };

  const requestCancelBooking = async (p: { id: string; body: string; }): Promise<HttpResponse<string>> => {
    const body = p.body;
    const response = await fetch(API_PATH.CANCEL_BOOKING(p.id), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${menteeJWTValue}`,
      },
      credentials: "include",
      body,
    });

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        clearMentorJWT();
      }
      throw new Error(`Failed to cancel booking: ${response.statusText}`);
    }

    return { data: "" } as HttpResponse<string>;
  };

  const requestRescheduleBooking = async (p: { id: string; body: string; }): Promise<HttpResponse<string>> => {
    const body = p.body;
    const response = await fetch(API_PATH.RESCHEDULE_BOOKING(p.id), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${menteeJWTValue}`,
      },
      credentials: "include",
      body,
    });

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        clearMentorJWT();
      }
      throw new Error(`Failed to cancel booking: ${response.statusText}`);
    }

    return { data: "" } as HttpResponse<string>;
  };

  return {
    getProfile,
    getAvailability,
    createNewAvailability,
    updateAvailability,
    deleteAvailabilityExtendTime,
    deleteAvailabilityDayOverride,
    createNewOAuthConnectUrl,
    getMentors,
    getMentorAvailbilitySlots,
    createNewBooking,
    getMenteeSchedules,
    requestCancelBooking,
    requestRescheduleBooking
  };
}
