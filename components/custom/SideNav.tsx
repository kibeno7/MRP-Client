"use client";
import { userAtom } from "@/atoms/user";
import Logout from "@/components/custom/Logout";
import { User as UserType } from "@/types/User";
import { motion } from "framer-motion";
import { CheckCircle, Menu, PlusCircle, User, Users, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { Button } from "../ui/button";

const links = [
    { name: 'All Interviews', href: '/dashboard/allInterviews', icon: Users },
    { name: 'My Interview', href: '/dashboard/myInterviews', icon: User },
    { name: 'Add Experience', href: '/dashboard/addInterview', icon: PlusCircle },
    { name: 'Verification Queue', href: '/dashboard/verificationQueue', icon: CheckCircle, roles: ['admin', 'verifier'] },
];

const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
};

export default function SideNav() {
    const [isOpen, setIsOpen] = useState(false);
    const user = useRecoilValue<UserType | null>(userAtom);

    const filteredLinks = user ? links.filter(link => !link.roles || link.roles.includes(user.role)) : [];

    return (
        <>
            <Button
                variant="ghost"
                className="fixed transform -translate-y-1/2 top-8"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="block lg:hidden hover:translate-x-1 bg-white shadow-sm transition-transform duration-200">
                    <Menu className="h-7 w-7" />
                </span>
                <span className="hidden lg:block hover:translate-x-1 bg-white shadow-sm transition-transform duration-200">
                    <Menu className="h-7 w-7" />
                </span>
            </Button>

            <motion.div
                className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg"
                animate={isOpen ? "open" : "closed"}
                variants={variants}
                initial="closed"
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col p-4 w-full h-full">
                    <div className="flex justify-end mb-4">
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            <X />
                        </Button>
                    </div>
                    <Link className="flex items-center justify-between mb-8" href="/dashboard">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                    </Link>
                    <div className="flex flex-col space-y-2 flex-grow">
                        {filteredLinks.map((link) => {
                            const LinkIcon = link.icon;
                            return (
                                <Link key={link.name} href={link.href} passHref>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start flex items-center hover:bg-gray-100"
                                        onClick={() => {
                                            if (window.innerWidth <= 1024) {
                                                setIsOpen(!isOpen);
                                            }
                                        }}
                                    >
                                        <LinkIcon className="mr-2 h-4 w-4" />
                                        <span className="block text-base">{link.name}</span>
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="mt-auto">
                        <form>
                            <Logout />
                        </form>
                    </div>
                </div>
            </motion.div>
        </>
    );
}