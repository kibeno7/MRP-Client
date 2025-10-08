import { useRecoilValue, useSetRecoilState } from "recoil";
import { otpAtom } from "@/atoms/otp";

export const useOtp = () => {
    const otpSent = useRecoilValue(otpAtom);
    const setOtpSent = useSetRecoilState(otpAtom);

    return { otpSent, setOtpSent };
}