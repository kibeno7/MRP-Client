"use client";
import { userAtom } from "@/atoms/user";
import { dismiss, errornotify, successnotify } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/schema/loginSchema";
import { User } from "@/types/User";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { z } from "zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type logInData = z.infer<typeof loginSchema>;

const onSubmit = async (
  data: logInData,
  router: ReturnType<typeof useRouter>,
  setUser: ReturnType<typeof useSetRecoilState<User>>
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/login`,
      {
        email: data.email,
        password: data.password,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dismiss();
    const user = response.data.data.user;
    setUser(user);
    if (response.data.status === "success") {
      successnotify("Logged In Successfully");
      router.push("/dashboard");
    } else {
      errornotify(response.data.message);
    }
  } catch (error) {
    console.log(error);
    dismiss();
    errornotify("Failed to Login");
  }
};

export default function Login() {
  const setUser = useSetRecoilState(userAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<logInData>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 text-center dark:text-neutral-200">
        Login to your account
      </h2>
      <form
        className="my-8"
        onSubmit={handleSubmit((data) => onSubmit(data, router, setUser))}
      >
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">College Mail ID</Label>
          <Input
            id="email"
            placeholder="2022pgcsca001@nitjsr.ac.in"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
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
            style={{ top: '50%', transform: 'translateY(-50%)' }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </div>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </LabelInputContainer>
        <div className="flex flex-row-reverse mr-2 pb-2 -mt-2 text-sm">
          <Link href="/forgot">Forgot Password?</Link>
        </div>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Log In &rarr;
          <BottomGradient />
        </button>
        <div className="flex p-2 pt-4 flex-row justify-start text-sm">
          <p className="text-gray-500 mr-1">Don&apos;t have an account yet?</p>
          <Link href="/signup">Register</Link>
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
