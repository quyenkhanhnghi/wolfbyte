import { create } from "zustand";

interface UIContextProps {
  isModalOpen: boolean;
  setModalOpen: () => void;
  setModalClose: () => void;
  promptSuggestion: string;
  setPromptSuggestion: (promptSuggestion: string) => void;
}
export const useUIContext = create<UIContextProps>((set) => ({
  isModalOpen: false,
  setModalOpen: () => set({ isModalOpen: true }),
  setModalClose: () => set({ isModalOpen: false }),
  promptSuggestion: "",
  setPromptSuggestion: (promptSugesstion) =>
    set({ promptSuggestion: promptSugesstion }),
}));
