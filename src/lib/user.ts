export interface User {
  id: string;
}

export interface Availability {
  id: string;
  user_id: string;
}

export enum OAuthProvider {
  GOOGLE = "google",
  MICROSOFT = "microsoft",
}

const API_URL = "http://localhost:3000/api/v1";

export const API_PATH = {
  PROFILE: `${API_URL}/account`,
  AVAILABILITY: `${API_URL}/mentor-settings/availabilities`,
  // OAUTH_WEB_GRANT: (provider: string) =>
  //   `${API_URL}/mentor-settings/oauth/${provider}`,
};

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage: string;
    // Check if the content type is JSON
    if (response.headers.get("Content-Type")?.includes("application/json")) {
      // If JSON, parse the error message from response.json()
      const errorData = await response.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
    } else {
      // Otherwise, get error message from response.text()
      errorMessage = await response.text();
    }
    // Throw an error with the HTTP status and error message
    throw new Error(`HTTP Error: ${response.status} - ${errorMessage}`);
  }
  const data: T = await response.json();
  return data;
};
