import { viewInterviewPopup } from "@/atoms/viewInterviewPopup"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { errornotify, successnotify } from "@/lib/notifications"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import ViewInterview from "./ViewInterview"

interface ViewInterviewPopup {
    interviewId: string;
}

export default function VerificationDialogPopUp() {
    const [interviewId, setInterviewId] = useRecoilState<ViewInterviewPopup>(viewInterviewPopup);

    useEffect(() => {
        setInterviewId((interviewId) => interviewId);
    }, [setInterviewId]);

    const [isRejectLoading, setIsRejectLoading] = useState(false);
    const [isAcceptLoading, setIsAcceptLoading] = useState(false);

    const rejectInterviewHandler = async () => {
        setIsRejectLoading(true);
        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/verify/${interviewId.interviewId}/rejected`, {}, {
                withCredentials: true,
            });
            console.log(response.data.data.data);
            if (response.data.status === "success") {
                successnotify("Interview Rejected Successfully");
                window.location.reload();
            } else {
                errornotify("Failed to reject the interview");
            }
        } catch (error) {
            errornotify("Fail to reject the interview: Axios Call failed");
            console.log(error);
        } finally {
            setIsRejectLoading(false);
        }
    };

    const acceptInterviewHandler = async () => {
        setIsAcceptLoading(true);
        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/verify/${interviewId.interviewId}/accepted`, {}, {
                withCredentials: true,
            });
            console.log(response.data.data.data);
            if (response.data.status === "success") {
                successnotify("Interview Accepted Successfully");
                window.location.reload();
            } else {
                errornotify("Failed to accept the interview");
            }
        } catch (error) {
            errornotify("Fail to accept the interview: Axios Call failed");
            console.log(error)
        } finally {
            setIsAcceptLoading(true);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">View</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription>
                </DialogHeader>
                <ViewInterview />
                <div className="flex items-center justify-center flex-row space-x-2">
                    <Button onClick={rejectInterviewHandler} variant="destructive">
                        {isRejectLoading ? <><Loader2 className="mr-2 animate-spin" /> rejecting...</> : "Reject"}
                    </Button>
                    <Button onClick={acceptInterviewHandler} variant="default">
                        {isAcceptLoading ? <><Loader2 className="mr-2 animate-spin" />  accepting...</> : "Accept"}
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
