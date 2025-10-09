"use client";

import { userAtom } from '@/atoms/user';
import { User } from '@/types/User';
import { useRecoilValue } from 'recoil';

const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
};

export default function Page() {
    const user = useRecoilValue<User | null>(userAtom);

    return (
        <div className="p-4 flex flex-col justify-center items-center">
            <h1 className="text-3xl pb-4 font-bold mb-2">Dashboard</h1>
            <p className="text-xl">{getGreeting()}, <span className="font-semibold">{user?.name}</span></p>
        </div>
    );
}