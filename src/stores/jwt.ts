import { create } from "zustand";

interface States {
  jwtKey: string;
  jwtValue: string;
}

interface Actions {
  setJWT: (jwtValue: string) => void;
  clearJWT: () => void;
}

export const useJWTStore = create<States & Actions>((set, get) => ({
  jwtKey: "access_token",
  jwtValue: "",
  setJWT: (jwtValue: string) => set({ jwtValue }),
  clearJWT: () => {
    const { jwtKey } = get();
    localStorage.removeItem(jwtKey);
    set({ jwtValue: "" });
  },
}));
