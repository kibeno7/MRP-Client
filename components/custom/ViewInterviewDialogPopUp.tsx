"use client";

import { viewInterviewPopup } from "@/atoms/viewInterviewPopup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { successnotify } from "@/lib/notifications";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import ViewInterview from "./ViewInterview";

interface ViewInterviewPopup {
  interviewId: string;
}

export default function ViewInterviewDialogPopUp() {
  const [interviewId, setInterviewId] = useRecoilState<ViewInterviewPopup>(viewInterviewPopup);
  const { isPlaced, status } = useRecoilValue(viewInterviewPopup);

  useEffect(() => {
    setInterviewId((interviewId) => interviewId);
  }, [setInterviewId]);

  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl rounded-sm">
        <DialogHeader>
          <DialogTitle>Interview Details</DialogTitle>
        </DialogHeader>
        <ViewInterview />
        <DialogFooter>
          <DialogClose className="flex flex-row justify-center gap-4 items-center w-full">
            {status === "not-verified" && (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  onClick={() => {
                    router.push(
                      `/dashboard/updateInterview/${interviewId.interviewId}`
                    );
                  }}
                  onLoad={() => "Loading..."}
                >
                  Update
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await axios.delete(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview/${interviewId.interviewId}`,
                      {
                        withCredentials: true,
                      }
                    );
                    successnotify("Interview Deleted Successfully");
                    window.location.reload();
                  }}
                  onLoad={() => "Loading..."}
                >
                  Delete
                </Button>
              </>
            )}

            {isPlaced && status === "accepted" && (
              <Button
                type="button"
                size="sm"
                variant="default"
                className="mx-auto"
                onClick={() => {
                  router.push(
                    `/dashboard/generatePoster/${interviewId.interviewId}`
                  );
                }}
                onLoad={() => "Loading..."}
              >
                Generate Poster
              </Button>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
