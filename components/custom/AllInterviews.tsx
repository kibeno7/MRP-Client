"use client";

import { interviewState } from "@/atoms/interview";
import { viewInterviewPopup } from "@/atoms/viewInterviewPopup";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { errornotify } from "@/lib/notifications";
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
import ViewInterviewDialogPopUp from "./ViewInterviewDialogPopUp";
import { Button } from "../ui/button";

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
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  //pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 20;
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview`,
          {
            params: {
              page,
              limit,
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          setTotalPages(response.data.totalPages);
          setInterviews(response.data.data.data || []);
        } else {
          errornotify("Failed to fetch all interviews");
        }
      } catch (error) {
        console.log("Failed to fetch all interviews", error);
      }
    };

    fetchInterviews();
  }, [page, setInterviews]);

  console.log(interviews);

  const filteredData = interviews.filter((item) => {
    const matchesFilter =
      item.interviewee.reg_no.toLowerCase().includes(filter.toLowerCase()) ||
      item.interviewee.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.company.toLowerCase().includes(filter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesFilter && matchesStatus;
  });

  return (
    <div>
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <h2 className="text-xl font-bold">All Interviews</h2>
          <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-2 mt-4">
            <Input
              placeholder="Filter by name or reg no"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <div>
              <Select
                onValueChange={(value) => setStatusFilter(value.toLowerCase())}
                defaultValue={statusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {placeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 p-2 font-semibold text-sm sm:text-base">
              <div className="hidden md:block">Reg No</div>
              <div>Name</div>
              <div>Company</div>
              <div className="hidden xl:block text-center">Status</div>
              <div className="text-center">Actions</div>
            </div>
            {filteredData.map((item: Interview) => (
              <div
                key={item._id}
                className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 p-2 border-t text-sm sm:text-base"
              >
                <div className="hidden md:block">
                  {item.interviewee.reg_no.toUpperCase()}
                </div>
                <div>{item.interviewee.name}</div>
                <div>{item.company}</div>
                <div className="hidden xl:block text-center">
                  {item.status === "placed"
                    ? "Placed"
                    : item.status === "on-going"
                      ? "On-Going"
                      : item.status === "not-placed"
                        ? "Not-Placed"
                        : "Unknown"}
                </div>
                <div className="text-center">
                  <div
                    onClick={() => setInterviewId({ interviewId: item._id })}
                  >
                    <ViewInterviewDialogPopUp />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <div className="flex justify-center items-center space-x-4 mt-4">
        <Button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="w-50 gap-2 position-absolute"
        >
          Prev
        </Button>
        <div>{page}</div>
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          className="w-50 gap-2 position-absolute"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AllInterviews;
