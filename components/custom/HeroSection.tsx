"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BackgroundLines } from "../ui/background-lines";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { useRecoilValue } from "recoil"; // 1. Import Recoil hook
import { userAtom } from "@/atoms/user"; // 2. Import user atom

const words = [
  { text: "Real" },
  { text: "Questions." },
  { text: "Real" },
  { text: "Insights." },
  { text: "With" },
  {
    text: "MRP.",
    className: "text-zinc-500 dark:text-zinc-500 font-bold",
  },
];

const HeroSection: React.FC = () => {
  const router = useRouter();
  const user = useRecoilValue(userAtom); // 3. Get current user state

  // 4. Handle navigation based on auth state
  const handleStartReading = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden"
    >
      <BackgroundLines className="w-full h-full flex flex-col items-center justify-center">
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          {/* Badge / Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Updated for 2025 Placement Season
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-4xl md:text-7xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Master Your Interview <br className="hidden md:block" />
            <span className="text-zinc-400 dark:text-zinc-600">
              Before You Walk In.
            </span>
          </motion.h1>

          {/* Typewriter Subheadline */}
          <motion.div
            className="flex justify-center items-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <TypewriterEffectSmooth words={words} />
          </motion.div>

          {/* Description Text */}
          <motion.p
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Access a curated repository of interview experiences from seniors
            who cracked Texas Instruments, Anchanto, Google, Fastenal, and more.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all group"
              onClick={handleStartReading} // 5. Use the handler
            >
              {/* 6. Dynamic Text */}
              {user ? "Go to Dashboard" : "Start Reading"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
              onClick={() => router.push("#reviews")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Success Stories
            </Button>
          </motion.div>
        </div>
      </BackgroundLines>
    </section>
  );
};

export default HeroSection;
