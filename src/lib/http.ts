import { toast } from "@/components/ui/use-toast";
import { OAuthProvider } from "./enums";

const API_URL = "http://127.0.0.1:3000/api";

export const API_PATH = {
  PROFILE: `${API_URL}/v2/accounts/detail`,
  AVAILABILITY: `${API_URL}/v1/mentor-settings/availabilities`,
  AVAILABILITY_EXTEND_TIME: (dayId: string, timeId: string) =>
    `${API_URL}/v1/mentor-settings/availabilities/days/${dayId}/extend-times/${timeId}`,
  AVAILABILITY_DATE_OVERRIDE: (dayId: string) =>
    `${API_URL}/v1/mentor-settings/availabilities/day-overrides/${dayId}`,
  OAUTH_WEB_CONNECT: (provider: OAuthProvider) => `${API_URL}/v1/mentor-settings/oauth/${provider}/connect`,
  OAUTH_WEB_DISCONNECT: (provider: OAuthProvider) => `${API_URL}/v1/mentor-settings/oauth/${provider}/disconnect`,
  MENTOR: `${API_URL}/v2/community-members?profile_type=mentor`,
  MENTOR_AVAILABILITY_SLOT: (userId: string, timezone: string, dateRange: string) =>
    `${API_URL}/v1/mentor-schedules/${userId}/availabilities?timezone=${timezone}&date_range=${dateRange}`,
  BOOKING: `${API_URL}/v1/mentor-schedules/booking`,
  MENTEE_SCHEDULES: `${API_URL}/v1/mentor-schedules/my-bookings`,
  CANCEL_BOOKING: (bookingId: string) => `${API_URL}/v1/mentor-schedules/${bookingId}/cancel`,
  RESCHEDULE_BOOKING: (bookingId: string) => `${API_URL}/v1/mentor-schedules/${bookingId}/reschedule`,
};

export interface HttpResponse<T> {
  data: T | null;
}

export interface HttpResponseList<T> {
  list: T[] | null;
}

export const handleError = async (error: unknown) => {
  let em = "An unknown error occurred";
  if (error instanceof Response) {
    const errorData = await error.json();
    em = errorData.message || "An error occurred while fetching profile data.";
  }
  if (error instanceof Error) {
    em = error.message;
  }
  toast({
    title: "HTTP Error",
    description: em,
  });
};
