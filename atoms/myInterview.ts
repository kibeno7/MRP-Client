import { atom } from 'recoil';

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

export const myInterviewState = atom<Interview[]>({
    key: 'myInterviewState',
    default: [{
        company: '',
        createdAt: new Date(),
        offer: '',
        status: '',
        interviewee: {
            name: '',
            reg_no: ''
        },
        verification: {
            status: ''
        },
        _id: ''
    }]
});
