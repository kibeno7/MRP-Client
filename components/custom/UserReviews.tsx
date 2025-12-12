"use client";

import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
  return (
    <div
      id="reviews"
      className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"
    >
      {/* UI: Radial gradient for the container to give a faded look to the grid background */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center mb-12">
        {/* UX: Clearer Hierarchy with a Kicker, Title, and Subtitle */}
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Success Stories
        </h2>
        <p className="mt-4 text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-lg text-center mx-auto">
          Hear from our juniors who cracked top companies using MRP.
        </p>
      </div>

      {/* UX: The cards section */}
      <div className="w-full relative">
        {/* UI: Gradient masks on sides so cards fade in/out smoothly */}
        <div className="absolute top-0 bottom-0 left-0 w-24 z-10 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 z-10 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />

        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
          pauseOnHover={true}
        />
      </div>
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
