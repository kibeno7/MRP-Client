"use client";

import { Card } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();
    return (
        <div className="flex h-screen bg-white">
            <button className="absolute z-50 top-4 left-4 transition-transform duration-300 hover:-translate-x-1 lg:text-white lg:top-4 lg:left-4">
                <ChevronLeft onClick={() => { router.push('/'); }} size={24} />
            </button>
            <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center">
                <div className="p-12 h-full flex flex-col justify-center items-center text-center relative">
                    <h2 className="text-5xl font-bold text-white mb-4">Welcome to Our Platform</h2>
                    <p className="text-blue-100 mb-8">Share and Explore the Interview Experience of Others.</p>
                    {/* <motion.img
                        src="/images/dashboard/dashboard-ss.png"
                        alt="Showcase"
                        className="absolute lg:-bottom-2 -right-40 xl:-right-0 h-auto transform transition-transform duration-100 ease-in-out rounded"
                        whileHover={{ scale: 1.1, translateY: -10 }}
                    /> */}
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    {children}
                </Card>
            </div>
        </div>
    );
};

export default Layout;