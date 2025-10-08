import { viewInterviewPopup } from '@/atoms/viewInterviewPopup'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { errornotify } from '@/lib/notifications'
import { Interview } from '@/types/Interview'
import axios from 'axios'
import { Briefcase, CheckCircle, ExternalLink, IndianRupee, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Skeleton } from '../ui/skeleton'

interface ViewInterviewPopup {
    interviewId: string;
}

export default function ViewInterview() {
    const [interview, setInterview] = useState<Interview | null>(null);
    const interviewIdObj = useRecoilValue<ViewInterviewPopup>(viewInterviewPopup);
    const [loading, setLoading] = useState(true);

    const interviewId = interviewIdObj.interviewId;

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview/${interviewId}`, {
                    withCredentials: true,
                });
                if (response.data.status === "success") {
                    setInterview(response.data.data.interview);
                } else {
                    errornotify("Failed to fetch interview");
                }
            } catch (error) {
                errornotify(`Failed to fetch all interviews ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [interviewId]);

    if (loading) {
        return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
    }

    return (
        <ScrollArea className="max-h-[80vh]">
            <div className="container mx-auto p-2 sm:p-3 md:p-6 lg:p-8">
                <Card className="w-full mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl font-bold">{interview?.company}</CardTitle>
                        <CardDescription>
                            <p className="text-sm md:text-base font-medium"><span className="font-normal">Name: </span>{interview?.interviewee.name}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">Reg No: {interview?.interviewee.reg_no.toUpperCase()}</p>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm md:text-base lg:text-lg font-semibold">Placement Status</span>
                                </div>
                                {interview?.status === 'placed' ? (
                                    <Badge variant="default" className="text-xs md:text-sm lg:text-base">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Placed
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="text-xs md:text-sm lg:text-base">
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Not Placed
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 w-full">
                                <IndianRupee className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm md:text-base lg:text-lg font-semibold">Compensation:</span>
                                <span className="truncate text-xs md:text-sm lg:text-base">{interview?.compensation}</span>
                            </div>

                            <Accordion type="single" collapsible className="w-full">
                                {interview?.rounds.map((round, index) => (
                                    <AccordionItem value={`round-${index}`} key={index}>
                                        <AccordionTrigger className="text-sm sm:text-base md:text-md font-semibold">
                                            <div className="mr-2 text-left">{round.name}</div>
                                            <Badge variant="outline" className="mr-auto text-xs md:text-sm">
                                                {round.type === 'oa' && 'Online Assessment'}
                                                {round.type === 'technical' && 'Technical Round'}
                                                {round.type === 'sys-design' && 'System Design'}
                                                {round.type === 'hr' && 'HR Round'}
                                                {round.type === 'gd' && 'Group Discussion'}
                                            </Badge>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {round.note && (
                                                <p className="mb-4 text-xs md:text-sm text-muted-foreground">{round.note}</p>
                                            )}
                                            <div className="space-y-4">
                                                {round.questions.map((question, qIndex) => (
                                                    <Card key={qIndex}>
                                                        <CardHeader>
                                                            <CardTitle className="text-sm md:text-base">{question.title}</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-xs md:text-sm text-muted-foreground">{question.description}</p>
                                                            {question.link && (
                                                                <a
                                                                    href={question.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center mt-2 text-xs md:text-sm text-blue-600 hover:underline"
                                                                >
                                                                    <ExternalLink className="w-4 h-4 mr-1" />
                                                                    Resource Link
                                                                </a>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
}