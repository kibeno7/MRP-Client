"use client";

import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
    return (
        <div id="reviews" className="py-12 rounded-md flex flex-col antialiased dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
            <h2 className="text-2xl font-semibold text-center mb-8">What Juniors Say?</h2>
            <InfiniteMovingCards
                items={testimonials}
                direction="right"
                speed="slow"
            />
        </div>
    );
}

const testimonials = [
    {
        quote:
            "Learning from the experience of seniors was like unlocking the best study hacks. It gave me a clear direction on how to prepare, which made the toughest topics seem manageable. I couldn't have cracked the exam without their insights!",
        name: "Raghavendra Kumar Sharma",
        title: "Optum Healthcare",
    },
    {
        quote:
            "The advice I received helped me focus on what really mattered. It was like a roadmap through the chaos of preparation. The support and guidance from those who had been through it before was truly priceless.",
        name: "Anubhav Singh",
        title: "Texas Instruments",
    },
    {
        quote:
            "Before, I was just going through random resources. But learning from seniors helped me streamline my approach. Their personal experiences gave me confidence and clarity during the final stretch of exam prep.",
        name: "Aaditya Tripathi",
        title: "Optum Healthcare",
    },
    {
        quote:
            "The mentorship and shared experiences from seniors not only saved time but also gave me the confidence to tackle challenges head-on. It was the secret sauce to my exam success!",
        name: "Prashant Kumar",
        title: "Genpact",
    },
    {
        quote:
            "Understanding the preparation strategies that worked for my seniors helped me avoid common pitfalls. I was able to plan smarter, not harder, and that made all the difference during the exam.",
        name: "Ayush Soni",
        title: "Kratikal",
    },
];

