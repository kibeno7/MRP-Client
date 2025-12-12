"use client";

import { userAtom } from "@/atoms/user";
import Logout from "@/components/custom/Logout";
import { User as UserType } from "@/types/User";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Menu,
  PlusCircle,
  User,
  Users,
  X,
  LayoutDashboard,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const links = [
  // Added Home link pointing to Landing Page
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "All Interviews", href: "/dashboard/allInterviews", icon: Users },
  { name: "My Interviews", href: "/dashboard/myInterviews", icon: User },
  { name: "Add Experience", href: "/dashboard/addInterview", icon: PlusCircle },
  {
    name: "Verification Queue",
    href: "/dashboard/verificationQueue",
    icon: CheckCircle,
    roles: ["admin", "verifier"],
  },
];

const sidebarVariants = {
  open: { x: 0 },
  closed: { x: "-100%" },
};

const backdropVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useRecoilValue<UserType | null>(userAtom);
  const pathname = usePathname();

  const filteredLinks = user
    ? links.filter((link) => !link.roles || link.roles.includes(user.role))
    : [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* --- Floating Toggle Button --- */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-40 h-10 w-10 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-md border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
        <span className="sr-only">Open Menu</span>
      </Button>

      {/* --- AnimatePresence for smooth entry/exit --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 1. Backdrop Overlay */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={backdropVariants}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* 2. Sidebar Drawer */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                <Link
                  href="/dashboard"
                  className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  MRP.
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {filteredLinks.map((link) => {
                  const LinkIcon = link.icon;
                  // Check if this link is active
                  const isActive = pathname === link.href;

                  return (
                    <Link key={link.name} href={link.href} passHref>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start h-11 mb-1 font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <LinkIcon
                          className={`mr-3 h-4 w-4 ${
                            isActive
                              ? "text-white dark:text-black"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}
                        />
                        {link.name}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {/* Footer: User Profile & Logout */}
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3 mb-4 px-2">
                  <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-700">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-zinc-500 truncate">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                </div>

                <div className="w-full">
                  <Logout />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
