import { toast } from "@/components/ui/use-toast";
import { OAuthProvider } from "./enums";

const API_URL = "http://127.0.0.1:3000/api";

export const API_PATH = {
  PROFILE: `${API_URL}/v2/accounts/detail`,
  AVAILABILITY: `${API_URL}/v1/mentor-settings/availabilities`,
  AVAILABILITY_EXTEND_TIME: (dayId: string, timeId: string) =>
    `${API_URL}/v1/mentor-settings/availabilities/days/${dayId}/extend-times/${timeId}`,
  OAUTH_WEB_CONNECT: (provider: OAuthProvider) => `${API_URL}/v1/mentor-settings/oauth/${provider}/connect`,
  OAUTH_WEB_DISCONNECT: (provider: OAuthProvider) => `${API_URL}/v1/mentor-settings/oauth/${provider}/disconnect`,
};

export interface HttpResponse<T> {
  data: T | null;
}

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage: string;
    if (response.headers.get("Content-Type")?.includes("application/json")) {
      const errorData = await response.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
    } else {
      errorMessage = await response.text();
    }
    throw new Error(`HTTP Error: ${response.status} - ${errorMessage}`);
  }
  const data: T = await response.json();
  return data;
};

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
