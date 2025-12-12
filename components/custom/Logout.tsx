"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { PowerIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { sendingnotify, successnotify } from "@/lib/notifications";
import { useSetRecoilState } from "recoil";
import { userAtom } from "@/atoms/user";

const Logout = () => {
  const router = useRouter();
  const setUser = useSetRecoilState(userAtom);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logOut = async () => {
    setIsLoggingOut(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/logout`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        localStorage.removeItem("user");

        setUser(null);

        successnotify("Logged out successfully");
        router.push("/");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Logout failed", error);
      sendingnotify("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start h-11 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
      onClick={logOut}
      disabled={isLoggingOut}
    >
      <PowerIcon className="mr-3 h-4 w-4" style={{ color: "#D22B2B" }} />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default Logout;
