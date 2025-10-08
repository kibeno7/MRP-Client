import { atom } from 'recoil';

interface VerificationInterview {
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

export const verificationInterviewState = atom<VerificationInterview[]>({
    key: 'verificationInterviewState',
    default: [
        {
            verification: {
                status: '',
            },
            _id: '',
            interviewee: {
                name: '',
                reg_no: '',
            },
            company: '',
            status: '',
            offer: '',
            compensation: 0,
            createdAt: new Date(),
        },
    ],
});