import { User } from "@/types/User";
import { atom } from "recoil";

export const userAtom = atom<User | null>({
    key: 'userAtom',
    default: null,
})