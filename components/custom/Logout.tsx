import React, { useState } from 'react';
import { Button } from "../ui/button";
import { PowerIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { sendingnotify, successnotify } from '@/lib/notifications';

const Logout = () => {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logOut = async () => {
        setIsLoggingOut(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/logout`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.status === "success") {
                localStorage.removeItem('user');
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
    }

    return (
        <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={logOut}
            disabled={isLoggingOut}
        >
            <PowerIcon className="mr-2 h-4 w-4" style={{ color: '#D22B2B' }} />
            {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
    )
}

export default Logout;