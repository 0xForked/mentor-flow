import { create } from "zustand";

interface States {
  menteeJWTKey: string;
  menteeJWTValue: string;
}

interface Actions {
  setJWT: (jwtValue: string) => void;
  clearMenteeJWT: () => void;
}

export const useMenteeJWTStore = create<States & Actions>((set, get) => ({
  menteeJWTKey: "mentee_access_token",
  menteeJWTValue: "",
  setJWT: (menteeJWTValue: string) => set({ menteeJWTValue }),
  clearMenteeJWT: () => {
    const { menteeJWTKey } = get();
    localStorage.removeItem(menteeJWTKey);
    set({ menteeJWTValue: "" });
  },
}));
