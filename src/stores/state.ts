import { create } from "zustand";

interface LoadingState {
  [key: string]: boolean;
}

interface States {
  states: LoadingState;
}

interface Actions {
  setState: (key: string, value: boolean) => void;
}

export const useGlobalStateStore = create<States & Actions>((set) => ({
  states: {},
  setState: (key: string, value: boolean) =>
    set((state) => ({
      states: {
        ...state.states,
        [key]: value,
      },
    })),
}));
