import { User } from "@/lib/user";
import { create } from "zustand";

interface States {
  mentors: User[] | null;
  selectedMentor: User | null;
}

interface Actions {
  setMentors: (mentors: User[] | null) => void;
  setSelectedMentor: (selectedMentor: User | null) => void;
}

export const useUserMenteeStore = create<States & Actions>((set) => ({
  mentors: null,
  selectedMentor: null,
  setMentors: (mentors: User[] | null) => set({ mentors }),
  setSelectedMentor: (selectedMentor: User | null) => set({ selectedMentor }),
}));
