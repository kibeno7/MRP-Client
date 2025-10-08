import { User } from "@/types/User";
import { atom } from "recoil";

export const userAtom = atom<User>({
    key: 'userAtom',
    default: {
        _id: '',
        name: '',
        reg_no: '',
        batch: 0,
        role: '',
        email: '',
        password: '',
    },
})