import { atom } from "recoil";

interface ViewInterviewPopup {
  interviewId: string;
  status?: string;
  isPlaced?: boolean;
}

export const viewInterviewPopup = atom<ViewInterviewPopup>({
  key: "viewInterviewPopup",
  default: {
    interviewId: "",
  },
});
