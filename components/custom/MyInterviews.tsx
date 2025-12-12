"use client";

import { myInterviewState } from "@/atoms/myInterview";
import { viewInterviewPopup } from "@/atoms/viewInterviewPopup";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { convertDate } from "@/lib/dateConverter";
import { errornotify } from "@/lib/notifications";
import { toProperCase } from "@/lib/properCasing";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Search,
  Filter,
  Calendar,
  Briefcase,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import ViewInterviewDialogPopUp from "./ViewInterviewDialogPopUp";
import { motion } from "framer-motion";

interface Interview {
  company: string;
  createdAt: Date;
  offer: string;
  status: string;
  interviewee: {
    name: string;
    reg_no: string;
  };
  verification: {
    status: string;
  };
  _id: string;
}

const statusOptions = [
  "All",
  "Accepted",
  "In-Queue",
  "Rejected",
  "Not-Verified",
];

const getVerificationBadge = (status: string) => {
  switch (status) {
    case "accepted":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
          <CheckCircle2 size={12} /> Accepted
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
          <AlertCircle size={12} /> Rejected
        </span>
      );
    case "in-queue":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30">
          <Clock size={12} /> In Queue
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
          Draft
        </span>
      );
  }
};

const MyInterviews = () => {
  const [interviews, setInterviews] =
    useRecoilState<Interview[]>(myInterviewState);
  const setInterviewId = useSetRecoilState(viewInterviewPopup);

  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/myinterviews`,
          { withCredentials: true }
        );
        if (response.data.status === "success") {
          setInterviews(response.data.data.data || []);
        } else {
          errornotify("Failed to fetch all interviews");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [setInterviews]);

  const filteredData = interviews.filter((item) => {
    const searchMatch =
      item.company.toLowerCase().includes(filter.toLowerCase()) ||
      item.offer.toLowerCase().includes(filter.toLowerCase()) ||
      item.status.toLowerCase().includes(filter.toLowerCase());

    const statusMatch =
      statusFilter === "all" || item.verification.status === statusFilter;

    return searchMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              My Interviews
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Track the status of the interview experiences you have shared.
            </p>
          </div>
        </div>

        {/* --- Content Card --- */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
          <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Filter by Company or Offer Type..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-9 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                />
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <Select
                  onValueChange={(value) =>
                    setStatusFilter(value.toLowerCase())
                  }
                  defaultValue={statusFilter}
                >
                  <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-zinc-500" />
                      <SelectValue placeholder="Verification Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
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
                    {/* 1. Date: Hidden on mobile */}
                    <th className="hidden md:table-cell px-6 py-4 font-medium">
                      Date
                    </th>

                    {/* 2. Company: Always visible */}
                    <th className="px-6 py-4 font-medium">Company</th>

                    {/* 3. Job Status: Hidden on mobile (Moved to Company column for mobile view) */}
                    <th className="hidden md:table-cell px-6 py-4 font-medium">
                      Job Status
                    </th>

                    {/* 4. Offer Type: Hidden on mobile */}
                    <th className="hidden md:table-cell px-6 py-4 font-medium">
                      Offer Type
                    </th>

                    {/* 5. Verification: Always visible */}
                    <th className="px-6 py-4 font-medium">Verification</th>

                    {/* 6. Action: Always visible */}
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {isLoading ? (
                    // Skeleton Loading
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="hidden md:table-cell px-6 py-4">
                          <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-8 w-8 ml-auto bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                      >
                        {/* Date (Hidden on Mobile) */}
                        <td className="hidden md:table-cell px-6 py-4 text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-zinc-400" />
                            {convertDate(new Date(item.createdAt).getTime())}
                          </div>
                        </td>

                        {/* Company (Always Visible) */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {item.company}
                              </span>
                            </div>
                            {/* Mobile-only info: Show Status here since columns are hidden */}
                            <span className="md:hidden text-xs text-zinc-500 mt-1">
                              {toProperCase(item.status)} •{" "}
                              {item.offer.toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* Job Status (Hidden on Mobile) */}
                        <td className="hidden md:table-cell px-6 py-4">
                          <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                            {toProperCase(item.status)}
                          </span>
                        </td>

                        {/* Offer Type (Hidden on Mobile) */}
                        <td className="hidden md:table-cell px-6 py-4">
                          <span className="inline-block text-xs font-semibold px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                            {item.offer.toUpperCase()}
                          </span>
                        </td>

                        {/* Verification Status (Always Visible) */}
                        <td className="px-6 py-4">
                          {getVerificationBadge(item.verification.status)}
                        </td>

                        {/* Action (Always Visible) */}
                        <td className="px-6 py-4 text-right">
                          <div
                            className="inline-block cursor-pointer"
                            onClick={() =>
                              setInterviewId({
                                interviewId: item._id,
                                // @ts-ignore
                                isPlaced: item.status === "placed",
                                status: item.verification.status,
                              })
                            }
                          >
                            <ViewInterviewDialogPopUp />
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-zinc-500">
                          <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-full mb-3">
                            <Briefcase className="h-8 w-8 text-zinc-400" />
                          </div>
                          <p className="font-medium">No interviews found</p>
                          <p className="text-sm mt-1">
                            You haven't submitted any experiences yet, or your
                            filter matches nothing.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyInterviews;
