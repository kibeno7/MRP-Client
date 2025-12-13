"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  UserCircle2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Share2,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { successnotify, errornotify } from "@/lib/notifications";

interface Question {
  title: string;
  description: string;
  link?: string;
}

interface Round {
  _id: string;
  name: string;
  type: string;
  date: number | string;
  note?: string;
  questions: Question[];
}

interface Interviewee {
  name: string;
  reg_no: string;
}

interface InterviewData {
  _id: string;
  company: string;
  offer: "fte" | "intern";
  compensation: number;
  status: "placed" | "not-placed" | "ongoing";
  interviewee: Interviewee;
  createdAt: string;
  rounds: Round[];
}

export default function InterviewDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview/${id}`,
          { withCredentials: true }
        );
        if (response.data.status === "success") {
          setInterview(response.data.data.interview);
        }
      } catch (error) {
        console.error("Failed to fetch interview", error);
        errornotify("Could not load the interview experience.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInterview();
  }, [id]);

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    successnotify("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8 space-y-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <h2 className="text-xl font-bold">Experience Not Found</h2>
          <Button
            variant="link"
            onClick={() => router.push("/dashboard/allInterviews")}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <Button
          variant="ghost"
          className="pl-0 hover:bg-transparent hover:text-zinc-600"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                      <Building2 className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
                        {interview.company}
                      </h1>
                      <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                        <Badge
                          variant="secondary"
                          className="font-normal text-xs uppercase tracking-wide"
                        >
                          {interview.offer === "fte"
                            ? "Full Time"
                            : "Internship"}
                        </Badge>
                        <span>•</span>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {interview.compensation &&
                          interview.compensation < 500
                            ? `${interview.compensation} LPA`
                            : `₹${(
                                interview.compensation || 0
                              ).toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-4 w-4" />
                      <span>
                        {interview.interviewee.name} (
                        {interview.interviewee.reg_no})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3">
                  <div
                    className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium border ${
                      interview.status === "placed"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : interview.status === "not-placed"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {interview.status === "placed" && (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {interview.status === "not-placed" && (
                      <XCircle className="h-4 w-4" />
                    )}
                    {interview.status === "ongoing" && (
                      <Clock className="h-4 w-4" />
                    )}
                    <span className="uppercase">
                      {interview.status.replace("-", " ")}
                    </span>
                  </div>

                  <Button size="sm" variant="outline" onClick={copyLink}>
                    <Share2 className="h-3.5 w-3.5 mr-2" /> Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rounds */}
        <div className="space-y-4">
          {interview.rounds?.map((round: Round, index: number) => (
            <motion.div
              key={round._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {round.name}
                        </CardTitle>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mt-0.5">
                          {round.type}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {new Date(round.date).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {round.note && (
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                      &quot;{round.note}&quot;
                    </div>
                  )}

                  <div className="space-y-4">
                    {round.questions?.map((q: Question, qi: number) => (
                      <div key={qi} className="group">
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                          <div className="space-y-2 w-full">
                            <div className="flex justify-between items-start gap-4">
                              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {q.title}
                              </h4>
                              {q.link && (
                                <a
                                  href={q.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <LinkIcon className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                              {q.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
