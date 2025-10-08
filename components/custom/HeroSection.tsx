"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BackgroundLines } from '../ui/background-lines';
import { TypewriterEffectSmooth } from '../ui/typewriter-effect';
import { useRouter } from 'next/navigation';

const words = [{ text: "Interview" }, { text: "Questions" }, { text: "and" }, { text: "Insights" }, { text: "from" }, { text: "Seniors" }, { text: "with" }, { text: "MRP.", className: "text-blue-500 dark:text-blue-500 font-medium" }];

const HeroSection: React.FC = () => {
    const router = useRouter();
    return (
        <section id="home" className="relative h-[75vh] sm:h-[80vh] lg:min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
            <BackgroundLines className="w-full flex items-center justify-center">
                <div className="text-center z-10">
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Explore Real <span className="text-primary">Interview Experiences</span>
                    </motion.h1>

                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="flex justify-center">
                            <TypewriterEffectSmooth words={words} />
                        </div>
                        <Button size="lg" variant="default" onClick={() => router.push('/login')}>
                            Login Now
                        </Button>
                    </motion.div>
                </div>
            </BackgroundLines>
        </section>
    );
};

export default HeroSection;