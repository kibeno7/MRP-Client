"use client";

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();
    return (
        <div>
            <button className="absolute z-50 top-4 left-4 transition-transform duration-300 hover:-translate-x-1 lg:top-4 lg:left-4">
                <ChevronLeft onClick={() => { router.push('/'); }} size={24} />
            </button>
            <div >
                {children}
            </div>
        </div>
    );
};

export default Layout;