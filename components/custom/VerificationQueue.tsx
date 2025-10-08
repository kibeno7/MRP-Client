"use client";

import { verificationInterviewState } from '@/atoms/verificationInterview';
import { viewInterviewPopup } from '@/atoms/viewInterviewPopup';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { errornotify } from '@/lib/notifications';
import axios from "axios";
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import VerificationDialogPopUp from './VerificationDialogPopUp';

const pendingOptions = ['All', 'Pending', 'Accepted', 'Rejected'];

interface Interview {
    verification: {
        status: string;
    };
    _id: string;
    interviewee: {
        name: string,
        reg_no: string;
    };
    company: string;
    status: string;
    offer: string;
    compensation: number;
    createdAt: Date;
}

interface ViewInterviewPopup {
    interviewId: string;
}

const VerificationQueue = () => {
    const [interviews, setInterviews] = useRecoilState<Interview[]>(verificationInterviewState);
    const setInterviewId = useSetRecoilState<ViewInterviewPopup>(viewInterviewPopup);
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/verify/verificationQueue`, {
                    withCredentials: true,
                });
                console.log(response.data.data.data);
                if (response.data.status === "success") {
                    setInterviews(response.data.data.data || []);
                } else {
                    errornotify("Failed to fetch all interviews");
                }
            } catch (error) {
                errornotify(`Failed to fetch all interviews ${error}`);
            }
        };

        fetchInterviews();
    }, [setInterviews]);

    const filteredData = interviews.filter((item) => {
        const matchesFilter =
            item.interviewee.reg_no.toLowerCase().includes(filter.toLowerCase()) ||
            item.interviewee.name.toLowerCase().includes(filter.toLowerCase()) ||
            item.company.toLowerCase().includes(filter.toLowerCase());

        return matchesFilter;
    });

    return (
        <Card className="max-w-7xl mx-auto">
            <CardHeader>
                <h2 className="text-xl font-semibold">Verification Queue</h2>
                <div className="flex justify-between space-x-2 mt-4">
                    <Input
                        placeholder="Filter by name or reg no"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <div>
                        <Select onValueChange={(value) => setStatusFilter(value)} defaultValue={statusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {pendingOptions.map((option) => (
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
                        <div key={item._id} className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 p-2 border-t text-sm sm:text-base">
                            <div className="hidden md:block">{item.interviewee.reg_no.toUpperCase()}</div>
                            <div>{item.interviewee.name}</div>
                            <div>{item.company}</div>
                            <div className="hidden xl:block text-center">
                                {item.status === "placed" ? "Placed" :
                                    item.status === "on-going" ? "On-Going" :
                                        item.status === "not-placed" ? "Not-Placed" :
                                            "Unknown"}
                            </div>
                            <div className="text-center">
                                <div onClick={() => setInterviewId({ interviewId: item._id })}>
                                    <VerificationDialogPopUp />
                                </div>
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

export default VerificationQueue;