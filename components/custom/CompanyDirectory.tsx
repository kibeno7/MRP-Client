"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Building2, Calendar, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Company {
  name: string;
  count: number;
  lastActive: string;
}

export default function CompanyDirectory() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview/companies`,
          { withCredentials: true }
        );
        if (response.data.status === "success") {
          setCompanies(response.data.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch companies", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black p-4 md:p-8 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Company Directory
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-lg leading-relaxed">
              Explore interview experiences organized by company. Find insights
              from seniors who have been there.
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300 transition-colors" />
            <Input
              placeholder="Search organizations..."
              className="pl-10 h-11 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-400 transition-all shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* --- Content Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {isLoading
              ? // Loading Skeletons
                [...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl animate-pulse border border-zinc-200/50 dark:border-zinc-800"
                  />
                ))
              : filteredCompanies.map((company, i) => (
                  <motion.div
                    key={company.name}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    onClick={() =>
                      router.push(
                        `/dashboard/allInterviews?search=${encodeURIComponent(
                          company.name
                        )}`
                      )
                    }
                    className="group"
                  >
                    <Card className="h-full cursor-pointer bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/50 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg dark:hover:shadow-zinc-900/50 transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                        <div className="flex items-start justify-between">
                          <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-50 dark:group-hover:text-black transition-colors duration-300">
                            <Building2 size={22} strokeWidth={1.5} />
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium px-2.5 py-0.5"
                          >
                            {company.count} Exp
                          </Badge>
                        </div>

                        <div className="space-y-1.5">
                          <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {company.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                            <Calendar size={12} />
                            <span>
                              Last active:{" "}
                              {new Date(company.lastActive).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>

        {/* --- Empty State --- */}
        {!isLoading && filteredCompanies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
              <Briefcase className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              No companies found
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
              We couldn&apos;t find any companies matching &quot;{filter}&quot;.
              Try searching for a different name.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
