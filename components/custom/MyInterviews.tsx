"use client";

import { myInterviewState } from "@/atoms/myInterview";
import { viewInterviewPopup } from "@/atoms/viewInterviewPopup";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import ViewInterviewDialogPopUp from "./ViewInterviewDialogPopUp";

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

const placeOptions = ["All", "Accepted", "In-Queue", "Rejected"];

const verificationStatusStyles = [
  { status: "not-verified", text: "Draft", className: "text-yellow-800 font-medium" },
  { status: "accepted", text: "Accepted", className: "text-green-800 font-medium" },
  { status: "in-queue", text: "In Queue", className: "text-yellow-800 font-medium" },
  { status: "rejected", text: "Rejected", className: "font-medium", style: { color: "#D22B2B" } },
];

const AllInterviews = () => {
  const [interviews, setInterviews] = useRecoilState<Interview[]>(myInterviewState);
  const setInterviewId = useSetRecoilState(viewInterviewPopup);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
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
        errornotify(`Failed to fetch all interviews: ${error}`);
      }
    };

    fetchInterviews();
  }, [setInterviews]);

  const filteredData = interviews.filter(
    (item) =>
      (item.company.toLowerCase().includes(filter.toLowerCase()) ||
        item.offer.toLowerCase().includes(filter.toLowerCase()) ||
        item.status.toLowerCase().includes(filter.toLowerCase())) &&
      (statusFilter === "all" || !statusFilter
        ? true
        : item.verification.status === statusFilter)
  );

  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-bold">My Interviews</h2>
        <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-2 mt-4">
          <Input
            placeholder="Filter by name or reg no"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Select
            onValueChange={(value) => setStatusFilter(value.toLowerCase())}
            defaultValue={statusFilter}
          >
            <SelectTrigger className="w-auto">
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
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2 p-2 font-semibold text-sm sm:text-base">
            <div className="hidden md:block">Date</div>
            <div>Company</div>
            <div className="hidden xl:block">Job Status</div>
            <div className="hidden xl:block">Offer Type</div>
            <div>Verification Status</div>
            <div className="text-center">Actions</div>
          </div>
          {filteredData.map((item) => (
            <div key={item._id} className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2 p-2 border-t text-sm sm:text-base">
              <div className="hidden md:block">{convertDate(new Date(item.createdAt).getTime())}</div>
              <div>{item.company}</div>
              <div className="hidden xl:block">{toProperCase(item.status)}</div>
              <div className="hidden xl:block">{item.offer.toUpperCase()}</div>
              <div>
                {verificationStatusStyles.map((statusStyle) =>
                  item.verification.status === statusStyle.status ? (
                    <p key={statusStyle.status} className={statusStyle.className} style={statusStyle.style}>
                      {statusStyle.text}
                    </p>
                  ) : null
                )}
              </div>
              <div className="text-center" onClick={() =>
                setInterviewId({
                  interviewId: item._id,
                  isPlaced: item.status === "placed",
                  status: item.verification.status,
                })
              }>
                <ViewInterviewDialogPopUp />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {/* <Button variant="secondary">Load More</Button> */}
      </CardFooter>
    </Card>
  );
};

export default AllInterviews;
