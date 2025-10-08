import { atom } from 'recoil';

interface Interview {
    interviewee: {
        name: string,
        reg_no: string;
    };
    _id: string;
    company: string;
    status: string;
}

export const interviewState = atom<Interview[]>({
    key: 'interviewState',
    default: [{
        interviewee: {
            name: '',
            reg_no: ''
        },
        _id: '',
        company: '',
        status: ''
    }]
});
