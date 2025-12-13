"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, IndianRupee, Sparkles, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CompanyStats {
  totalInterviews: number;
  totalSelections: number;
  avgCompensation: number;
  canonicalName: string;
}

interface CompanyInsightsProps {
  companyName: string;
}

// Helper to ensure Title Case
const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export default function CompanyInsights({ companyName }: CompanyInsightsProps) {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // If input is too short, hide immediately
    if (!companyName || companyName.length < 2) {
      setVisible(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview/company-stats`,
          {
            params: { company: companyName },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          const data = response.data.data;
          // Only show if we found actual interviews for this company
          if (data.stats.totalInterviews > 0) {
            setStats(data.stats);
            setTopics(data.topics);
            setVisible(true);
          } else {
            // No data found (likely a student search), so hide the box
            setVisible(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch company stats", error);
        setVisible(false);
      } finally {
        setLoading(false);
      }
    };

    // The parent already debounces the input, so we fetch immediately
    fetchStats();
  }, [companyName]);

  // Determine display name
  const displayName = stats?.canonicalName
    ? toTitleCase(stats.canonicalName)
    : toTitleCase(companyName);

  return (
    <AnimatePresence>
      {/* FIX: Removed '|| loading' from the condition. 
         The box will now ONLY render if we have confirmed data (visible === true).
         This prevents the "Open Skeleton -> Close" flicker when searching for students.
      */}
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-zinc-950 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>

            {/* Optional: Add a slight opacity transition if reloading data for a different company */}
            <div
              className={`relative z-10 transition-opacity duration-300 ${
                loading ? "opacity-50" : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Insights: {displayName}</h2>
                  <p className="text-sm text-zinc-400">
                    Based on past interview experiences
                  </p>
                </div>
              </div>

              {/* We keep the Skeleton logic here for the specific case where:
                  1. We are ALREADY showing a company (Visible=True)
                  2. User types a NEW company (Loading=True)
                  3. We want to show loading while keeping the box open.
              */}
              {loading && !stats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-20 bg-white/10" />
                  <Skeleton className="h-20 bg-white/10" />
                  <Skeleton className="h-20 bg-white/10" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Selections */}
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col justify-between hover:bg-white/15 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="text-zinc-300 text-sm font-medium">
                        Total Selections
                      </span>
                      <Trophy className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">
                        {stats?.totalSelections}
                      </span>
                      <span className="text-xs text-zinc-400 ml-2">
                        / {stats?.totalInterviews} interviews
                      </span>
                    </div>
                  </div>

                  {/* Compensation */}
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col justify-between hover:bg-white/15 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="text-zinc-300 text-sm font-medium">
                        Avg. Compensation
                      </span>
                      <IndianRupee className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">
                        {stats?.avgCompensation
                          ? `${(stats.avgCompensation / 100000).toFixed(1)} LPA`
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col justify-between hover:bg-white/15 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="text-zinc-300 text-sm font-medium">
                        Frequent Topics
                      </span>
                      <Sparkles className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {topics.length > 0 ? (
                        topics.slice(0, 3).map((topic, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/5 uppercase tracking-wide"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-500 italic">
                          No specific topics found
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
