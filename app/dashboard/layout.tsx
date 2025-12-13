"use client";

import { userAtom } from "@/atoms/user";
import SideNav from "@/components/custom/SideNav";
import { User } from "@/types/User";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useRecoilState<User | null>(userAtom);
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/loginStatus`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.status === "success") {
          setUser(response.data.data.user);
        } else {
          throw new Error("Session invalid");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    };

    validateSession();
  }, [setUser, router]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <SideNav />

      <div className="flex-grow p-6 pt-20 lg:p-12 lg:pt-20 animate-in fade-in duration-500">
        {children}
      </div>
    </div>
  );
}
