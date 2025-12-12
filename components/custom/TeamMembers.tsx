"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
  {
    id: 1,
    name: "Anshuman Mahato",
    role: "Full Stack Developer",
    github: "https://github.com/AnshumanMahato",
    linkedin: "https://www.linkedin.com/in/anshuman-mahato/",
    imgSource: "/images/team/anshuman-mahato.jpeg",
  },
  {
    id: 2,
    name: "Vinay Kumar",
    role: "Full Stack Developer",
    github: "https://github.com/vkumar8192449",
    linkedin: "https://www.linkedin.com/in/vk8192449/",
    imgSource: "/images/team/vinay-kumar.jpeg",
  },
  {
    id: 3,
    name: "Subrajeet Maharana",
    role: "Full Stack Developer",
    github: "https://github.com/subrajeet-maharana",
    linkedin: "https://www.linkedin.com/in/subrajeet-maharana/",
    imgSource: "/images/team/subrajeet-maharana.jpeg",
  },
  {
    id: 4,
    name: "Priyanshu Kumar",
    role: "Full Stack Developer",
    github: "https://github.com/Priyanshu-kr-gupta",
    linkedin: "https://www.linkedin.com/in/priyanshu-kumar-143995246/",
    imgSource: "/images/team/priyanshu.jpg",
  },
  {
    id: 5,
    name: "Apurba Sundar Nayak",
    role: "Full Stack Developer",
    github: "https://github.com/kibeno7",
    linkedin: "https://www.linkedin.com/in/apurba007/",
    imgSource: "/images/team/apurba.jpg",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const TeamMembers: React.FC = () => {
  return (
    <section
      id="team"
      className="relative py-24 bg-zinc-50 dark:bg-zinc-950 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            Meet Our Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-zinc-600 dark:text-zinc-400"
          >
            Passionate developers building the future of digital experiences.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          // Added xl:grid-cols-4 to allow more cards per row on large screens, filling space better with small cards
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
        >
          {teamMembers.map((member) => (
            <motion.div
              variants={cardVariants}
              key={member.id}
              // Changed max-w-sm to max-w-[280px] to make card narrower
              className="w-full max-w-[280px] h-full"
            >
              <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 hover:shadow-lg group">
                {/* Reduced padding from p-8 to p-5 */}
                <CardContent className="flex flex-col items-center p-5">
                  {/* Reduced margin from mb-6 to mb-4 */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    {/* Reduced image size from h-32 w-32 to h-24 w-24 */}
                    <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-md">
                      <Image
                        src={member.imgSource}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    {/* Reduced text size from text-xl to text-lg */}
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    {/* Slightly smaller badge text */}
                    <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                      {member.role}
                    </span>
                  </div>

                  {/* Reduced top margin from mt-8 to mt-5 */}
                  <div className="flex items-center gap-5 mt-5">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-all hover:scale-110"
                      aria-label="GitHub Profile"
                    >
                      <FaGithub className="h-5 w-5" />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-[#0077b5] dark:text-zinc-400 dark:hover:text-[#0077b5] transition-all hover:scale-110"
                      aria-label="LinkedIn Profile"
                    >
                      <IoLogoLinkedin className="h-6 w-6" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamMembers;
