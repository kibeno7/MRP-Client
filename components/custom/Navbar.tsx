"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, User as UserIcon } from "lucide-react"; // Added UserIcon
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil"; // Import Recoil
import { userAtom } from "@/atoms/user"; // Import your user atom
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const user = useRecoilValue(userAtom); // Get user state

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navItems = ["Home", "Reviews", "Team", "Contact"];

  const menuVariants = {
    initial: { x: "100%", opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          {/* Logo */}
          <a
            href="#"
            className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50"
          >
            MRP
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex space-x-8 items-center">
              {navItems.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />{" "}
            {/* Logic: If User exists, show Profile, else show Login Button */}
            {user ? (
              <div
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => router.push("/dashboard")}
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </p>
                </div>
                <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-700">
                  <AvatarImage src="" /> {/* Add user.image if available */}
                  <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold text-xs">
                    {getInitials(user.name || "U")}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => router.push("/login")}
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm md:hidden"
            />

            {/* Slide-in Menu */}
            <motion.div
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed top-0 right-0 z-[70] h-full w-3/4 max-w-sm bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl md:hidden p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Menu
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                </Button>
              </div>

              <ul className="space-y-6 flex-1">
                {navItems.map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
                {user ? (
                  <div
                    className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 cursor-pointer"
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/dashboard");
                    }}
                  >
                    <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-700">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold">
                        {getInitials(user.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-zinc-900 dark:text-zinc-50 truncate">
                        {user.name}
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/login");
                    }}
                  >
                    Login Now
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
