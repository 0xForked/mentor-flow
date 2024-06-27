import { MentorAvailabilitySlot, User } from "@/lib/user";
import { create } from "zustand";

interface States {
  blockDays: number[];
  availableDates: string[];
  mentors: User[] | null;
  selectedMentor: User | null;
  availabilitySlots: MentorAvailabilitySlot | null;
}

interface Actions {
  setMentors: (mentors: User[] | null) => void;
  setSelectedMentor: (selectedMentor: User | null) => void;
  setAvailabilitySlots: (availabilitySlots: MentorAvailabilitySlot | null) => void;
  cleanMenteeState: () => void;
}

export const useUserMenteeStore = create<States & Actions>((set, get) => {
  const updateBlockDays = () => {
    const { availabilitySlots } = get();
    const days = availabilitySlots?.availability?.days;
    const filteredBlockDays = days?.filter((item) => !item.enabled);
    const blockDays = filteredBlockDays?.map((item) => item.day) || [];
    const daySlosts = availabilitySlots?.slots ?? {};
    const availableDates = Object.keys(daySlosts);
    set({ blockDays, availableDates });
  };

  return {
    blockDays: [],
    availableDates: [],
    mentors: null,
    selectedMentor: null,
    availabilitySlots: null,
    setMentors: (mentors: User[] | null) => set({ mentors }),
    setSelectedMentor: (selectedMentor: User | null) => set({ selectedMentor }),
    setAvailabilitySlots: (availabilitySlots: MentorAvailabilitySlot | null) => {
      set({ availabilitySlots });
      updateBlockDays();
    },
    cleanMenteeState: () =>
      set({
        blockDays: [],
        availableDates: [],
        mentors: null,
        selectedMentor: null,
        availabilitySlots: null,
      }),
  };
});
