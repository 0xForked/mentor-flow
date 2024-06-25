import { create } from "zustand";

interface States {
  mentorJWTKey: string;
  mentorJWTValue: string;
}

interface Actions {
  setJWT: (jwtValue: string) => void;
  clearMentorJWT: () => void;
}

export const useMentorJWTStore = create<States & Actions>((set, get) => ({
  mentorJWTKey: "mentor_access_token",
  mentorJWTValue: "",
  setJWT: (mentorJWTValue: string) => set({ mentorJWTValue }),
  clearMentorJWT: () => {
    const { mentorJWTKey } = get();
    localStorage.removeItem(mentorJWTKey);
    set({ mentorJWTValue: "" });
  },
}));
