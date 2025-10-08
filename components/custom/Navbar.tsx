"use client";

import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    // const { theme, setTheme } = useTheme();
    const router = useRouter();

    const navItems = ['Home', 'Reviews', 'Team', 'Contact'];

    const variants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "-100%" },
    };

    // const toggleTheme = () => {
    //     setTheme(theme === 'dark' ? 'light' : 'dark');
    // };

    return (
        <nav className={`sticky top-0 z-50 bg-background/80 backdrop-blur-sm`}>
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <a href="#" className="text-2xl font-bold">MRP</a>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-8 items-center">
                    {navItems.map((item) => (
                        <li key={item}>
                            <a href={`#${item.toLowerCase()}`} className="hover:text-primary transition-colors">
                                {item}
                            </a>
                        </li>
                    ))}
                    {/* <li>
                        <Button variant="ghost" size="icon" onClick={toggleTheme}>
                            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                        </Button>
                    </li> */}
                </ul>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    {/* <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
                        {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                    </Button> */}
                    <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
                        <Menu />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <motion.div
                className={`fixed top-0 left-0 w-64 h-full bg-background shadow-lg md:hidden`}
                animate={isOpen ? "open" : "closed"}
                variants={variants}
                initial="closed"
                transition={{ duration: 0.3 }}
            >
                <div className={`p-4 w-full h-screen bg-white text-black`}>
                    <div className="flex justify-end mb-4">
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            <X />
                        </Button>
                    </div>
                    <ul className="space-y-4 text-center">
                        {navItems.map((item) => (
                            <li key={item}>
                                <a
                                    href={`#${item.toLowerCase()}`}
                                    className="block py-2 hover:text-primary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                        <Button size="sm" variant="default" onClick={() => router.push('/login')}>
                            Login Now
                        </Button>
                    </ul>
                </div>
            </motion.div>
        </nav>
    );
};

export default Navbar;