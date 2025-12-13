"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  Building2,
  UserCircle2,
  ArrowRight,
  BookOpen,
  Briefcase,
  ArrowUpRight,
  Share2, 
} from "lucide-react";
import { useRouter } from "next/navigation";

import { userAtom } from "@/atoms/user";
import { viewInterviewPopup } from "@/atoms/viewInterviewPopup";
import ViewInterviewDialogPopUp from "./ViewInterviewDialogPopUp";
import { Button } from "@/components/ui/button";

interface Interview {
  _id: string;
  company: string;
  status: string;
  interviewee: {
    name: string;
    reg_no: string;
  };
}

const getGreeting = () => {
  const hour = new Date().getHours();
  return hour < 12
    ? "Good Morning"
    : hour < 18
    ? "Good Afternoon"
    : "Good Evening";
};

const getDateString = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Dashboard() {
  const user = useRecoilValue(userAtom);
  const setInterviewId = useSetRecoilState(viewInterviewPopup);
  const router = useRouter();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Add Copy Link Function
  const copyShareLink = (id: string) => {
    const link = `${window.location.origin}/dashboard/interview/${id}`;
    navigator.clipboard.writeText(link);
    import("@/lib/notifications").then((mod) =>
      mod.successnotify("Shareable link copied!")
    );
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview`,
          {
            params: {
              page: 1,
              limit: 5,
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          setInterviews(response.data.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard interviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <motion.div
        className="max-w-5xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- Header Section --- */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              {getDateString()}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {getGreeting()},{" "}
              <span className="text-zinc-500 dark:text-zinc-500">
                {user?.name || "Scholar"}
              </span>
            </h1>
          </div>
          <Button
            onClick={() => router.push("/dashboard/addInterview")}
            className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Share Your Experience
          </Button>
        </motion.div>

        {/* --- Quick Access Highlights --- */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Company Directory */}
          <div
            onClick={() => router.push("/dashboard/companies")}
            className="group relative cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                <Briefcase size={24} />
              </div>
              <ArrowUpRight className="text-zinc-300 group-hover:text-zinc-900 dark:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Company Directory
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Explore interview experiences organized by specific companies.
              </p>
            </div>
          </div>

          {/* Learning Resources */}
          <div
            onClick={() => router.push("/dashboard/resources")}
            className="group relative cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
                <BookOpen size={24} />
              </div>
              <ArrowUpRight className="text-zinc-300 group-hover:text-zinc-900 dark:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Resource Library
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Access a curated collection of questions and study links
                previously asked.
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- Recent Activity Feed --- */}
        <motion.div variants={itemVariants} className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Latest Experiences
            </h2>
            <button
              onClick={() => router.push("/dashboard/allInterviews")}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center transition-colors"
            >
              View Archive <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              // Loading Skeleton
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 animate-pulse"
                />
              ))
            ) : interviews.length > 0 ? (
              interviews.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{ scale: 1.005 }}
                  className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 hidden sm:block">
                        <Building2 size={20} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            {item.company}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide border ${
                              item.status === "placed"
                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
                                : item.status === "on-going"
                                ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30"
                                : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <UserCircle2 size={16} />
                          <span className="font-medium">
                            {item.interviewee.name}
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-700">
                            •
                          </span>
                          <span className="font-mono text-xs">
                            {item.interviewee.reg_no.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    {/* 3. Updated Action Section */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        onClick={() => copyShareLink(item._id)}
                        title="Copy Link"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>

                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          setInterviewId({ interviewId: item._id })
                        }
                      >
                        <ViewInterviewDialogPopUp />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
                No recent interviews found.
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
