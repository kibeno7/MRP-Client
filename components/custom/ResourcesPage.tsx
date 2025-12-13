"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Library, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { errornotify } from "@/lib/notifications";

interface ResourceItem {
  id: string;
  title: string;
  link: string;
  company: string;
  round: string;
  candidate: string;
}

interface BackendResource {
  _id: string;
  title?: string;
  link: string;
  company?: string;
  round?: { name: string };
  interviewee?: { name: string };
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview/resources`,
          {
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          const backendData = response.data.data.data;
          const mappedResources: ResourceItem[] = backendData.map(
            (item: BackendResource) => ({
              id: item._id,
              title: item.title || "Untitled Question",
              link: item.link,
              company: item.company || "Unknown",
              round: item.round?.name || "Round",
              candidate: item.interviewee?.name || "Anonymous",
            })
          );
          setResources(mappedResources);
        }
      } catch (error) {
        console.error(error);
        errornotify("Failed to fetch resources");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter(
    (res) =>
      res.title.toLowerCase().includes(filter.toLowerCase()) ||
      res.company.toLowerCase().includes(filter.toLowerCase()) ||
      res.candidate.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black p-4 md:p-8 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Resource Library
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-lg leading-relaxed">
              A curated collection of DSA problems and study materials shared
              directly from interview experiences.
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300 transition-colors" />
            <Input
              placeholder="Search topics, companies..."
              className="pl-10 h-11 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-400 transition-all shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* --- Content Card --- */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
          <CardContent className="p-0">
            <div className="w-full">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[55%] md:w-[45%] py-4 pl-4 md:pl-6 font-semibold text-zinc-600 dark:text-zinc-400 text-xs md:text-sm">
                      Question
                    </TableHead>
                    <TableHead className="hidden md:table-cell py-4 font-semibold text-zinc-600 dark:text-zinc-400">
                      Company
                    </TableHead>
                    <TableHead className="w-[25%] md:w-auto py-4 font-semibold text-zinc-600 dark:text-zinc-400 text-xs md:text-sm">
                      Context
                    </TableHead>
                    <TableHead className="w-[20%] md:w-auto text-right py-4 pr-4 md:pr-6 font-semibold text-zinc-600 dark:text-zinc-400 text-xs md:text-sm">
                      Link
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  <AnimatePresence mode="popLayout">
                    {isLoading ? (
                      // Loading Skeletons
                      [...Array(6)].map((_, i) => (
                        <TableRow key={i} className="border-0">
                          <TableCell className="pl-4 md:pl-6 py-4">
                            <div className="h-5 w-full md:w-48 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mb-2" />
                            <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse md:hidden" />
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-4">
                            <div className="h-5 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="h-4 w-12 md:w-32 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mb-1" />
                          </TableCell>
                          <TableCell className="pr-4 md:pr-6 py-4">
                            <div className="h-8 w-8 ml-auto bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredResources.length > 0 ? (
                      filteredResources.map((res, i) => (
                        <motion.tr
                          key={res.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors border-0"
                        >
                          {/* 1. QUESTION COLUMN */}
                          <TableCell className="align-top py-5 pl-4 md:pl-6">
                            <div className="flex items-start gap-2 md:gap-3.5">
                              {/* Icon hidden on very small screens to save space, visible on sm+ */}
                              <div className="hidden sm:block p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0 group-hover:scale-105 transition-transform">
                                <BookOpen size={18} strokeWidth={2} />
                              </div>

                              <div className="flex flex-col gap-1.5 min-w-0">
                                {/* line-clamp-2 ensures title doesn't force width expansion */}
                                <span className="text-zinc-900 dark:text-zinc-100 font-medium line-clamp-2 leading-relaxed text-sm md:text-base break-words">
                                  {res.title}
                                </span>
                                {/* Mobile Company Badge */}
                                <Badge
                                  variant="secondary"
                                  className="md:hidden w-fit bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium text-[10px] px-1.5 h-5 border-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                                >
                                  {res.company}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>

                          {/* 2. COMPANY COLUMN (Desktop) */}
                          <TableCell className="hidden md:table-cell align-top py-5">
                            <Badge
                              variant="outline"
                              className="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium px-2.5 py-1"
                            >
                              {res.company}
                            </Badge>
                          </TableCell>

                          {/* 3. CONTEXT COLUMN */}
                          <TableCell className="align-top py-5">
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="text-xs md:text-sm font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                                {res.round}
                              </span>
                              <span className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-500 truncate">
                                {res.candidate.split(" ")[0]}{" "}
                                {/* Show First Name only on mobile if space is tight */}
                                <span className="hidden sm:inline">
                                  {" "}
                                  {res.candidate.split(" ").slice(1).join(" ")}
                                </span>
                              </span>
                            </div>
                          </TableCell>

                          {/* 4. LINK COLUMN */}
                          <TableCell className="text-right align-top py-5 pr-4 md:pr-6">
                            <a
                              href={res.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-end gap-1.5 text-sm text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 font-medium transition-colors group/link"
                            >
                              {/* Text hidden on mobile, visible on desktop */}
                              <span className="hidden md:inline">View</span>
                              <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md group-hover/link:bg-indigo-50 dark:group-hover/link:bg-indigo-900/20 transition-colors">
                                <ArrowUpRight
                                  size={16}
                                  className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform"
                                />
                              </div>
                            </a>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center text-zinc-500">
                            <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-3">
                              <Library className="h-6 w-6 text-zinc-400" />
                            </div>
                            <p className="font-medium text-zinc-900 dark:text-zinc-200">
                              No resources found
                            </p>
                            <p className="text-sm text-zinc-500 max-w-xs mt-1">
                              We couldn&apos;t find any resources matching
                              &quot;{filter}&quot;.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
