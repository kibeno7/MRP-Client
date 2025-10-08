"use client";

import { useOtp } from "@/hooks/useOtp";
import { signUpSchema } from "@/schema/signUpSchema";
import { z } from "zod";


const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const { otpSent, setOtpSent } = useOtp();
    const errornotify = (msg: string) => console.error(msg);
    const sendingnotify = (msg: string) => console.log(msg);
    const dismiss = () => console.log("Dismiss notification");
    const successnotify = (msg: string) => console.log(msg);

    console.log(process.env.NEXT_PUBLIC_API_URL);
    if (!otpSent) {
        sendingnotify("Sending OTP...");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/signup`, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reg_no: data.reg_no,
                }),
            });
            const result = await response.json();
            dismiss();
            if (result.status === "success") {
                successnotify("OTP Sent Successfully");
                setOtpSent(true);
            } else {
                errornotify(result.message);
            }
        } catch (error) {
            dismiss();
            errornotify("Failed to send OTP");
        }
    } else {
        if (!data.otp) {
            errornotify("Enter OTP");
        } else if (!data.password || data.password.length < 8) {
            errornotify("Create New Password");
        } else {
            sendingnotify("Registering User...");
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/resetPassword`, {
                    method: "PATCH",
                    mode: "cors",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: data.otp,
                        password: data.password,
                        passwordConfirm: data.confirmPassword,
                    }),
                });
                const result = await response.json();
                dismiss();
                if (result.status === "success") {
                    successnotify("Registered Successfully");
                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 2000);
                } else {
                    errornotify("The OTP entered is incorrect");
                }
            } catch (error) {
                dismiss();
                errornotify("Failed to register user");
            }
        }
    }
};

export default onSubmit;