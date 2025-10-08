"use client";
import React, { ReactNode } from "react";
import { RecoilRoot } from "recoil";

interface RecoilContextProviderProps {
    children: ReactNode;
}

const RecoilContextProvider: React.FC<RecoilContextProviderProps> = ({ children }) => {
    return <RecoilRoot>
        {children}
    </RecoilRoot>;
};

export default RecoilContextProvider;