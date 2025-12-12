"use client";

import { verificationInterviewState } from "@/atoms/verificationInterview";
import { viewInterviewPopup } from "@/atoms/viewInterviewPopup";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  ShieldCheck,
  Clock,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import VerificationDialogPopUp from "./VerificationDialogPopUp";
import { motion } from "framer-motion";

const pendingOptions = ["All", "Pending", "Accepted", "Rejected"];

interface Interview {
  verification: {
    status: string;
  };
  _id: string;
  interviewee: {
    name: string;
    reg_no: string;
  };
  company: string;
  status: string; // Job Status (placed/ongoing)
  offer: string;
  compensation: number;
  createdAt: Date;
}

interface ViewInterviewPopup {
  interviewId: string;
}

// Helper for Verification Badges
const getVerificationBadge = (status: string) => {
  switch (status) {
    case "accepted":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
          <CheckCircle2 size={12} /> Verified
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
          <XCircle size={12} /> Rejected
        </span>
      );
    default: // pending or in-queue
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30">
          <Clock size={12} /> Pending
        </span>
      );
  }
};

const VerificationQueue = () => {
  const [interviews, setInterviews] = useRecoilState<Interview[]>(
    verificationInterviewState
  );
  const setInterviewId =
    useSetRecoilState<ViewInterviewPopup>(viewInterviewPopup);

  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/verify/verificationQueue`,
          {
            withCredentials: true,
          }
        );
        if (response.data.status === "success") {
          setInterviews(response.data.data.data || []);
        } else {
          errornotify("Failed to fetch interviews");
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
    const matchesSearch =
      item.interviewee.reg_no.toLowerCase().includes(filter.toLowerCase()) ||
      item.interviewee.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.company.toLowerCase().includes(filter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || statusFilter === ""
        ? true
        : item.verification.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Verification Queue
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Review and approve interview experiences submitted by students.
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
                  placeholder="Search Name, Reg No, or Company..."
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
                  defaultValue={statusFilter || "all"}
                >
                  <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-zinc-500" />
                      <SelectValue placeholder="Verification Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {pendingOptions.map((option) => (
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

                    {/* Hidden on Mobile: Job Status */}
                    <th className="hidden md:table-cell px-6 py-4 font-medium">
                      Job Status
                    </th>

                    {/* Hidden on Mobile: Verification Status */}
                    <th className="hidden md:table-cell px-6 py-4 font-medium">
                      Verification
                    </th>

                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {isLoading ? (
                    // Skeleton Loading
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
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
                        {/* Student Details */}
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

                        {/* Company */}
                        <td className="px-6 py-4">
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {item.company}
                          </span>
                          {/* Mobile only: Show Offer Type underneath since other columns hidden */}
                          <div className="md:hidden text-xs text-zinc-500 mt-1">
                            {item.offer.toUpperCase()}
                          </div>
                        </td>

                        {/* Job Status (Hidden on mobile) */}
                        <td className="hidden md:table-cell px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium border ${
                              item.status === "placed"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-zinc-100 text-zinc-700 border-zinc-200"
                            }`}
                          >
                            {item.status === "placed" ? "Placed" : "Ongoing"}
                          </span>
                        </td>

                        {/* Verification Status (Hidden on mobile) */}
                        <td className="hidden md:table-cell px-6 py-4">
                          {getVerificationBadge(item.verification.status)}
                        </td>

                        {/* Action - Old Style View Button */}
                        <td className="px-6 py-4 text-right">
                          <div
                            className="inline-block cursor-pointer"
                            onClick={() =>
                              setInterviewId({ interviewId: item._id })
                            }
                          >
                            {/* Simply render the popup component which acts as the trigger */}
                            <VerificationDialogPopUp />
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center text-zinc-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <ShieldCheck className="h-10 w-10 text-zinc-300 mb-2" />
                          <p>No pending verifications found.</p>
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

export default VerificationQueue;
