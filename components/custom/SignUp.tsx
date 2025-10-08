"use client";
import {
  dismiss,
  errornotify,
  sendingnotify,
  successnotify,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { signUpSchema } from "@/schema/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";
type signUpData = z.infer<typeof signUpSchema>;

const onSubmit = async (
  data: signUpData,
  router: ReturnType<typeof useRouter>,
  otpSent: boolean,
  setOtpSent: React.Dispatch<React.SetStateAction<boolean>>
) => {
  console.log(data);
  if (!otpSent) {
    const notification = sendingnotify("Sending OTP...");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/signup`,
        {
          reg_no: data.reg_no,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dismiss(notification);
      if (response.data.status === "success") {
        successnotify("OTP Sent Successfully");
        setOtpSent(true);
      } else {
        errornotify(response.data.message);
      }
    } catch (error) {
      dismiss();
      if (axios.isAxiosError(error) && error.response) {
        errornotify(
          (error.response.data.message as string) || "Failed to send OTP"
        );
      } else {
        errornotify("Failed to send OTP");
      }
    }
  } else {
    if (!data.otp) {
      errornotify("Enter OTP");
    } else if (!data.password || data.password.length < 8) {
      errornotify("Create New Password");
    } else {
      const notification = sendingnotify("Registering User...");
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/resetPassword`,
          {
            token: data.otp,
            password: data.password,
            passwordConfirm: data.confirmPassword,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        dismiss(notification);
        if (response.data.status === "success") {
          successnotify("Registered Successfully");
          router.push("/dashboard");
        } else {
          errornotify("The OTP entered is incorrect");
        }
      } catch (error) {
        dismiss();
        if (axios.isAxiosError(error) && error.response) {
          errornotify(
            (error.response.data.message as string) || "Failed to register"
          );
        } else {
          errornotify("Failed to register");
        }
      }
    }
  }
};

export default function SignUp() {
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpData>({
    resolver: zodResolver(signUpSchema),
  });
  const router = useRouter();

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 text-center dark:text-neutral-200">
        Welcome to MRP
      </h2>
      <form
        className="my-8"
        onSubmit={handleSubmit((data) => {
          console.log(data);
          onSubmit(data, router, otpSent, setOtpSent);
        })}
      >
        <LabelInputContainer className="mb-4">
          <Label htmlFor="reg_no">Registration Number</Label>
          <Input
            id="reg_no"
            placeholder="2022pgcsca001"
            type="text"
            {...register("reg_no")}
            disabled={otpSent}
          />
          {errors.reg_no && (
            <p className="text-red-500">{errors.reg_no.message}</p>
          )}
        </LabelInputContainer>

        {otpSent && (
          <>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                placeholder="Enter OTP"
                type="text"
                {...register("otp")}
              />
              {errors.otp && (
                <p className="text-red-500">{errors.otp.message}</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="*********"
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400"
                style={{ top: "50%", transform: "translateY(-50%)" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4 relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                placeholder="*********"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400"
                style={{ top: "50%", transform: "translateY(-50%)" }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </LabelInputContainer>
          </>
        )}

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {otpSent ? "Sign Up" : "Get OTP"} &rarr;
          <BottomGradient />
        </button>
        <div className="flex p-2 pt-4 flex-row justify-start text-sm">
          <p className="text-gray-500 mr-1">Already have an account?</p>
          <Link href="/login">Log In</Link>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
