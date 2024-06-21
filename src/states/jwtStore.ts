import { create } from 'zustand';

interface JWTStore {
  jwtKey: string;
  jwtValue: string;
  setJWT: (jwtValue: string) => void;
  clearJWT: () => void;
}

export const useJWTStore = create<JWTStore>((set) => ({
  jwtKey: 'access_token',
  jwtValue: '',
  setJWT: (jwtValue: string) => set({ jwtValue }),
  clearJWT: () => set({ jwtValue: '' }),
}));
