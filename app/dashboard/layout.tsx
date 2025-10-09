"use client";

import SideNav from "@/components/custom/SideNav";
import { userAtom } from "@/atoms/user";
import { User } from "@/types/User";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export default function Layout({ children }: { children: React.ReactNode }) {
    const setUser = useSetRecoilState<User | null>(userAtom);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/loginStatus`, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                if (response.data.status === "success") {
                    setUser(response.data.data.user);
                }
                else {
                    console.error("Failed to fetch user data");
                }
            }
            catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUser();
    }, [setUser]);

    return (
        <div className="flex h-screen flex-col">
            <div className="w-full flex-none lg:w-64 z-50">
                <SideNav />
            </div>
            <div className="flex-grow p-6 lg:mt-4 mt-8 lg:overflow-y-auto lg:p-12">{children}</div>
        </div>
    );
}