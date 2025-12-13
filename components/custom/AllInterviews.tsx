"use client";

import { interviewState } from "@/atoms/interview";
import { viewInterviewPopup } from "@/atoms/viewInterviewPopup";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CompanyInsights from "@/components/custom/CompanyInsights";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { errornotify } from "@/lib/notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import ViewInterviewDialogPopUp from "./ViewInterviewDialogPopUp";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const placeOptions = ["All", "Placed", "On-Going", "Not-Placed"];

interface Interview {
  interviewee: {
    name: string;
    reg_no: string;
  };
  _id: string;
  company: string;
  status: string;
}

interface ViewInterviewPopup {
  interviewId: string;
}

const AllInterviews = () => {
  const [interviews, setInterviews] =
    useRecoilState<Interview[]>(interviewState);
  const setInterviewId =
    useSetRecoilState<ViewInterviewPopup>(viewInterviewPopup);
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState(initialSearch);
  const [debouncedFilter, setDebouncedFilter] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 20;

  // Function to copy the shareable link
  const copyShareLink = (id: string) => {
    const link = `${window.location.origin}/dashboard/interview/${id}`;
    navigator.clipboard.writeText(link);
    import("@/lib/notifications").then((mod) =>
      mod.successnotify("Shareable link copied!")
    );
  };

  useEffect(() => {
    const search = searchParams.get("search");
    if (search !== null && search !== filter) {
      setFilter(search);
      setDebouncedFilter(search);
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
      if (filter !== debouncedFilter) setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [filter]);

  useEffect(() => {
    let isActive = true;

    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview`,
          {
            params: {
              page,
              limit,
              search: debouncedFilter,
              status: statusFilter === "all" ? undefined : statusFilter,
            },
            withCredentials: true,
          }
        );

        if (isActive) {
          if (response.data.status === "success") {
            setTotalPages(response.data.totalPages);
            setInterviews(response.data.data.data || []);
          } else {
            errornotify("Failed to fetch interviews");
          }
        }
      } catch (error) {
        if (isActive) {
          console.log("Failed to fetch interviews", error);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchInterviews();

    return () => {
      isActive = false;
    };
  }, [page, debouncedFilter, statusFilter, setInterviews]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Interviews Archive
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Browse experiences shared by your seniors & batchmates.
            </p>
          </div>
        </div>

        {debouncedFilter && <CompanyInsights companyName={debouncedFilter} />}

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
          <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search by Company, Name or Reg No..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-9 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div className="w-full md:w-48">
                <Select
                  onValueChange={(value) => {
                    setStatusFilter(value.toLowerCase());
                    setPage(1);
                  }}
                  defaultValue={statusFilter}
                >
                  <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-zinc-500" />
                      <SelectValue placeholder="Filter Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {placeOptions.map((option) => (
                      <SelectItem key={option} value={option.toLowerCase()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Student Details</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="hidden md:table-cell px-6 py-4 font-medium text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          <div className="h-6 w-20 mx-auto bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-8 w-8 ml-auto bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                      </tr>
                    ))
                  ) : interviews.length > 0 ? (
                    interviews.map((item, index) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {item.interviewee.name}
                            </span>
                            <span className="text-xs text-zinc-500 font-mono">
                              {item.interviewee.reg_no.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                              {item.company}
                            </span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              item.status === "placed"
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
                                : item.status === "on-going"
                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30"
                                : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                            }`}
                          >
                            {item.status === "placed"
                              ? "Placed"
                              : item.status === "on-going"
                              ? "Ongoing"
                              : "Not Placed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Share Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                              onClick={() => copyShareLink(item._id)}
                              title="Copy Link"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>

                            {/* View Button */}
                            <div
                              className="inline-block cursor-pointer"
                              onClick={() =>
                                setInterviewId({ interviewId: item._id })
                              }
                            >
                              <ViewInterviewDialogPopUp />
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-zinc-500"
                      >
                        No interviews found matching "{debouncedFilter}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>

          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="text-sm text-zinc-500">
              Page{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {page}
              </span>{" "}
              of {totalPages || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1 || isLoading}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={
                  page === totalPages || page >= totalPages || isLoading
                }
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AllInterviews;
