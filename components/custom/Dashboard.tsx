"use client";

import { userAtom } from '@/atoms/user';
import { User } from '@/types/User';
import axios from "axios";
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
};

export default function Page() {
    const [user, setUser] = useRecoilState<User>(userAtom);
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
        <div className="p-4 flex flex-col justify-center items-center">
            <h1 className="text-3xl pb-4 font-bold mb-2">Dashboard</h1>
            <p className="text-xl">{getGreeting()}, <span className="font-semibold">{user?.name}</span></p>
        </div>
    );
}