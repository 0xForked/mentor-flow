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
    set((state) => {
      const newStates = { ...state.states };
      if (value) {
        newStates[key] = value;
      } else {
        delete newStates[key];
      }
      return { states: newStates };
    }),
}));
