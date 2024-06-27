import { create } from "zustand";

interface LoadingState {
  [key: string]: boolean;
}

interface StringState {
  [key: string]: string;
}

interface States {
  states: LoadingState;
  stringState: StringState;
}

interface Actions {
  setState: (key: string, value: boolean) => void;
  setStringState: (key: string, value: string) => void;
  cleanState: () => void;
  cleanBooleanState: () => void;
  cleanStringState: () => void;
}

export const useGlobalStateStore = create<States & Actions>((set) => ({
  states: {},
  stringState: {},
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
  setStringState: (key: string, value: string) =>
    set((state) => {
      const newStringStates = { ...state.stringState };
      if (value) {
        newStringStates[key] = value;
      } else {
        delete newStringStates[key];
      }
      return { stringState: newStringStates };
    }),
  cleanState: () => set({ states: {}, stringState: {} }),
  cleanBooleanState: () => set({ states: {} }),
  cleanStringState: () => set({ stringState: {} }),
}));
